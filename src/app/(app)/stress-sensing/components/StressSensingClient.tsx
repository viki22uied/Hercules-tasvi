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
import { useSearchParams } from 'next/navigation';

const formSchema = z.object({
  text: z.string().min(10, 'Please enter at least 10 characters.'),
});

const translations: Record<string, Record<string, string>> = {
  'Text for Analysis': { hi: 'विश्लेषण के लिए पाठ', mr: 'विश्लेषणासाठी मजकूर' },
  "e.g., 'Feeling worried about my car repair costs.'": { hi: "उदा., 'मेरी कार की मरम्मत की लागत के बारे में चिंतित महसूस कर रहा हूँ।'", mr: "उदा., 'माझ्या कारच्या दुरुस्तीच्या खर्चाबद्दल काळजी वाटत आहे.'" },
  'Analyze Sentiment': { hi: 'भावना का विश्लेषण करें', mr: 'भावनेचे विश्लेषण करा' },
  'Analysis Result': { hi: 'विश्लेषण परिणाम', mr: 'विश्लेषण परिणाम' },
  'Potential Financial Distress Detected': { hi: 'संभावित वित्तीय संकट का पता चला', mr: 'संभाव्य आर्थिक त्रासाचा शोध लागला' },
  'No Financial Distress Detected': { hi: 'कोई वित्तीय संकट का पता नहीं चला', mr: 'कोणताही आर्थिक त्रास आढळला नाही' },
  'This analysis is based on the sentiment of the text provided.': { hi: 'यह विश्लेषण प्रदान किए गए पाठ की भावना पर आधारित है।', mr: 'हे विश्लेषण प्रदान केलेल्या मजकुराच्या भावनेवर आधारित आहे.' },
  'Sentiment Score': { hi: 'भावना स्कोर', mr: 'भावना गुण' },
  'Reason': { hi: 'कारण', mr: 'कारण' },
};

export function StressSensingClient() {
  const [result, setResult] = useState<FinancialDistressOutput | null>(null);
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
                <FormLabel>{t('Text for Analysis')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("e.g., 'Feeling worried about my car repair costs.'")}
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
            {t('Analyze Sentiment')}
          </Button>
        </form>
      </Form>

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{t('Analysis Result')}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex items-start gap-4">
              {getSentimentIcon(result.sentimentScore)}
              <div>
                <p className="font-semibold">
                  {result.isDistressed
                    ? t('Potential Financial Distress Detected')
                    : t('No Financial Distress Detected')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('This analysis is based on the sentiment of the text provided.')}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <BarChart className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('Sentiment Score')}
                  </p>
                  <p className="text-xl font-bold">
                    {result.sentimentScore.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <MessageSquare className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('Reason')}</p>
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
