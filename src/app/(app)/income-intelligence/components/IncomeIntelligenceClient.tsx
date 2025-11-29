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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  predictIncomeDip,
  type PredictIncomeDipOutput,
} from '@/ai/flows/income-dip-prediction';
import { Loader2, TrendingDown, TrendingUp, Lightbulb, Mic, Square } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  userInput: z.string().min(10, 'Please describe your income situation.'),
});

export function IncomeIntelligenceClient() {
  const [result, setResult] = useState<PredictIncomeDipOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userInput:
        'My income for the last three months was about ₹40000, then ₹38000, and last month ₹42000. I am a delivery partner, so my earnings can change. I am worried because the monsoon season is starting, which often reduces the number of delivery orders in my area.',
    },
  });

  const handleStartRecording = async () => {
    if (isRecording) {
      handleStopRecording();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // In a real app, you would send this to a speech-to-text API.
        // For this demo, we'll alert the user that recording has stopped.
        toast({
          title: 'Recording Stopped',
          description: 'Audio captured. In a real app, this would be transcribed.',
        });
        
        // This is a placeholder for where the transcription would be set.
        // For now, we will clear the chunks.
        audioChunksRef.current = [];
         // Stop the media stream tracks
        stream.getTracks().forEach(track => track.stop());
      };

      setIsRecording(true);
      toast({
        title: 'Recording Started',
        description: 'Speak now to describe your financial situation.',
      });

    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        variant: "destructive",
        title: "Microphone Error",
        description: "Could not access the microphone. Please check your browser permissions."
      })
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  useEffect(() => {
    // Cleanup function to stop recording and stream if component unmounts
    return () => {
      if (mediaRecorderRef.current) {
        if(isRecording) {
          mediaRecorderRef.current.stop();
        }
        if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, [isRecording]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const prediction = await predictIncomeDip(values);
      setResult(prediction);
    } catch (error) {
      console.error('Error predicting income dip:', error);
       toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze your income data. Please try again."
      })
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
            name="userInput"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Describe your income situation</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell me about your income over the last few months, your type of work, and any concerns you have. You can also use the record button to speak."
                    rows={8}
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
