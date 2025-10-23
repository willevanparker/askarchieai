import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

import exampleInput from "@/assets/example-input.png";
import exampleOutput from "@/assets/archie-output-v2.png";
import { CheckCircle2, Upload, Zap, FileLineChart, Star, MessageCircle } from "lucide-react";

export default function Premium() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleGetPremium = async () => {
    // PAYWALL TEMPORARILY DISABLED - Direct users to upload instead of checkout
    toast({
      title: "Insights are now free!",
      description: "Head to the upload page to analyze your deals.",
    });
    navigate("/dashboard");
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
