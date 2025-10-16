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

    const { fileName, fileType, content, sessionId } = await req.json();
    console.log(`Processing document: ${fileName} for session: ${sessionId}`);

    // Store the document without user_id (public knowledge base)
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: null,
        file_name: fileName,
        file_type: fileType,
        content: content
      })
      .select()
      .single();

    if (docError) {
      console.error('Error storing document:', docError);
      throw docError;
    }

    // Split content into chunks (simple approach: split by paragraphs, max 500 chars)
    const chunks = chunkText(content, 500);
    console.log(`Created ${chunks.length} chunks from document`);

    // Store chunks
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

    console.log('Document processed successfully');
    return new Response(
      JSON.stringify({ success: true, documentId: doc.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in upload-document:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Simple text chunking function
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