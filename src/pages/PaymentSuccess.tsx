import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const [isProcessing, setIsProcessing] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (sessionId) {
      grantCredits();
    }
  }, [sessionId]);

  const grantCredits = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("grant-credits", {
        body: { session_id: sessionId },
      });

      if (error) throw error;

      toast({
        title: "Credits added!",
        description: "5 credits have been added to your account.",
      });
    } catch (error: any) {
      console.error("Error granting credits:", error);
      toast({
        title: "Error",
        description: "There was a problem adding your credits. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg text-muted-foreground">Processing your payment...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Welcome to <span className="text-accent">A</span>rch
            <span className="text-accent">i</span>e Premium! You now have 5
            credits to analyze documents.
          </p>
          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary-dark"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/premium#upload")}
            >
              Upload
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
