import { Link } from "react-router-dom";
import { MessageCircle, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span>
                <span className="text-accent">A</span>
                <span className="text-foreground">skArch</span>
                <span className="text-accent">i</span>
                <span className="text-foreground">e.ai</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted car expert, making automotive knowledge accessible to everyone.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-muted-foreground hover:text-primary transition-colors">
                  Chat with Archie
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms & Disclosures
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Have questions or feedback? We'd love to hear from you.
            </p>
            <a 
              href="mailto:hello@askarchie.ai" 
              className="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              hello@askarchie.ai
            </a>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AskArchie.ai. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-accent fill-accent" /> for car enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
