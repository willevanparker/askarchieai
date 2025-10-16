import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Cookies = () => {
  useEffect(() => {
    // Load Termly embed script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = 'termly-jssdk';
    script.src = 'https://app.termly.io/embed-policy.min.js';
    
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode && !document.getElementById('termly-jssdk')) {
      firstScript.parentNode.insertBefore(script, firstScript);
    }
    
    return () => {
      // Cleanup script on unmount
      const termlyScript = document.getElementById('termly-jssdk');
      if (termlyScript && termlyScript.parentNode) {
        termlyScript.parentNode.removeChild(termlyScript);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
            
            {/* @ts-ignore - Termly embed requires custom attributes */}
            <div name="termly-embed" data-id="8674fc10-8499-47d5-bdbc-cdc63b507e01"></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cookies;
