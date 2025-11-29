'use client';
import { useState, useRef, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  predictIncomeDip,
  type PredictIncomeDipOutput,
} from '@/ai/flows/income-dip-prediction';
import { Loader2, TrendingDown, TrendingUp, Lightbulb, Mic, Square } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { translateText } from '@/ai/flows/translate-flow';

const formSchema = z.object({
  historicalIncomeData: z
    .string()
    .min(1, 'Please provide historical income data.'),
  workPattern: z.string().min(1, 'Please describe your work pattern.'),
  economicTrends: z.string().min(1, 'Please describe relevant economic trends.'),
});

export function IncomeIntelligenceClient() {
  const [result, setResult] = useState<PredictIncomeDipOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      historicalIncomeData:
        '{"January": 40000, "February": 38000, "March": 42000, "April": 35000}',
      workPattern: 'Delivery partner with variable weekly earnings.',
      economicTrends: 'Monsoon season often reduces delivery orders in my area.',
    },
  });

  const handleStartRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          audioChunksRef.current = [];
          
          // Here you would typically send the audioBlob to a speech-to-text service.
          // For this example, we'll simulate a transcription.
          const simulatedTranscription = 'My income was 40000 in January, 38000 in February, and 42000 in March. I work as a delivery driver and the upcoming monsoon might affect my earnings.';
          
          // Translate the text if needed, then update the form.
          // In a real app, you might parse this text to populate all fields.
          const { translation } = await translateText({ text: simulatedTranscription, targetLang: 'en' });
          form.setValue('workPattern', translation);
          
          stream.getTracks().forEach(track => track.stop());
        };
        audioChunksRef.current = [];
        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error accessing microphone:', err);
        // You could show a toast message to the user here
      }
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const prediction = await predictIncomeDip(values);
      setResult(prediction);
    } catch (error) {
      console.error('Error predicting income dip:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const renderJson = (jsonString: string, title: string, icon: React.ReactNode) => {
    try {
      const data = JSON.parse(jsonString);
      return (
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            {icon}
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="mt-2 w-full rounded-md bg-muted p-4 overflow-auto text-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      );
    } catch (e) {
      return (
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            {icon}
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">{jsonString}</p>
          </CardContent>
        </Card>
      )
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="historicalIncomeData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Historical Income Data (as JSON)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='e.g., {"January": 40000, "February": 38000}'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workPattern"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Pattern & Other Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your work, income patterns, and any factors that might affect it. You can also use the record button."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="economicTrends"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Economic Trends</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Rising fuel prices"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isLoading || isRecording}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analyze Income
            </Button>
            <Button type="button" variant="outline" size="icon" onClick={isRecording ? handleStopRecording : handleStartRecording}>
                {isRecording ? <Square className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
                <span className="sr-only">{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
            </Button>
            {isRecording && <span className="text-sm text-muted-foreground animate-pulse">Recording...</span>}
          </div>
        </form>
      </Form>

      {result && (
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold font-headline">Analysis Results</h2>
          <div className="grid gap-4 md:grid-cols-1">
            {renderJson(result.weeklyIncomeForecast, "Weekly Income Forecast", <TrendingUp className="h-5 w-5 text-green-500"/>)}
            {renderJson(result.potentialIncomeDips, "Potential Income Dips", <TrendingDown className="h-5 w-5 text-red-500"/>)}
             <Card>
                <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                    <Lightbulb className="h-5 w-5 text-yellow-500"/>
                    <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{result.recommendations}</p>
                </CardContent>
             </Card>
          </div>
        </div>
      )}
    </div>
  );
}

    