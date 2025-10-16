import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Car, Wrench, DollarSign, Shield, HelpCircle, FileText } from "lucide-react";

const Index = () => {
  const expertiseAreas = [
    {
      icon: Car,
      title: "Buying a Car",
      description: "Navigate the buying process, understand pricing, and negotiate with confidence",
    },
    {
      icon: Wrench,
      title: "Repairs & Maintenance",
      description: "Diagnose issues, understand repair costs, and know what's really necessary",
    },
    {
      icon: DollarSign,
      title: "Financing & Loans",
      description: "Compare financing options, understand interest rates, and get pre-approved",
    },
    {
      icon: Shield,
      title: "Warranties & Insurance",
      description: "Know what's covered, compare warranty options, and avoid unnecessary add-ons",
    },
    {
      icon: HelpCircle,
      title: "Dealership Questions",
      description: "Understand fees, documentation, trade-ins, and dealership practices",
    },
    {
      icon: FileText,
      title: "State Regulations",
      description: "Learn about registration, taxes, emissions, and state-specific requirements",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main>
        <Hero />

        <section className="py-16 sm:py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                How <span className="text-accent">A</span>rch<span className="text-accent">i</span>e Can Help
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Expert guidance across all aspects of car ownership
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {expertiseAreas.map((area, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300 border-border">
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <area.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{area.title}</h3>
                  <p className="text-sm text-muted-foreground">{area.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to get answers?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Chat with Archie now and get the expert automotive guidance you need.
            </p>
            <a href="/chat">
              <button className="bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Start Chatting Now
              </button>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
