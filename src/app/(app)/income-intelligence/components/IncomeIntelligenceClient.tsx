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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  predictIncomeDip,
  type PredictIncomeDipOutput,
} from '@/ai/flows/income-dip-prediction';
import { Loader2, TrendingDown, TrendingUp, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';

const formSchema = z.object({
  userInput: z.string().min(10, 'Please describe your income situation.'),
});

const translations: Record<string, Record<string, string>> = {
  'Describe your income situation': { hi: 'अपनी आय की स्थिति का वर्णन करें', mr: 'तुमच्या उत्पन्नाच्या परिस्थितीचे वर्णन करा' },
  'Tell me about your income over the last few months, your type of work, and any concerns you have.': { hi: 'पिछले कुछ महीनों में अपनी आय, अपने काम के प्रकार और अपनी किसी भी चिंता के बारे में बताएं।', mr: 'गेल्या काही महिन्यांतील तुमचे उत्पन्न, तुमच्या कामाचा प्रकार आणि तुमच्या काही चिंतांबद्दल मला सांगा.' },
  'Analyze Income': { hi: 'आय का विश्लेषण करें', mr: 'उत्पन्नाचे विश्लेषण करा' },
  'Analysis Failed': { hi: 'विश्लेषण विफल', mr: 'विश्लेषण अयशस्वी' },
  'Could not analyze your income data. Please try again.': { hi: 'आपकी आय डेटा का विश्लेषण नहीं किया जा सका। कृपया पुनः प्रयास करें।', mr: 'तुमच्या उत्पन्न डेटाचे विश्लेषण करता आले नाही. कृपया पुन्हा प्रयत्न करा.' },
  'Analysis Results': { hi: 'विश्लेषण के परिणाम', mr: 'विश्लेषण परिणाम' },
  'Weekly Income Forecast': { hi: 'साप्ताहिक आय पूर्वानुमान', mr: 'साप्ताहिक उत्पन्न अंदाज' },
  'Potential Income Dips': { hi: 'संभावित आय में गिरावट', mr: 'संभाव्य उत्पन्न घट' },
  'Recommendations': { hi: 'सिफारिशें', mr: 'शिफारसी' },
};

export function IncomeIntelligenceClient() {
  const [result, setResult] = useState<PredictIncomeDipOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
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
      userInput:
        'My income for the last three months was about ₹40000, then ₹38000, and last month ₹42000. I am a delivery partner, so my earnings can change. I am worried because the monsoon season is starting, which often reduces the number of delivery orders in my area.',
    },
  });

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
        title: t("Analysis Failed"),
        description: t("Could not analyze your income data. Please try again.")
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
                <FormLabel>{t('Describe your income situation')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('Tell me about your income over the last few months, your type of work, and any concerns you have.')}
                    rows={8}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('Analyze Income')}
            </Button>
          </div>
        </form>
      </Form>

      {result && (
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold font-headline">{t('Analysis Results')}</h2>
          <div className="grid gap-4 md:grid-cols-1">
            {renderJson(result.weeklyIncomeForecast, t("Weekly Income Forecast"), <TrendingUp className="h-5 w-5 text-green-500"/>)}
            {renderJson(result.potentialIncomeDips, t("Potential Income Dips"), <TrendingDown className="h-5 w-5 text-red-500"/>)}
             <Card>
                <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                    <Lightbulb className="h-5 w-5 text-yellow-500"/>
                    <CardTitle>{t('Recommendations')}</CardTitle>
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
