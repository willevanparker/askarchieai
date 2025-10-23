import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Zap, Loader2, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Category {
  name: string;
  analysis: string;
}

interface Analysis {
  id: string;
  rating: number;
  verdict: string;
  deal_type: string;
  categories: string | Category[];
  negotiation_tip: string;
  trade_in_note: string | null;
  created_at: string;
}

const AnalysisResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const analysisId = searchParams.get("id");
  
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!analysisId) {
      setError("No analysis ID provided");
      setIsLoading(false);
      return;
    }

    const fetchAnalysis = async () => {
      try {
        const { data, error } = await supabase
          .from("deal_analyses")
          .select("*")
          .eq("id", analysisId)
          .single();

        if (error) throw error;
        
        // Parse categories if stored as string
        if (data && typeof data.categories === 'string') {
          try {
            data.categories = JSON.parse(data.categories);
          } catch (e) {
            console.error("Error parsing categories:", e);
            data.categories = [];
          }
        }
        
        setAnalysis(data);
      } catch (err) {
        console.error("Error fetching analysis:", err);
        setError("Failed to load analysis results");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [analysisId]);

  const getRatingColor = (rating: number) => {
    if (rating >= 7) return "text-green-500"; // Good (7-8) and Excellent (9-10)
    if (rating >= 5) return "text-yellow-500"; // Fair (5-6)
    return "text-red-500"; // Poor (1-4)
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg text-muted-foreground">Loading your analysis...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4">
          <Card className="p-8 max-w-md text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Analysis Not Found</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => navigate("/premium")}>
              Back to Insights
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-accent">A</span>rch<span className="text-accent">i</span>e's Analysis
            </h1>
          </div>

          <Card className="p-6 sm:p-8 bg-gradient-to-br from-background to-primary/5 border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 bg-primary/10 rounded flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold">
                {analysis.deal_type === 'lease' ? 'Lease' : 'Purchase'} Deal Analysis
              </h3>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-semibold">Rating:</span>
                <CheckCircle2 className={`h-5 w-5 ${getRatingColor(analysis.rating)}`} />
                <span className={`text-lg font-bold ${getRatingColor(analysis.rating)}`}>
                  {analysis.verdict} ({analysis.rating} / 10)
                </span>
              </div>

              {/* Category-based Analysis */}
              {Array.isArray(analysis.categories) && analysis.categories.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-base mb-3">Category Breakdown:</h4>
                  {analysis.categories.map((category, index) => (
                    <div key={index} className="bg-muted/50 border-l-4 border-primary p-4 rounded">
                      <p className="font-medium mb-2">{category.name}</p>
                      <p className="text-muted-foreground text-sm whitespace-pre-line">
                        {category.analysis}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-background/80 p-4 rounded-lg border">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 bg-primary/10 rounded flex items-center justify-center flex-shrink-0 mt-1">
                  💡
                </div>
                <div>
                  <p className="font-semibold mb-2">Archie's Negotiation Tip</p>
                  <p className="text-sm text-muted-foreground">
                    {analysis.negotiation_tip}
                  </p>
                </div>
              </div>
            </div>

            {analysis.trade_in_note && (
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900 mt-4">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 bg-blue-500/10 rounded flex items-center justify-center flex-shrink-0 mt-1">
                    ℹ️
                  </div>
                  <div>
                    <p className="font-semibold mb-2 text-blue-900 dark:text-blue-100">Trade-In Notice</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {analysis.trade_in_note}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate("/premium#upload")}
              size="lg"
            >
              Upload
            </Button>
            <Button
              onClick={() => navigate("/chat")}
              size="lg"
              className="bg-primary hover:bg-primary-dark"
            >
              Ask Archie Questions
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AnalysisResults;
