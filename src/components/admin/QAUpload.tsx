import { useState } from 'react';
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
        description: 'Question and answer pair has been added to the knowledge base.',
      });

      setQuestion('');
      setAnswer('');
    } catch (error) {
      console.error('Upload error:', error);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Add Q&A Pair</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="question">Question</Label>
        <Textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What is your warranty policy?"
          className="min-h-[80px]"
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
          className="min-h-[120px]"
          required
        />
      </div>

      <Button type="submit" disabled={uploading} className="w-full">
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Adding...
          </>
        ) : (
          'Add Q&A Pair'
        )}
      </Button>
    </form>
  );
};

export default QAUpload;