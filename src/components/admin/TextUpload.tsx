import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Type, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const TextUpload = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setUploading(true);

    try {
      const { data, error } = await supabase.functions.invoke('upload-document', {
        body: {
          fileName: title,
          fileType: 'text/plain',
          content: content,
          sourceType: 'text',
        },
      });

      if (error) throw error;

      toast({
        title: 'Text uploaded successfully',
        description: 'Your text has been added to the knowledge base.',
      });

      setTitle('');
      setContent('');
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload text',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="w-5 h-5" />
          Add Text Content
        </CardTitle>
        <CardDescription>
          Manually enter text content to add to the knowledge base
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Warranty Information"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the text content here..."
              rows={10}
              required
            />
          </div>
          <Button type="submit" disabled={uploading} className="w-full" size="lg">
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Add to Knowledge Base'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TextUpload;