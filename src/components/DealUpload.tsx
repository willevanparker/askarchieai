import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  name: string;
  analysis: string;
}

interface DealUploadProps {
  onAnalysisComplete?: (
    result:
      | string
      | {
          analysisId: string;
          deal_type: string;
          rating: number | null;
          verdict: string | null;
          categories: Category[];
          negotiation_tip: string | null;
          trade_in_note: string | null;
        }
  ) => void;
}

export function DealUpload({ onAnalysisComplete }: DealUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter((file) => {
      const isValidType =
        file.type === "application/pdf" || file.type.startsWith("image/");
      const isValidSize = file.size <= 10 * 1024 * 1024;

      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} must be a PDF or image`,
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

    setFiles((prev) => [...prev, ...validFiles].slice(0, 1));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one document to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // PAYWALL TEMPORARILY DISABLED - Check if user has credits
      // const { data: { user } } = await supabase.auth.getUser();
      
      // if (!user) {
      //   toast({
      //     title: "Authentication required",
      //     description: "Please sign in to analyze deals.",
      //     variant: "destructive",
      //   });
      //   navigate("/auth");
      //   return;
      // }

      // PAYWALL TEMPORARILY DISABLED - Consume a credit
      // const { data: consumeResult, error: consumeError } = await supabase.rpc(
      //   "consume_credit",
      //   { user_uuid: user.id }
      // );

      // if (consumeError || !consumeResult) {
      //   toast({
      //     title: "No credits available",
      //     description: "Please purchase more credits to continue.",
      //     variant: "destructive",
      //   });
      //   setIsAnalyzing(false);
      //   navigate("/premium");
      //   return;
      // }

      toast({
        title: "Analysis started",
        description: "Uploading your deal for analysis...",
      });

      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      let uploadedFilePath = "";

      // Upload the first file to Supabase Storage
      const file = files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${sessionId}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("deal-documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      uploadedFilePath = filePath;

      // Call the analyze-deal edge function
      const { data, error } = await supabase.functions.invoke("analyze-deal", {
        body: { sessionId, filePath: uploadedFilePath },
      });

      if (error) throw error;

      // PAYWALL TEMPORARILY DISABLED - Store in user's deal history
      // const { error: historyError } = await supabase
      //   .from("user_deal_history")
      //   .insert({
      //     user_id: user.id,
      //     analysis_id: data.analysisId,
      //     file_name: file.name,
      //     file_path: uploadedFilePath,
      //   });

      // if (historyError) {
      //   console.error("Error saving to history:", historyError);
      // }

      toast({
        title: "Analysis complete!",
        description: "Your deal has been analyzed successfully.",
      });

      // Clear the file selection
      setFiles([]);

      // Notify parent component with analysis details (fallback to ID-only if needed)
      if (onAnalysisComplete) {
        onAnalysisComplete({
          analysisId: data.analysisId,
          deal_type: data.deal_type ?? "purchase",
          rating: data.rating ?? null,
          verdict: data.verdict ?? null,
          categories: data.categories ?? [],
          negotiation_tip: data.negotiation_tip ?? null,
          trade_in_note: data.trade_in_note ?? null,
        });
      }
    } catch (error: any) {
      console.error("Error analyzing deal:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze deal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="p-8 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">Upload</h3>
          <p className="text-muted-foreground">
            Upload a quote, worksheet, or contract (PDF or image)
          </p>
        </div>

        <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center hover:border-primary/40 transition-colors">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="application/pdf,image/*"
            onChange={handleFileChange}
            disabled={files.length >= 1 || isAnalyzing}
          />
          <label
            htmlFor="file-upload"
            className={`cursor-pointer flex flex-col items-center gap-4 ${
              files.length >= 1 || isAnalyzing
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <Upload className="h-12 w-12 text-primary" />
            <div>
              <p className="text-lg font-medium">Click to upload files</p>
              <p className="text-sm text-muted-foreground mt-1">
                PDF or images (JPG, PNG) up to 10MB
              </p>
            </div>
          </label>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected file:</p>
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
                  disabled={isAnalyzing}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={handleAnalyze}
          disabled={files.length === 0 || isAnalyzing}
          className="w-full"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </Card>
  );
}
