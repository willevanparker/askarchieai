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

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error('Unauthorized');
    
    // Verify admin role explicitly for defense-in-depth
    const { data: roles, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();
    
    if (roleError || !roles) {
      return new Response(
        JSON.stringify({ error: 'Admin privileges required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { fileName, fileType, content, sourceType = 'file' } = await req.json();
    console.log(`Processing document: ${fileName} (${sourceType})`);

    // Store the document with admin user_id
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        file_name: fileName,
        file_type: fileType,
        content: content,
        source_type: sourceType
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
    // Log full details server-side
    console.error('Error in upload-document:', {
      error: error instanceof Error ? error.message : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    // Return generic error to client
    const userMessage = getUserFriendlyError(error);
    return new Response(
      JSON.stringify({ error: userMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Error message helper
function getUserFriendlyError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('Unauthorized') || error.message.includes('authorization')) {
      return 'Authentication required';
    }
    if (error.message.includes('Admin privileges')) {
      return 'Admin privileges required';
    }
  }
  return 'An error occurred while processing the document. Please try again later.';
}

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