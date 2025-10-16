import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Globe, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const WebsiteUpload = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('scrape-website', {
        body: { url },
      });

      if (error) throw error;

      toast({
        title: 'Website scraped successfully',
        description: 'Content has been added to the knowledge base.',
      });

      setUrl('');
    } catch (error) {
      toast({
        title: 'Scraping failed',
        description: error instanceof Error ? error.message : 'Failed to scrape website',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Scrape Website
        </CardTitle>
        <CardDescription>
          Enter a URL to scrape and add its content to the knowledge base
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Scraping Website...
              </>
            ) : (
              'Scrape and Add to Knowledge Base'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WebsiteUpload;