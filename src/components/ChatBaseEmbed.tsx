interface ChatBaseEmbedProps {
  className?: string;
}

const ChatBaseEmbed = ({ className = "" }: ChatBaseEmbedProps) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <iframe
        src="https://www.chatbase.co/chatbot-iframe/06a81a19-258d-4b0c-99b0-1c7781226da2"
        title="Archie AI Assistant"
        width="100%"
        height="100%"
        frameBorder="0"
        className="rounded-lg"
      />
    </div>
  );
};

export default ChatBaseEmbed;
