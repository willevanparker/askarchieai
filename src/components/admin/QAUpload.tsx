import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const QAUpload = () => {
  const { toast } = useToast();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    setUploading(true);

    try {
      const { error } = await supabase
        .from('qa_pairs')
        .insert({
          question: question.trim(),
          answer: answer.trim(),
        });

      if (error) throw error;

      toast({
        title: 'Q&A added successfully',
        description: 'The question and answer pair has been added to the knowledge base.',
      });

      setQuestion('');
      setAnswer('');
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to add Q&A',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Add Q&A Pair
        </CardTitle>
        <CardDescription>
          Add question and answer pairs for precise responses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., What is your warranty policy?"
              rows={3}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Our warranty covers..."
              rows={6}
              required
            />
          </div>
          <Button type="submit" disabled={uploading} className="w-full" size="lg">
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Q&A to Knowledge Base'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QAUpload;