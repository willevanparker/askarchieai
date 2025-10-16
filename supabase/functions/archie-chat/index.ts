import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');
    if (!PERPLEXITY_API_KEY) throw new Error('PERPLEXITY_API_KEY not configured');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { message, sessionId } = await req.json();
    
    // Validate inputs
    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid message format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (message.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Message too long (max 2000 characters)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Message cannot be empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sanitizedMessage = message.trim();
    console.log(`Chat request from session ${sessionId}: ${sanitizedMessage.substring(0, 50)}...`);

    // Search for relevant document chunks
    const { data: chunks, error: chunksError } = await supabase
      .from('document_chunks')
      .select('chunk_text')
      .limit(3);

    if (chunksError) {
      console.error('Error fetching chunks:', chunksError);
    }

    // Search for relevant Q&A pairs
    const { data: qaPairs, error: qaError } = await supabase
      .from('qa_pairs')
      .select('question, answer')
      .limit(5);

    if (qaError) {
      console.error('Error fetching Q&A pairs:', qaError);
    }

    // Build context from chunks and Q&A
    let context = '';
    
    if (qaPairs && qaPairs.length > 0) {
      console.log(`Found ${qaPairs.length} Q&A pairs`);
      const qaContext = qaPairs.map(qa => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n');
      context += qaContext;
    }
    
    if (chunks && chunks.length > 0) {
      console.log(`Found ${chunks.length} document chunks`);
      const docContext = chunks.map(c => c.chunk_text).join('\n\n');
      if (context) context += '\n\n---\n\n';
      context += docContext;
    }
    
    if (!context) {
      console.log('No knowledge base content found');
    }

    // If no knowledge base content, use Perplexity for web search
    let finalMessage = sanitizedMessage;
    let systemPrompt = '';
    
    if (!context || context.trim().length === 0) {
      console.log('No knowledge base content, using Perplexity for web search');
      
      // Use Perplexity to search the web
      const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful automotive expert. Search for accurate, current information to answer car-related questions. Be precise and cite sources when possible.'
            },
            {
              role: 'user',
              content: sanitizedMessage
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1000,
        }),
      });

      if (!perplexityResponse.ok) {
        console.error('Perplexity API error:', await perplexityResponse.text());
        throw new Error('Failed to search web for information');
      }

      const perplexityData = await perplexityResponse.json();
      const webSearchResult = perplexityData.choices?.[0]?.message?.content;
      
      if (webSearchResult) {
        console.log('Got web search result from Perplexity');
        systemPrompt = `You are Archie, a helpful car expert assistant. Use the following web search results to answer the user's question accurately.

Web Search Results:
${webSearchResult}

Provide a clear, accurate answer based on this information.`;
      } else {
        systemPrompt = `You are Archie, a helpful car expert assistant. Provide general automotive advice and guidance.`;
      }
    } else {
      console.log('Using knowledge base content');
      systemPrompt = `You are Archie, a helpful car expert assistant. Use the following information from the knowledge base to answer questions. If the knowledge base doesn't contain relevant information, let the user know.

Knowledge Base:
${context}

Remember: Prioritize the knowledge base content when available.`;
    }

    // Skip chat history for anonymous users (can add session-based history later if needed)
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: sanitizedMessage }
    ];

    // Call Lovable AI with GPT-5
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-5',
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI gateway error');
    }

    // Skip storing messages for anonymous users
    // Stream response
    
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }

          // Skip storing for anonymous users
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' }
    });

  } catch (error) {
    console.error('Error in archie-chat:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});