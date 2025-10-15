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
    // Inject Chatbase loader (verbatim snippet from Chatbase)
    const inline = document.createElement('script');
    inline.id = 'archie-chatbase-inline';
    inline.innerHTML = `((function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="GM054S1a9A3U4EGfZEUfs";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}}))();`;
    document.body.appendChild(inline);

    return () => {
      // Cleanup: remove injected scripts to avoid duplicates across route changes
      const embed = document.getElementById('GM054S1a9A3U4EGfZEUfs');
      if (embed && embed.parentNode) embed.parentNode.removeChild(embed);
      const existingInline = document.getElementById('archie-chatbase-inline');
      if (existingInline && existingInline.parentNode) existingInline.parentNode.removeChild(existingInline);
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
