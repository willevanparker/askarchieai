import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// URL validation helper function
function validateURL(urlString: string): URL {
  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    throw new Error('Invalid URL format');
  }
  
  // Only allow http/https protocols
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Only HTTP(S) URLs are allowed');
  }
  
  // Block private IP ranges and localhost
  const hostname = url.hostname.toLowerCase();
  const blockedPatterns = [
    /^localhost$/i,
    /^127\.\d+\.\d+\.\d+$/,
    /^10\.\d+\.\d+\.\d+$/,
    /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/,
    /^192\.168\.\d+\.\d+$/,
    /^169\.254\.\d+\.\d+$/, // AWS metadata
    /^\[::1\]$/, // IPv6 localhost
    /^\[fe80:/, // IPv6 link-local
  ];
  
  if (blockedPatterns.some(pattern => pattern.test(hostname))) {
    throw new Error('Cannot scrape private or internal URLs');
  }
  
  return url;
}

// Error message helper
function getUserFriendlyError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('Unauthorized')) {
      return 'Authentication required';
    }
    if (error.message.includes('Invalid URL') || error.message.includes('Only HTTP')) {
      return error.message;
    }
    if (error.message.includes('Cannot scrape private')) {
      return 'Cannot scrape private or internal URLs';
    }
    if (error.message.includes('Content too large')) {
      return 'The website content is too large to process';
    }
    if (error.message.includes('Admin privileges')) {
      return 'Admin privileges required';
    }
  }
  return 'An error occurred while scraping the website. Please try again later.';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { url: urlString } = await req.json();
    
    // Validate the URL to prevent SSRF attacks
    const validatedURL = validateURL(urlString);
    console.log(`Scraping website: ${validatedURL.toString()}`);

    // Fetch the website content with timeout and size limits
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(validatedURL.toString(), {
      signal: controller.signal,
      redirect: 'follow',
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.statusText}`);
    }
    
    // Check content size
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10_000_000) {
      throw new Error('Content too large (maximum 10MB)');
    }

    const html = await response.text();
    
    // Simple HTML to text conversion (removes tags)
    const text = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Get authenticated user and verify admin role
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token!);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }
    
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

    // Store the document
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        file_name: urlString,
        file_type: 'text/html',
        content: text,
        source_type: 'website',
        metadata: { url: urlString }
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
    // Log full details server-side
    console.error('Error in scrape-website:', {
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