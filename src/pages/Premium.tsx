import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { DealUpload } from "@/components/DealUpload";

import exampleInput from "@/assets/example-input.png";
import exampleOutput from "@/assets/archie-output-v2.png";
import { CheckCircle2, Upload, Zap, FileLineChart, Star, MessageCircle, X, Mail } from "lucide-react";

interface Analysis {
  id: string;
  rating: number | null;
  verdict: string | null;
  summary: string | null;
  negotiation_tip: string | null;
  trade_in_note: string | null;
  created_at: string;
}

export default function Premium() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  // INSIGHTS_EMAIL_CAPTURE: Email capture state
  const [emailForReport, setEmailForReport] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchAnalysis = async (analysisId: string) => {
    if (!analysisId) {
      console.error("No analysis ID provided");
      toast({
        title: "Error",
        description: "Analysis failed to complete. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from("deal_analyses")
      .select("*")
      .eq("id", analysisId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching analysis:", error);
      toast({
        title: "Error",
        description: "Failed to load analysis results.",
        variant: "destructive",
      });
      return;
    }

    if (!data) {
      console.error("Analysis not found for ID:", analysisId);
      toast({
        title: "Error",
        description: "Analysis not found. Please try uploading again.",
        variant: "destructive",
      });
      return;
    }

    setCurrentAnalysis(data);
  };

  const getRatingColor = (rating: number): string => {
    if (rating >= 7) return "text-green-600";
    if (rating >= 5) return "text-yellow-600";
    return "text-red-600";
  };

  const handleGetPremium = async () => {
    // PAYWALL TEMPORARILY DISABLED - Show upload directly on this page
    setShowUpload(true);
    // Scroll to upload section
    setTimeout(() => {
      document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return;

    // PAYWALL TEMPORARILY DISABLED - Original checkout flow below
    // if (!user) {
    //   toast({
    //     title: "Sign in required",
    //     description: "Please sign in to purchase credits.",
    //   });
    //   navigate("/auth");
    //   return;
    // }

    // setIsLoading(true);
    // try {
    //   const { data, error } = await supabase.functions.invoke("create-checkout");

    //   if (error) throw error;

    //   if (data?.url) {
    //     toast({
    //       title: "Redirecting to checkout",
    //       description: "Opening Stripe payment page...",
    //     });
    //     window.open(data.url, "_blank");
    //   }
    // } catch (error: any) {
    //   console.error("Error creating checkout:", error);
    //   toast({
    //     title: "Error",
    //     description: "Failed to create checkout session. Please try again.",
    //     variant: "destructive",
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
  };

  // INSIGHTS_EMAIL_CAPTURE: Function to send report via email
  const handleSendEmail = async () => {
    if (!emailForReport || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForReport)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!currentAnalysis) {
      toast({
        title: "No analysis available",
        description: "Please complete an analysis first.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingEmail(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-insights-email", {
        body: {
          email: emailForReport,
          analysis: {
            summary: currentAnalysis.summary,
            rating: currentAnalysis.rating,
            verdict: currentAnalysis.verdict,
            trade_in_note: currentAnalysis.trade_in_note,
            negotiation_tip: currentAnalysis.negotiation_tip,
          },
        },
      });

      if (error) throw error;
      if (!data?.success) {
        throw new Error(data?.error || "Email was not sent");
      }

      setEmailSent(true);
      toast({
        title: "Email sent!",
        description: data?.used_fallback
          ? "Sent from onboarding@resend.dev (temporary). We'll switch to askarchie.ai once verified."
          : "Check your inbox for your Insights report.",
      });
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast({
        title: "Error sending email",
        description: error?.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-primary">A</span>rch<span className="text-primary">i</span>e Insights
            </h1>
            {/* PAYWALL TEMPORARILY DISABLED - Updated messaging */}
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              <span className="text-primary font-bold">Try it free!</span> No subscription or payment required.
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-dark text-lg px-8 py-6"
              onClick={handleGetPremium}
              disabled={isLoading}
            >
              Try Insights Free
            </Button>
            {/* PAYWALL TEMPORARILY DISABLED - Original pricing and auth button
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              No subscription required. <span className="text-primary font-bold">Just $9.</span>
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-dark text-lg px-8 py-6"
              onClick={handleGetPremium}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : user ? "Get Insights" : "Sign In / Sign Up"}
            </Button>
            */}

            {/* Product Boxes */}
            <div className="mt-12 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Analysis - Selected */}
                <Card className="p-6 border-2 border-primary hover:shadow-lg transition-shadow duration-300 text-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <FileLineChart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Get AI-powered insights, ratings, and actionable tips
                  </p>
                </Card>

                {/* Dealer Ratings - Beta */}
                <Card className="p-6 border-border opacity-60 cursor-not-allowed relative text-center">
                  <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    Beta
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Dealer Ratings</h3>
                  <p className="text-sm text-muted-foreground">
                    Post and see dealer reviews to make informed decisions
                  </p>
                </Card>

                {/* Live Chat - Beta */}
                <Card className="p-6 border-border opacity-60 cursor-not-allowed relative text-center">
                  <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    Beta
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                  <p className="text-sm text-muted-foreground">
                    Chat live with a representative for in-depth support
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 sm:py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
              {/* PAYWALL TEMPORARILY DISABLED - Updated copy */}
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Car shopping? Archie will analyze your documents — now free to try!
              </p>
              {/* PAYWALL TEMPORARILY DISABLED - Original: Car shopping? Archie will analyze up to 5 documents for just $9. */}
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <div className="text-2xl font-bold text-primary">1</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Upload className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-semibold">Upload Your Quote</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Take a photo or upload a worksheet, quote, or contract (PDF, JPG, PNG supported). Insure the document is legible and all details — VIN, city & state, pricing, fees, add-ons, etc — are present.{" "}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="text-primary hover:underline font-medium">
                            Here's an example.
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                          <img 
                            src={exampleInput} 
                            alt="Example dealership quote" 
                            className="w-full h-auto"
                          />
                        </DialogContent>
                      </Dialog>
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <div className="text-2xl font-bold text-primary">2</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-semibold">Archie Analyzes</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Archie analyzes your upload, comparing pricing, fees, and add-ons against market data and provides AI-supercharged feedback, including a deal rating, smart summary, and negotiation tips.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-8 max-w-4xl mx-auto">
              <Card className="p-8 bg-primary/5 border-primary/20">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">The analysis includes:</h3>
                  <div className="grid sm:grid-cols-3 gap-6 text-left">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold mb-1">Deal Rating</div>
                        <p className="text-sm text-muted-foreground">Clear score out of 10 with verdict</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold mb-1">Smart Summary</div>
                        <p className="text-sm text-muted-foreground">Breakdown of fees, discounts, and red flags</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold mb-1">Negotiation Tips</div>
                        <p className="text-sm text-muted-foreground">Specific advice to improve your deal and potentially save money</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Example Input & Output */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4"><span className="text-primary">A</span>rch<span className="text-primary">i</span>e in Action</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Here's an example of an uploaded document and Archie's Analysis.
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Example Input */}
              <Card className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 bg-primary/10 rounded flex items-center justify-center">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">What You Upload</h3>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <img 
                    src={exampleInput} 
                    alt="Example dealership quote showing vehicle details and pricing" 
                    className="w-full h-auto rounded border"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  A photo or scan of your dealership quote, worksheet, or contract
                </p>
              </Card>

              {/* Arrow Indicator */}
              <div className="flex justify-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
              </div>

              {/* Example Output */}
              <Card className="p-6 sm:p-8 bg-gradient-to-br from-background to-primary/5 border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 bg-primary/10 rounded flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">What Archie Delivers</h3>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <img 
                    src={exampleOutput} 
                    alt="Archie's analysis showing deal rating, summary, and negotiation tips" 
                    className="w-full h-auto rounded border"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  A detailed analysis with rating, summary, and actionable tips. Reminder: Archie can make mistakes. Check important info.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* PAYWALL TEMPORARILY DISABLED - Upload Section */}
        {showUpload && (
          <section id="upload-section" className="py-16 sm:py-20 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <DealUpload 
                onAnalysisComplete={async (result) => {
                  // Support both legacy (string id) and new full-payload
                  if (typeof result === "string") {
                    await fetchAnalysis(result);
                  } else if (result && typeof result === "object") {
                    setCurrentAnalysis({
                      id: result.analysisId,
                      rating: result.rating,
                      verdict: result.verdict,
                      summary: result.summary,
                      negotiation_tip: result.negotiation_tip,
                      trade_in_note: result.trade_in_note,
                      created_at: new Date().toISOString(),
                    });
                  }
                  // Scroll to results
                  setTimeout(() => {
                    document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 500);
                }}
              />
            </div>
          </section>
        )}

        {/* PAYWALL TEMPORARILY DISABLED - Analysis Results Section */}
        {currentAnalysis && (
          <section id="results-section" className="py-16 sm:py-20 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
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

                  {currentAnalysis.summary && (
                    <div className="bg-muted/50 border-l-4 border-primary p-4 rounded">
                      <p className="font-medium mb-2">Summary:</p>
                      <p className="text-muted-foreground text-sm">
                        {currentAnalysis.summary}
                      </p>
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

                {/* INSIGHTS_EMAIL_CAPTURE: Email capture form */}
                <div className="mt-6 pt-6 border-t">
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      Want this report emailed to you?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Get a copy of your Insights report in your inbox
                    </p>
                  </div>
                  
                  {!emailSent ? (
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={emailForReport}
                        onChange={(e) => setEmailForReport(e.target.value)}
                        disabled={isSendingEmail}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendEmail}
                        disabled={isSendingEmail || !emailForReport}
                        className="bg-primary hover:bg-primary-dark"
                      >
                        {isSendingEmail ? "Sending..." : "Send Report"}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">Report sent to {emailForReport}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </section>
        )}



        {/* CTA */}
        <section className="py-16 sm:py-20 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="text-primary">A</span>rch<span className="text-primary">i</span>e Insights
            </h2>
            {/* PAYWALL TEMPORARILY DISABLED - Updated messaging */}
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              <span className="text-primary font-bold">Try it free!</span> No subscription or payment required.
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-dark text-lg px-8 py-6"
              onClick={handleGetPremium}
              disabled={isLoading}
            >
              Try Insights Free
            </Button>
            {/* PAYWALL TEMPORARILY DISABLED - Original pricing and auth button
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              No subscription required. <span className="text-primary font-bold">Just $9.</span>
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-dark text-lg px-8 py-6"
              onClick={handleGetPremium}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : user ? "Get Insights" : "Sign In / Sign Up"}
            </Button>
            */}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
