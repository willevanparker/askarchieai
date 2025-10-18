import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { DealUpload } from "@/components/DealUpload";
import exampleDeal from "@/assets/example-deal.png";
import { CheckCircle2, Upload, Zap } from "lucide-react";

export default function Premium() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<number>(0);

  useEffect(() => {
    checkAuth();
  }, []);


  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      await fetchCredits(user.id);
    }
  };

  const fetchCredits = async (userId: string) => {
    const { data } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", userId)
      .maybeSingle();

    setCredits(data?.credits || 0);
  };

  const handleGetPremium = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to purchase credits.",
      });
      navigate("/auth");
      return;
    }

    setIsLoading(true);
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
      setIsLoading(false);
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
              <span className="text-accent">A</span>rch<span className="text-accent">i</span>e Premium
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              No subscription required. <span className="text-primary font-bold">Just $9.</span>
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-dark text-lg px-8 py-6"
              onClick={handleGetPremium}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : user ? "Get Premium" : "Sign In to Purchase"}
            </Button>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 sm:py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Car shopping? Archie will analyze up to five documents for just $9.
              </p>
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
                      Take a photo or upload a worksheet, quote, or contract (PDF, JPG, PNG supported). Include all the details — city & state, pricing, fees, add-ons, everything.{" "}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="text-primary hover:underline font-medium">
                            Here's an example.
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                          <img 
                            src={exampleDeal} 
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

        {/* Example Results Preview */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
              <Card className="p-6 sm:p-8 bg-gradient-to-br from-background to-primary/5 border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 bg-primary/10 rounded flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Archie's Analysis</h3>
                </div>
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-semibold">Rating:</span>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-lg font-bold text-green-500">Good Deal (8.4 / 10)</span>
                  </div>
                  <div className="bg-muted/50 border-l-4 border-primary p-4 rounded">
                    <p className="font-medium mb-2">Summary:</p>
                    <p className="text-muted-foreground text-sm">
                      You're getting a 20% discount off MSRP — well above market average. The only negotiation targets are the $1,633 doc fee and the $392 Perma Plate. If you can trim those back or get a free service thrown in, it would be an excellent deal.
                    </p>
                  </div>
                </div>
                <div className="bg-background/80 p-4 rounded-lg border">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 bg-primary/10 rounded flex items-center justify-center flex-shrink-0 mt-1">
                      💡
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Archie's Negotiation Tip</p>
                      <p className="text-sm text-muted-foreground">
                        "Ask the dealer to waive the Perma Plate and reduce the doc fee to under $900. That alone saves you around $1,100 — enough for a year of insurance or a nice weekend trip in your new car."
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Upload Section - Only shown if user has credits */}
        {user && credits > 0 && (
          <section id="upload" className="py-16 bg-muted/30">
            <div className="container max-w-4xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                  <span className="font-medium">{credits} {credits === 1 ? 'Credit' : 'Credits'} Available</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Each analysis uses 1 credit
                </p>
              </div>
              <DealUpload onAnalysisComplete={() => fetchCredits(user.id)} />
            </div>
          </section>
        )}


        {/* CTA */}
        <section className="py-16 sm:py-20 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="text-accent">A</span>rch<span className="text-accent">i</span>e Premium
            </h2>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              No subscription required. <span className="text-primary font-bold">Just $9.</span>
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-dark text-lg px-8 py-6"
              onClick={handleGetPremium}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : user ? "Get Premium" : "Sign In to Purchase"}
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
