import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArchieChat from "@/components/ArchieChat";

const Chat = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto py-8">
        <div className="h-[calc(100vh-12rem)]">
          <ArchieChat />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
