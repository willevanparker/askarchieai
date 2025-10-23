import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Upload, LogOut, X, Zap, CheckCircle2 } from "lucide-react";
import { DealUpload } from "@/components/DealUpload";

interface Category {
  name: string;
  analysis: string;
}

interface Analysis {
  id: string;
  rating: number | null;
  verdict: string | null;
  deal_type: string;
  categories: Category[];
  negotiation_tip: string | null;
  trade_in_note: string | null;
  created_at: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [dealHistory, setDealHistory] = useState<any[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }
    
    setUser(user);
    await fetchCredits(user.id);
    await fetchDealHistory(user.id);
    setLoading(false);
  };

  const fetchCredits = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching credits:", error);
      return;
    }

    setCredits(data?.credits || 0);
  };

  const fetchDealHistory = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_deal_history")
      .select(`
        id,
        file_name,
        created_at,
        analysis_id
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching deal history:", error);
      return;
    }

    setDealHistory(data || []);
  };

  const fetchAnalysis = async (analysisId: string) => {
    const { data, error } = await supabase
      .from("deal_analyses")
      .select("*")
      .eq("id", analysisId)
      .single();

    if (error) {
      console.error("Error fetching analysis:", error);
      toast({
        title: "Error",
        description: "Failed to load analysis results.",
        variant: "destructive",
      });
      return;
    }

    // Parse categories if stored as string
    const parsedData = { ...data } as any;
    if (parsedData && typeof parsedData.categories === 'string') {
      try {
        parsedData.categories = JSON.parse(parsedData.categories);
      } catch (e) {
        console.error("Error parsing categories:", e);
        parsedData.categories = [];
      }
    }
    
    setCurrentAnalysis(parsedData as Analysis);
  };

  const getRatingColor = (rating: number): string => {
    if (rating >= 7) return "text-green-500"; // Good (7-8) and Excellent (9-10)
    if (rating >= 5) return "text-yellow-500"; // Fair (5-6)
    return "text-red-500"; // Poor (1-4)
  };

  const handleBuyMore = async () => {
    setIsCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout");

      if (error) throw error;

      if (data?.url) {
        toast({
          title: "Redirecting to checkout",
          description: "Opening Stripe payment page...",
        });
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      console.error("Error creating checkout:", error);
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">{user?.email}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Card className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <CreditCard className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your Credits</h2>
          <div className="text-5xl font-bold text-primary mb-4">{credits}</div>
          <p className="text-muted-foreground mb-6">
            {credits === 0
              ? "You have no credits. Purchase credits for Archie to analyze documents."
              : `You have ${credits} ${credits === 1 ? "credit" : "credits"} remaining.`}
          </p>
          <Button 
            size="lg" 
            onClick={handleBuyMore}
            disabled={isCheckoutLoading}
          >
            {isCheckoutLoading ? "Loading..." : "Buy more"}
          </Button>
        </Card>

        <DealUpload 
          onAnalysisComplete={async (result) => {
            await fetchCredits(user.id);
            await fetchDealHistory(user.id);
            if (typeof result === "string") {
              await fetchAnalysis(result);
            } else if (result && typeof result === "object") {
              setCurrentAnalysis({
                id: result.analysisId,
                rating: result.rating,
                verdict: result.verdict,
                deal_type: result.deal_type,
                categories: result.categories,
                negotiation_tip: result.negotiation_tip,
                trade_in_note: result.trade_in_note,
                created_at: new Date().toISOString(),
              });
            }
          }}
        />

        {/* Analysis Results */}
        {currentAnalysis && (
          <div className="space-y-6">
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-background to-primary/5 border-primary/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-primary/10 rounded flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Archie's Analysis</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentAnalysis(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-semibold">Rating:</span>
                  <CheckCircle2 className={`h-5 w-5 ${currentAnalysis.rating ? getRatingColor(currentAnalysis.rating) : ''}`} />
                  <span className={`text-lg font-bold ${currentAnalysis.rating ? getRatingColor(currentAnalysis.rating) : ''}`}>
                    {currentAnalysis.verdict} ({currentAnalysis.rating ? currentAnalysis.rating.toFixed(1) : 'N/A'} / 10)
                  </span>
                </div>

                {currentAnalysis.categories && currentAnalysis.categories.length > 0 && (
                  <div className="space-y-3">
                    <p className="font-medium text-sm">Category Breakdown:</p>
                    {currentAnalysis.categories.map((category, index) => (
                      <div key={index} className="bg-muted/50 border-l-4 border-primary p-4 rounded">
                        <p className="font-medium mb-2 text-sm">{category.name}</p>
                        <p className="text-muted-foreground text-sm whitespace-pre-line">
                          {category.analysis}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {currentAnalysis.negotiation_tip && (
                <div className="bg-background/80 p-4 rounded-lg border">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 bg-primary/10 rounded flex items-center justify-center flex-shrink-0 mt-1">
                      💡
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Archie's Negotiation Tip</p>
                      <p className="text-sm text-muted-foreground">
                        {currentAnalysis.negotiation_tip}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {currentAnalysis.trade_in_note && (
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 bg-blue-500/10 rounded flex items-center justify-center flex-shrink-0 mt-1">
                      ℹ️
                    </div>
                    <div>
                      <p className="font-semibold mb-2 text-blue-900 dark:text-blue-100">Trade-In Notice</p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {currentAnalysis.trade_in_note}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Deal History Section */}
        {dealHistory.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Analyses</h3>
            <div className="space-y-3">
              {dealHistory.map((deal) => (
                <div
                  key={deal.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => navigate(`/analysis-results?id=${deal.analysis_id}`)}
                >
                  <div className="flex items-center gap-3">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{deal.file_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(deal.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
}
