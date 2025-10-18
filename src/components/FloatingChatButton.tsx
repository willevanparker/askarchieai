import { MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FloatingChatButton = () => {
  const location = useLocation();
  
  // Don't show on chat page
  if (location.pathname === "/chat") {
    return null;
  }

  return (
    <Link to="/chat" className="fixed bottom-6 right-6 z-50">
      <Button
        size="lg"
        className="h-14 w-14 rounded-full bg-primary hover:bg-primary-dark shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </Link>
  );
};

export default FloatingChatButton;
