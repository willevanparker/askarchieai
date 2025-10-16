import React from "react";

interface ChatBaseEmbedProps {
  className?: string;
}

const CHATBASE_BOT_ID = "GM054S1a9A3U4EGfZEUfs";

const ChatBaseEmbed = ({ className = "" }: ChatBaseEmbedProps) => {
  return (
    <section className={`w-full h-full ${className}`} aria-label="Chat with Archie">
      <iframe
        src={`https://www.chatbase.co/chatbot-iframe/${CHATBASE_BOT_ID}`}
        title="Archie Chat"
        className="w-full h-full min-h-[85vh]"
        frameBorder="0"
        allow="clipboard-write; microphone; payment"
      />
    </section>
  );
};

export default ChatBaseEmbed;
