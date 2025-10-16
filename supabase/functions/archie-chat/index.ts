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
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { message, userId } = await req.json();
    console.log(`Chat request from user ${userId}: ${message.substring(0, 50)}...`);

    // Search for relevant chunks from user's documents
    const { data: userChunks, error: chunksError } = await supabase
      .from('document_chunks')
      .select(`
        chunk_text,
        documents!inner(user_id)
      `)
      .eq('documents.user_id', userId)
      .limit(5);

    if (chunksError) {
      console.error('Error fetching chunks:', chunksError);
    }

    // Build context from chunks
    let context = '';
    if (userChunks && userChunks.length > 0) {
      console.log(`Found ${userChunks.length} relevant chunks`);
      context = userChunks.map(c => c.chunk_text).join('\n\n');
    } else {
      console.log('No document chunks found for user');
    }

    // System prompt with hybrid approach (Option A)
    const systemPrompt = context 
      ? `You are Archie, a helpful car expert assistant. Use the following information from the knowledge base to answer questions. If the knowledge base doesn't contain relevant information, provide helpful general automotive advice but note that it's not company-specific.

Knowledge Base:
${context}

Remember: Prioritize the knowledge base content, but if it doesn't address the question, provide general helpful automotive guidance.`
      : `You are Archie, a helpful car expert assistant. Provide general automotive advice and guidance. Note: No specific company knowledge base is available yet, so responses are based on general automotive expertise.`;

    // Get recent chat history
    const { data: history } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history?.reverse() || []),
      { role: 'user', content: message }
    ];

    // Call Lovable AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
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

    // Store user message
    await supabase.from('chat_messages').insert({
      user_id: userId,
      role: 'user',
      content: message
    });

    // Stream response and collect for storage
    let fullResponse = '';
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
                    fullResponse += content;
                    controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }

          // Store assistant response
          if (fullResponse) {
            await supabase.from('chat_messages').insert({
              user_id: userId,
              role: 'assistant',
              content: fullResponse
            });
          }

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