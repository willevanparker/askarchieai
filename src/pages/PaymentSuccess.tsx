import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    console.log("Payment successful! Session ID:", sessionId);
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Welcome to <span className="text-accent">A</span>rch<span className="text-accent">i</span>e Premium! 
            You now have access to expert deal analysis.
          </p>
          <div className="space-y-4">
            <Button 
              size="lg" 
              className="w-full bg-primary hover:bg-primary-dark"
              onClick={() => navigate("/premium#upload")}
            >
              Upload Deal for Analysis
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="w-full"
              onClick={() => navigate("/chat")}
            >
              Ask Archie Questions
            </Button>
          </div>
          {sessionId && (
            <p className="text-sm text-muted-foreground mt-6">
              Session ID: {sessionId}
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
