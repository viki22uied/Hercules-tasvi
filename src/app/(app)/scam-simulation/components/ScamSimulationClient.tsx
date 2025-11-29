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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  simulateScam,
  type SimulateScamOutput,
} from '@/ai/flows/scam-and-fraud-simulation';
import { Loader2, ShieldCheck, Siren } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  scamType: z.string().min(1, 'Please select a scam type.'),
  userDetails: z
    .string()
    .min(10, 'Please provide some details for personalization.'),
});

const scamTypes = [
  { value: 'phishing email', label: 'Phishing Email' },
  { value: 'fake phone call', label: 'Fake Phone Call (Text Script)' },
  { value: 'investment scam', label: 'Investment Scam' },
  { value: 'lottery scam', label: 'Lottery Scam' },
];

export function ScamSimulationClient() {
  const [result, setResult] = useState<SimulateScamOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scamType: 'phishing email',
      userDetails:
        'My name is Alex, I live in California, and I bank with ExampleBank.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const simulation = await simulateScam(values);
      setResult(simulation);
    } catch (error) {
      console.error('Error simulating scam:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="scamType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scam Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a scam type to simulate" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {scamTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personalization Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide some mock details to make the simulation more realistic (e.g., name, location, bank name)."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Start Simulation
          </Button>
        </form>
      </Form>

      {result && (
        <div className="mt-8">
          <Tabs defaultValue="simulation">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simulation">
                <Siren className="mr-2 h-4 w-4" /> Simulation
              </TabsTrigger>
              <TabsTrigger value="explanation">
                <ShieldCheck className="mr-2 h-4 w-4" /> Explanation
              </TabsTrigger>
            </TabsList>
            <TabsContent value="simulation">
              <Card>
                <CardHeader>
                  <CardTitle>Scam Scenario</CardTitle>
                  <CardDescription>
                    This is a simulated scam. Read it carefully.
                  </CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                  {result.simulationText}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="explanation">
              <Card>
                <CardHeader>
                  <CardTitle>How to Spot This Scam</CardTitle>
                  <CardDescription>
                    Here are the red flags and tips to protect yourself.
                  </CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                    {result.explanation.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
