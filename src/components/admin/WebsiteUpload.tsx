import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Globe, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const WebsiteUpload = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch website content
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch website');
      
      const html = await response.text();
      
      // Simple HTML to text conversion (strip tags)
      const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

      const { error } = await supabase.functions.invoke('upload-document', {
        body: {
          fileName: `Website: ${new URL(url).hostname}`,
          fileType: 'text/html',
          content: text.substring(0, 50000), // Limit to 50k chars
          userId: user.id,
        },
      });

      if (error) throw error;

      toast({
        title: 'Website content uploaded',
        description: 'Website has been scraped and added to the knowledge base.',
      });

      setUrl('');
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload website',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Scrape Website</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Website URL</Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/page"
          required
        />
      </div>

      <p className="text-sm text-muted-foreground">
        The website will be scraped and its content added to Archie's knowledge base.
      </p>

      <Button type="submit" disabled={uploading} className="w-full">
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Scraping...
          </>
        ) : (
          'Scrape & Upload'
        )}
      </Button>
    </form>
  );
};

export default WebsiteUpload;