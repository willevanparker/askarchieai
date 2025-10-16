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
                AskArchie.ai was created to provide confidence and clarity to the automotive industry. 
                Whether you're a first-time buyer, seasoned owner, or someone just trying to understand 
                why their check engine light came on—Archie is here to help.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 mb-12">
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Knowledge</h3>
                <p className="text-muted-foreground">
                  Trained extensively using real-world data, supercharged by AI. That means Archie can help with sales, service, and everything in between.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Transparent & Trustworthy</h3>
                <p className="text-muted-foreground">
                  We prioritize giving you helpful information. But if you have 
                  feedback, Archie is all ears. Contact him at just@askarchie.ai
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">For Everyone</h3>
                <p className="text-muted-foreground">
                  From complete beginners to experienced car owners, Archie speaks your 
                  language and meets you where you are.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Contextual Recommendations</h3>
                <p className="text-muted-foreground">
                  When relevant, Archie can connect you with trusted services for financing, 
                  warranties, insurance, and more—only when it makes sense.
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
                <p>
                  And when Archie detects that you might benefit from a specific service—like extended 
                  warranty coverage for a repair concern—he'll offer relevant, helpful suggestions.
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
