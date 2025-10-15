import { useEffect } from "react";

interface ChatBaseEmbedProps {
  className?: string;
}

declare global {
  interface Window {
    embeddedChatbotConfig: {
      chatbotId: string;
      domain: string;
    };
  }
}

const ChatBaseEmbed = ({ className = "" }: ChatBaseEmbedProps) => {
  useEffect(() => {
    // Add chatbase config to window
    window.embeddedChatbotConfig = {
      chatbotId: "06a81a19-258d-4b0c-99b0-1c7781226da2",
      domain: "www.chatbase.co"
    };

    // Create and append the script
    const script = document.createElement('script');
    script.src = "https://www.chatbase.co/embed.min.js";
    script.setAttribute('chatbotId', '06a81a19-258d-4b0c-99b0-1c7781226da2');
    script.setAttribute('domain', 'www.chatbase.co');
    script.defer = true;
    
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script on unmount
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <div className="text-center">
        <p className="text-muted-foreground mb-4">Loading Archie...</p>
        <p className="text-sm text-muted-foreground">
          The chat widget will appear in the bottom right corner
        </p>
      </div>
    </div>
  );
};

export default ChatBaseEmbed;
