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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { url } = await req.json();
    console.log(`Scraping website: ${url}`);

    // Fetch the website content
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.statusText}`);
    }

    const html = await response.text();
    
    // Simple HTML to text conversion (removes tags)
    const text = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Get authenticated user (admin)
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token!);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Store the document
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        file_name: url,
        file_type: 'text/html',
        content: text,
        source_type: 'website',
        metadata: { url }
      })
      .select()
      .single();

    if (docError) {
      console.error('Error storing document:', docError);
      throw docError;
    }

    // Chunk the text
    const chunks = chunkText(text, 500);
    const chunkInserts = chunks.map((chunk, index) => ({
      document_id: doc.id,
      chunk_text: chunk,
      chunk_index: index
    }));

    const { error: chunkError } = await supabase
      .from('document_chunks')
      .insert(chunkInserts);

    if (chunkError) {
      console.error('Error storing chunks:', chunkError);
      throw chunkError;
    }

    console.log('Website scraped successfully');
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scrape-website:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function chunkText(text: string, maxChunkSize: number): string[] {
  const chunks: string[] = [];
  const paragraphs = text.split(/\n\n+/);
  
  let currentChunk = '';
  
  for (const para of paragraphs) {
    if (currentChunk.length + para.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = para;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.filter(c => c.length > 0);
}