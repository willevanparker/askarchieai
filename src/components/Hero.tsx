import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">
              Car question?
            </h1>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-8">
              Ask Archie.
            </h1>
          </div>
          
          <div className="bg-card rounded-3xl p-8 sm:p-12 shadow-lg border">
            <div className="text-center text-sm text-muted-foreground mb-8">
              Today 2:14 PM
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-start">
                <div className="bg-secondary px-6 py-4 rounded-3xl rounded-tl-sm max-w-xs">
                  <p className="text-lg font-medium">My car is making a strange noise. Can you help?</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground px-6 py-4 rounded-3xl rounded-tr-sm max-w-xs">
                  <p className="text-lg font-medium">Yep! Does it happen when you're sitting still or driving?</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chat" className="w-full sm:w-auto">
              <Button 
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                Start Chatting
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Link to="/about" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full border-2 hover:bg-secondary"
              >
                Learn More
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              <span className="font-bold">Who is Archie?</span> Archie an automotive AI advocate! It's like having a friend in the car business, who loves alliteration, in the palm of your hand. Scroll down to see how Archie can help you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
