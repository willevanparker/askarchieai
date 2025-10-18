import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-12">
            Everything you need to know about Archie.
          </p>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                What is Archie?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="mb-4">
                  Archie is powered by advanced AI trained on thousands of automotive data points and resources.
                </p>
                <p className="mb-4">
                  Unlike a simple search engine, Archie understands context and can have natural conversations about complex topics like:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Understanding dealer fees and negotiations</li>
                  <li>Diagnosing common car problems</li>
                  <li>Comparing financing and warranty options</li>
                  <li>Navigating state-specific regulations</li>
                  <li>And more...</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                How accurate is the AI?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  Archie uses the latest AI technology combined with expert-curated automotive knowledge. While the responses are highly accurate and constantly improving, the information is meant to guide — not replace professional advice or official sources. If you're making a big decision (like signing a contract or buying a car), it's always smart to double-check with a professional.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                How much does it cost to chat with Archie?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  Nothing! Chatting with Archie is absolutely free.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                How much is Archie Premium?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  $9 for up to three submissions.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Do I need an account to chat with Archie or use Premium?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  Nope.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                How does privacy and data protection work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  See our policies below.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                What is your refund policy?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  If you are not satisfied with your purchase for any reason, simply request a refund via email and one will be provided, no questions asked.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                How do I contact support?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  Send Archie an email at{" "}
                  <a 
                    href="mailto:just@askarchie.ai" 
                    className="text-primary hover:underline"
                  >
                    just@askarchie.ai
                  </a>
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
