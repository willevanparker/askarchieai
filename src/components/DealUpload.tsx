import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const DealUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type === 'application/pdf' || 
                         file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a PDF or image`,
          variant: "destructive",
        });
      }
      if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive",
        });
      }
      
      return isValidType && isValidSize;
    });

    setFiles(prev => [...prev, ...validFiles].slice(0, 3)); // Max 3 files
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Generate session ID
      const sessionId = crypto.randomUUID();
      
      // Upload files to storage
      const uploadPromises = files.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${sessionId}-${index}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('deal-documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;
        return filePath;
      });

      const filePaths = await Promise.all(uploadPromises);
      console.log("Files uploaded:", filePaths);

      // Analyze the first file (we can expand to analyze multiple later)
      const { data, error } = await supabase.functions.invoke("analyze-deal", {
        body: {
          filePath: filePaths[0],
          sessionId: sessionId,
        },
      });

      if (error) throw error;

      console.log("Analysis complete:", data);

      // Navigate to results page
      navigate(`/analysis-results?id=${data.analysisId}`);
    } catch (error) {
      console.error("Upload/analysis error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze deal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-8 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">Upload Your Deal</h3>
          <p className="text-muted-foreground">
            Upload up to 3 dealership quotes, worksheets, or contracts (PDF or image)
          </p>
        </div>

        <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center hover:border-primary/40 transition-colors">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="application/pdf,image/*"
            multiple
            onChange={handleFileChange}
            disabled={files.length >= 3 || isUploading}
          />
          <label
            htmlFor="file-upload"
            className={`cursor-pointer flex flex-col items-center gap-4 ${
              files.length >= 3 || isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload className="h-12 w-12 text-primary" />
            <div>
              <p className="text-lg font-medium">Click to upload files</p>
              <p className="text-sm text-muted-foreground mt-1">
                PDF or images (JPG, PNG) up to 10MB each
              </p>
            </div>
          </label>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected files ({files.length}/3):</p>
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="flex-1 text-sm truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeFile(index)}
                  disabled={isUploading}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={files.length === 0 || isUploading}
          className="w-full bg-primary hover:bg-primary-dark text-lg py-6"
          size="lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Deal"
          )}
        </Button>
      </div>
    </Card>
  );
};
