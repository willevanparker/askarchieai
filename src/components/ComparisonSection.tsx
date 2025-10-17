import chatgptScreenshot from "@/assets/chatgpt-screenshot.png";
import archieScreenshot from "@/assets/archie-screenshot.png";

const ComparisonSection = () => {
  return (
    <section className="py-16 sm:py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            See <span className="text-accent">A</span>rch<span className="text-accent">i</span>e in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Same question, smarter answer. See how Archie's automotive expertise makes the difference.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* ChatGPT iPhone Mockup */}
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-center">ChatGPT</h3>
              <p className="text-sm text-muted-foreground text-center">Generic AI Response</p>
            </div>
            <div className="relative w-full max-w-[300px]">
              {/* iPhone Frame */}
              <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl">
                <div className="bg-white rounded-[2.5rem] overflow-hidden">
                  <img 
                    src={chatgptScreenshot} 
                    alt="ChatGPT response to doc fee question"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Archie iPhone Mockup */}
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-center">
                <span className="text-accent">A</span>rch<span className="text-accent">i</span>e
              </h3>
              <p className="text-sm text-muted-foreground text-center">Automotive-Specific AI</p>
            </div>
            <div className="relative w-full max-w-[300px]">
              {/* iPhone Frame with highlight */}
              <div className="relative bg-primary rounded-[3rem] p-3 shadow-2xl ring-4 ring-primary/20">
                <div className="bg-white rounded-[2.5rem] overflow-hidden">
                  <img 
                    src={archieScreenshot} 
                    alt="Archie's personalized response to doc fee question"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full">
            <span className="text-sm font-medium">
              💡 Archie goes beyond definitions—offering personalized, actionable advice for car buyers.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
