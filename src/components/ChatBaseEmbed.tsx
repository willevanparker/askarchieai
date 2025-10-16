import React from "react";

interface ChatBaseEmbedProps {
  className?: string;
}

const CHATBASE_BOT_ID = "06a81a19-258d-4b0c-99b0-1c7781226da2";

const ChatBaseEmbed = ({ className = "" }: ChatBaseEmbedProps) => {
  return (
    <section className={`w-full h-full ${className}`} aria-label="Chat with Archie">
      <iframe
        src={`https://www.chatbase.co/chatbot-iframe/${CHATBASE_BOT_ID}`}
        title="Archie Chat"
        className="w-full h-full"
        loading="lazy"
        allow="clipboard-write; microphone; payment"
      />
    </section>
  );
};

export default ChatBaseEmbed;
