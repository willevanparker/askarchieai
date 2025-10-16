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
  // ChatBase script is now loaded directly in index.html as per ChatBase support instructions

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
