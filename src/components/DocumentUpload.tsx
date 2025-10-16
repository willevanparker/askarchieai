import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const DocumentUpload = () => {
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
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in to upload documents.',
          variant: 'destructive',
        });
        return;
      }

      // Read file content
      const content = await file.text();

      // Call edge function to process document
      const { data, error } = await supabase.functions.invoke('upload-document', {
        body: {
          fileName: file.name,
          fileType: file.type,
          content: content,
          userId: user.id,
        },
      });

      if (error) throw error;

      toast({
        title: 'Document uploaded successfully',
        description: `${file.name} has been processed and added to your knowledge base.`,
      });

      // Reset input
      event.target.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload document',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg border">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Upload Knowledge Base</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Upload PDFs, CSVs, or text files to teach Archie about your business.
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

      <p className="text-xs text-muted-foreground mt-2 text-center">
        Supported formats: PDF, CSV, TXT
      </p>
    </div>
  );
};

export default DocumentUpload;