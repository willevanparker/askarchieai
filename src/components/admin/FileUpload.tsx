import { useState } from 'react';
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const content = await file.text();

      const { error } = await supabase.functions.invoke('upload-document', {
        body: {
          fileName: file.name,
          fileType: file.type,
          content: content,
          userId: user.id,
        },
      });

      if (error) throw error;

      toast({
        title: 'File uploaded successfully',
        description: `${file.name} has been processed and added to the knowledge base.`,
      });

      event.target.value = '';
    } catch (error) {
      console.error('Upload error:', error);
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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Upload Files</h3>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Upload PDF, CSV, or TXT files to add to Archie's knowledge base.
      </p>

      <label className="block">
        <Input
          type="file"
          accept=".pdf,.csv,.txt"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
          id="file-upload"
        />
        <Button
          asChild
          disabled={uploading}
          className="w-full cursor-pointer"
        >
          <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center gap-2">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Choose File
              </>
            )}
          </label>
        </Button>
      </label>

      <p className="text-xs text-muted-foreground text-center">
        Supported formats: PDF, CSV, TXT
      </p>
    </div>
  );
};

export default FileUpload;