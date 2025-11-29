'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  detectFinancialDistress,
  type FinancialDistressOutput,
} from '@/ai/flows/financial-distress-detection';
import {
  Loader2,
  Smile,
  Frown,
  Meh,
  BarChart,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  text: z.string().min(10, 'Please enter at least 10 characters.'),
});

export function StressSensingClient() {
  const [result, setResult] = useState<FinancialDistressOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: 'Another unexpected bill came in, not sure how I will manage this month.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const distressSignal = await detectFinancialDistress(values);
      setResult(distressSignal);
    } catch (error) {
      console.error('Error detecting financial distress:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const getSentimentIcon = (score: number) => {
    if (score > 0.2) return <Smile className="h-8 w-8 text-green-500" />;
    if (score < -0.2) return <Frown className="h-8 w-8 text-red-500" />;
    return <Meh className="h-8 w-8 text-yellow-500" />;
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text for Analysis</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., 'Feeling worried about my car repair costs.'"
                    {...field}
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Analyze Sentiment
          </Button>
        </form>
      </Form>

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex items-start gap-4">
              {getSentimentIcon(result.sentimentScore)}
              <div>
                <p className="font-semibold">
                  {result.isDistressed
                    ? 'Potential Financial Distress Detected'
                    : 'No Financial Distress Detected'}
                </p>
                <p className="text-sm text-muted-foreground">
                  This analysis is based on the sentiment of the text provided.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <BarChart className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Sentiment Score
                  </p>
                  <p className="text-xl font-bold">
                    {result.sentimentScore.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <MessageSquare className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Reason</p>
                  <p className="text-base font-semibold">{result.reason}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
