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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


const formSchema = z.object({
  userInput: z.string().min(10, 'Please describe your income situation.'),
});

export function IncomeIntelligenceClient() {
  const [result, setResult] = useState<PredictIncomeDipOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
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

  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasMicPermission(true);
      return true;
    } catch (error) {
      console.error("Error requesting microphone permission:", error);
      setHasMicPermission(false);
      toast({
        variant: "destructive",
        title: "Microphone Access Denied",
        description: "Please enable microphone permissions in your browser settings to use the recording feature."
      });
      return false;
    }
  };


  const handleStartRecording = async () => {
    if (isRecording) return;
  
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasMicPermission(true);
  
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = []; // Clear previous chunks
  
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
  
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        toast({
          title: 'Recording Stopped',
          description: 'Audio captured. In a real app, this would be transcribed.',
        });
        // In a real app, you would send this to a speech-to-text API.
        // For now, we will just clear the chunks.
        audioChunksRef.current = [];
        
        // Stop all tracks on the stream associated with this recorder
        mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      };
  
      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast({
        title: 'Recording Started',
        description: 'Speak now to describe your financial situation.',
      });
  
    } catch (error) {
      console.error("Error starting recording:", error);
      setHasMicPermission(false);
      setIsRecording(false);
      toast({
        variant: "destructive",
        title: "Could not start recording",
        description: "Please ensure microphone permissions are allowed and try again."
      })
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // onstop handler will set isRecording to false
    }
  };
  
  useEffect(() => {
    // Check initial permission status without prompting
    navigator.permissions?.query({ name: 'microphone' as PermissionName }).then((permissionStatus) => {
      setHasMicPermission(permissionStatus.state === 'granted');
      permissionStatus.onchange = () => {
         setHasMicPermission(permissionStatus.state === 'granted');
      };
    });

    return () => {
      // Cleanup: stop stream tracks if the component unmounts while recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
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
           {hasMicPermission === false && (
            <Alert variant="destructive">
              <Mic className="h-4 w-4" />
              <AlertTitle>Microphone Access Required</AlertTitle>
              <AlertDescription>
                To use the voice recording feature, please allow microphone access in your browser settings.
                <Button variant="link" className="p-0 h-auto ml-1" onClick={requestMicPermission}>Grant Access</Button>
              </AlertDescription>
            </Alert>
          )}

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
