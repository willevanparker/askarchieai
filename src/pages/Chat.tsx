import Navbar from "@/components/Navbar";
import ChatBaseEmbed from "@/components/ChatBaseEmbed";
import Footer from "@/components/Footer";

const Chat = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-background">
        <ChatBaseEmbed className="h-[calc(100vh-4rem)]" />
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
