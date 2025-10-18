import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FloatingChatWidget = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Don't show on chat page
  if (location.pathname === "/chat") {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary hover:bg-primary-dark shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)] bg-background border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-white p-4 flex items-center justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* ChatBase Embed */}
          <div className="flex-1 overflow-hidden">
            <iframe
              src="https://www.chatbase.co/chatbot-iframe/GM054S1a9A3U4EGfZEUfs"
              width="100%"
              height="100%"
              frameBorder="0"
              title="Archie Chat"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatWidget;
