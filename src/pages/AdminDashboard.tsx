import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, FileText, Type, Globe, MessageSquare, } from 'lucide-react';
import FileUpload from '@/components/admin/FileUpload';
import TextUpload from '@/components/admin/TextUpload';
import WebsiteUpload from '@/components/admin/WebsiteUpload';
import QAUpload from '@/components/admin/QAUpload';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/admin');
        return;
      }

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (!roles) {
        await supabase.auth.signOut();
        navigate('/admin');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AskArchie Admin</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="files" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-8">
            <TabsTrigger value="files" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Files
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Text
            </TabsTrigger>
            <TabsTrigger value="website" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Website
            </TabsTrigger>
            <TabsTrigger value="qa" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Q&A
            </TabsTrigger>
          </TabsList>

          <TabsContent value="files">
            <FileUpload />
          </TabsContent>

          <TabsContent value="text">
            <TextUpload />
          </TabsContent>

          <TabsContent value="website">
            <WebsiteUpload />
          </TabsContent>

          <TabsContent value="qa">
            <QAUpload />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;