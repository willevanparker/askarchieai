import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, Shield, Users, Target } from "lucide-react";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                About <span className="text-accent">A</span>rch<span className="text-accent">i</span>e
              </h1>
            </div>

            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-muted-foreground leading-relaxed">
                Hi! I'm Archie. Whether you're navigating the car buying experience or just trying to understand why your check engine light is on—I'm here to help.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 mb-12">
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">For Everyone</h3>
                <p className="text-muted-foreground">
                  From complete beginners to experienced car owners, I can help! No question is too small. Hear a strange noise? Ask away. Wondering what a fee is on a contract? I can help with that too!
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Knowledge</h3>
                <p className="text-muted-foreground">
                  I'm trained extensively using real-world data (think an entire library of automotive knowledge), supercharged by AI. That means I can help with sales, service, and everything in between.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 relative">
                <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                  Beta
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Contextual Recommendations</h3>
                <p className="text-muted-foreground">
                  When relevant, I can connect you with trusted services for financing, warranties, insurance, and more—only when it makes sense. So, if you're asking questions about what kind of car insurance is best, I can recommend a few options!
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Transparent & Trustworthy</h3>
                <p className="text-muted-foreground">
                  I try my best to give helpful information, but even supercharged automotive intelligence can make mistakes! If you have feedback, I'm all ears! Send me an email at just@askarchie.ai.
                </p>
              </div>
            </div>

            <div className="bg-secondary/50 border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-4">How Archie Works</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Archie is powered by advanced AI trained on thousands of automotive data points 
                  and resources.
                </p>
                <p>
                  Unlike a simple search engine, Archie understands context and can have natural 
                  conversations about complex topics like:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Understanding dealer fees and negotiations</li>
                  <li>Diagnosing common car problems</li>
                  <li>Comparing financing and warranty options</li>
                  <li>Navigating state-specific regulations</li>
                  <li>And more...</li>
                </ul>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 mt-6">
                <p className="text-sm text-muted-foreground text-center">
                  <span className="font-semibold">Disclaimer:</span> This service provides information only. While we strive for the best accuracy, AI can make mistakes. We recommend double-checking important details with an automotive professional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
