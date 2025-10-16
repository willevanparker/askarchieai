import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArchieChat from "@/components/ArchieChat";
import DocumentUpload from "@/components/DocumentUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Chat = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto py-8">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="chat">Chat with Archie</TabsTrigger>
            <TabsTrigger value="upload">Upload Knowledge</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="h-[600px]">
            <ArchieChat />
          </TabsContent>
          
          <TabsContent value="upload">
            <DocumentUpload />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
