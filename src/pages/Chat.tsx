import Navbar from "@/components/Navbar";
import ChatInterface from "@/components/ChatInterface";
import Footer from "@/components/Footer";

const Chat = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <ChatInterface />
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
