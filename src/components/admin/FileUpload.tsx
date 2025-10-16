import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const FileUpload = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['text/plain', 'text/csv', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF, CSV, or TXT file.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      const content = await file.text();

      const { data, error } = await supabase.functions.invoke('upload-document', {
        body: {
          fileName: file.name,
          fileType: file.type,
          content: content,
          sourceType: 'file',
        },
      });

      if (error) throw error;

      toast({
        title: 'File uploaded successfully',
        description: `${file.name} has been processed and added to the knowledge base.`,
      });

      event.target.value = '';
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload file',
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
          <FileText className="w-5 h-5" />
          Upload Files
        </CardTitle>
        <CardDescription>
          Upload PDF, CSV, or text files to add to Archie's knowledge base
        </CardDescription>
      </CardHeader>
      <CardContent>
        <label className="block">
          <Input
            type="file"
            accept=".pdf,.csv,.txt"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="file-input"
          />
          <Button
            asChild
            disabled={uploading}
            className="w-full cursor-pointer"
            size="lg"
          >
            <label htmlFor="file-input" className="cursor-pointer flex items-center justify-center gap-2">
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Choose File to Upload
                </>
              )}
            </label>
          </Button>
        </label>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Supported formats: PDF, CSV, TXT
        </p>
      </CardContent>
    </Card>
  );
};

export default FileUpload;