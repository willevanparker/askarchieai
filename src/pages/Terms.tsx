import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Terms & Disclosures</h1>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Affiliate Partnerships</h2>
                <p className="text-muted-foreground leading-relaxed">
                  AskArchie.ai participates in affiliate marketing programs. This means that when you 
                  click on certain links provided by Archie and make a purchase or sign up for a service, 
                  we may receive a commission at no additional cost to you.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our affiliate partnerships include services related to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Auto financing and loan pre-approvals</li>
                  <li>Extended warranty providers</li>
                  <li>Auto insurance quotes</li>
                  <li>Parts marketplaces and suppliers</li>
                  <li>Vehicle history reports</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  These partnerships help us keep AskArchie.ai free for everyone while maintaining 
                  our commitment to providing honest, helpful information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Our Commitment to You</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your trust is paramount. We commit to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Only recommending products and services we believe can genuinely help you</li>
                  <li>Providing accurate information regardless of affiliate relationships</li>
                  <li>Clearly indicating when a link is an affiliate link</li>
                  <li>Never letting affiliate commissions influence our core educational mission</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Information Accuracy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  While Archie is trained on comprehensive automotive data, information provided 
                  should be used as general guidance. Always verify important details with licensed 
                  professionals, your vehicle manufacturer, or your local Department of Motor Vehicles.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Car repairs, regulations, and fees can vary by location, vehicle make/model, and 
                  other factors. Archie's responses are educational in nature and should not be 
                  considered professional automotive or legal advice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Privacy & Data</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We respect your privacy. Conversations with Archie may be stored to improve our 
                  service quality, but we do not sell personal information to third parties.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  When you click affiliate links, you'll be directed to third-party websites that 
                  have their own privacy policies and terms of service. We encourage you to review 
                  these before providing any personal information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Service Availability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  AskArchie.ai is provided "as is" without warranties of any kind. We strive to 
                  maintain consistent availability but cannot guarantee uninterrupted service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update these terms from time to time. Continued use of AskArchie.ai 
                  constitutes acceptance of any changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Questions about these terms or our affiliate partnerships? Reach out at{" "}
                  <a href="mailto:just@askarchie.ai" className="text-primary hover:text-primary-dark">
                    just@askarchie.ai
                  </a>
                </p>
              </section>

              <div className="bg-muted/50 border border-border rounded-xl p-6 mt-8">
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
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

export default Terms;
