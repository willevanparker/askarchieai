import { Link, useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl sm:text-2xl">
            <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            <span>
              <span className="text-accent">A</span>
              <span className="text-foreground">skArch</span>
              <span className="text-accent">i</span>
              <span className="text-foreground">e.ai</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/about') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              About
            </Link>
            <Link 
              to="/terms" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/terms') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Terms
            </Link>
          </div>
          
          <Link to="/chat">
            <Button 
              size="default"
              className="bg-primary hover:bg-primary-dark transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Chat with Archie</span>
              <span className="sm:hidden">Chat</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
