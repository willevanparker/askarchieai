import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import FileUpload from '@/components/admin/FileUpload';
import TextUpload from '@/components/admin/TextUpload';
import WebsiteUpload from '@/components/admin/WebsiteUpload';
import QAUpload from '@/components/admin/QAUpload';

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/admin/login');
        return;
      }

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (!roles) {
        navigate('/admin/login');
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="files" className="w-full">
          <TabsList className="grid w-full grid-cols-5 max-w-3xl">
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="website">Website</TabsTrigger>
            <TabsTrigger value="qa">Q&A</TabsTrigger>
            <TabsTrigger value="notion">Notion</TabsTrigger>
          </TabsList>

          <Card className="mt-6">
            <CardContent className="pt-6">
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

              <TabsContent value="notion">
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">Notion Integration</h3>
                  <p className="text-muted-foreground">
                    Coming soon: Connect your Notion workspace to import documentation.
                  </p>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;