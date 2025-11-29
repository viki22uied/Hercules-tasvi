'use client';
import { useState, useMemo } from 'react';
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
import { useSearchParams } from 'next/navigation';

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

const translations: Record<string, Record<string, string>> = {
  'Scam Type': { hi: 'घोटाले का प्रकार', mr: 'घोटाळ्याचा प्रकार' },
  'Select a scam type to simulate': { hi: 'अनुकरण करने के लिए एक घोटाले का प्रकार चुनें', mr: 'अनुकरण करण्यासाठी घोटाळ्याचा प्रकार निवडा' },
  'Phishing Email': { hi: 'फ़िशिंग ईमेल', mr: 'फिशिंग ईमेल' },
  'Fake Phone Call (Text Script)': { hi: 'नकली फ़ोन कॉल (टेक्स्ट स्क्रिप्ट)', mr: 'खोटा फोन कॉल (मजकूर स्क्रिप्ट)' },
  'Investment Scam': { hi: 'निवेश घोटाला', mr: 'गुंतवणूक घोटाळा' },
  'Lottery Scam': { hi: 'लॉटरी घोटाला', mr: 'लॉटरी घोटाळा' },
  'Personalization Details': { hi: 'वैयक्तिकरण विवरण', mr: 'वैयक्तिकरण तपशील' },
  'Provide some mock details to make the simulation more realistic (e.g., name, location, bank name).': { hi: 'अनुकरण को अधिक यथार्थवादी बनाने के लिए कुछ नकली विवरण प्रदान करें (जैसे, नाम, स्थान, बैंक का नाम)।', mr: 'अनुकरण अधिक वास्तववादी बनवण्यासाठी काही बनावट तपशील द्या (उदा. नाव, स्थान, बँकेचे नाव).' },
  'Start Simulation': { hi: 'अनुकरण शुरू करें', mr: 'अनुकरण सुरू करा' },
  'Simulation': { hi: 'अनुकरण', mr: 'अनुकरण' },
  'Explanation': { hi: 'स्पष्टीकरण', mr: 'स्पष्टीकरण' },
  'Scam Scenario': { hi: 'घोटाले का परिदृश्य', mr: 'घोटाळा परिस्थिती' },
  'This is a simulated scam. Read it carefully.': { hi: 'यह एक नकली घोटाला है। इसे ध्यान से पढ़ें।', mr: 'हे एक बनावट घोटाळा आहे. ते काळजीपूर्वक वाचा.' },
  'How to Spot This Scam': { hi: 'इस घोटाले को कैसे पहचानें', mr: 'हा घोटाळा कसा ओळखावा' },
  'Here are the red flags and tips to protect yourself.': { hi: 'यहाँ लाल झंडे और खुद को बचाने के लिए युक्तियाँ हैं।', mr: 'येथे लाल झेंडे आणि स्वतःचे संरक्षण करण्यासाठी टिपा आहेत.' },
};

export function ScamSimulationClient() {
  const [result, setResult] = useState<SimulateScamOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';

  const t = useMemo(() => (key: string, ...args: (string | number)[]) => {
    if (lang === 'en') {
      return args.length > 0 ? key.replace(/%s/g, () => args.shift()?.toString() || '') : key;
    }
    let translated = translations[key]?.[lang] || key;
    if (args.length > 0) {
      translated = translated.replace(/%s/g, () => args.shift()?.toString() || '');
    }
    return translated;
  }, [lang]);

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
                <FormLabel>{t('Scam Type')}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('Select a scam type to simulate')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {scamTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {t(type.label)}
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
                <FormLabel>{t('Personalization Details')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('Provide some mock details to make the simulation more realistic (e.g., name, location, bank name).')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('Start Simulation')}
          </Button>
        </form>
      </Form>

      {result && (
        <div className="mt-8">
          <Tabs defaultValue="simulation">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simulation">
                <Siren className="mr-2 h-4 w-4" /> {t('Simulation')}
              </TabsTrigger>
              <TabsTrigger value="explanation">
                <ShieldCheck className="mr-2 h-4 w-4" /> {t('Explanation')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="simulation">
              <Card>
                <CardHeader>
                  <CardTitle>{t('Scam Scenario')}</CardTitle>
                  <CardDescription>
                    {t('This is a simulated scam. Read it carefully.')}
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
                  <CardTitle>{t('How to Spot This Scam')}</CardTitle>
                  <CardDescription>
                    {t('Here are the red flags and tips to protect yourself.')}
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
