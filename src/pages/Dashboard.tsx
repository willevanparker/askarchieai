import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Upload, LogOut, X } from "lucide-react";
import { DealUpload } from "@/components/DealUpload";

interface Analysis {
  id: string;
  rating: number | null;
  verdict: string | null;
  summary: string | null;
  negotiation_tip: string | null;
  created_at: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [dealHistory, setDealHistory] = useState<any[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
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

    setCurrentAnalysis(data);
  };

  const getRatingColor = (rating: number): string => {
    if (rating >= 8) return "text-green-600";
    if (rating >= 5) return "text-yellow-600";
    return "text-red-600";
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
          {credits === 0 && (
            <Button size="lg" onClick={() => navigate("/premium")}>
              Buy Credits - $9
            </Button>
          )}
        </Card>

        <DealUpload 
          onAnalysisComplete={async (analysisId) => {
            await fetchCredits(user.id);
            await fetchDealHistory(user.id);
            await fetchAnalysis(analysisId);
          }}
        />

        {/* Analysis Results */}
        {currentAnalysis && (
          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Analysis Results</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentAnalysis(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-center space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Deal Rating</p>
                  <p className={`text-6xl font-bold ${currentAnalysis.rating ? getRatingColor(currentAnalysis.rating) : ''}`}>
                    {currentAnalysis.rating ? currentAnalysis.rating.toFixed(1) : 'N/A'}
                    <span className="text-2xl text-muted-foreground">/10</span>
                  </p>
                </div>

                {currentAnalysis.verdict && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Verdict</p>
                    <p className="text-lg font-semibold">{currentAnalysis.verdict}</p>
                  </div>
                )}
              </div>

              {currentAnalysis.summary && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Summary</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentAnalysis.summary}
                  </p>
                </div>
              )}

              {currentAnalysis.negotiation_tip && (
                <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h3 className="text-lg font-semibold text-primary">Negotiation Tip</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentAnalysis.negotiation_tip}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  onClick={() => setCurrentAnalysis(null)}
                  className="flex-1"
                >
                  Analyze Another Deal
                </Button>
                <Button 
                  onClick={() => navigate("/chat")}
                  variant="outline"
                  className="flex-1"
                >
                  Ask Archie a Question
                </Button>
              </div>
            </div>
          </Card>
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
