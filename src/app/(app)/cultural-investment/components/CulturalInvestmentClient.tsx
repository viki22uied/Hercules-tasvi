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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  culturalInvestmentGuidance,
  type CulturalInvestmentGuidanceOutput,
} from '@/ai/flows/cultural-investment-guidance';
import { Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';

const formSchema = z.object({
  culturalBackground: z
    .string()
    .min(1, 'Please enter your cultural background.'),
  festival: z.string().min(1, 'Please select a festival.'),
  location: z.string().min(1, 'Please select a location.'),
  investmentAmount: z.coerce.number().positive('Please enter a valid amount.'),
});

const locations = [
  'Delhi',
  'Mumbai',
  'Chennai',
  'Kolkata',
  'Bangalore',
  'Hyderabad',
];

const translations: Record<string, Record<string, string>> = {
  'Cultural Background': { hi: 'सांस्कृतिक पृष्ठभूमि', mr: 'सांस्कृतिक पार्श्वभूमी' },
  'e.g., South Indian': { hi: 'जैसे, दक्षिण भारतीय', mr: 'उदा. दक्षिण भारतीय' },
  'Festival': { hi: 'त्योहार', mr: 'सण' },
  'e.g., Diwali, Pongal': { hi: 'जैसे, दिवाली, पोंगल', mr: 'उदा. दिवाळी, पोंगल' },
  'Location': { hi: 'स्थान', mr: 'स्थान' },
  'Select a location': { hi: 'एक स्थान चुनें', mr: 'एक स्थान निवडा' },
  'Investment Amount (INR)': { hi: 'निवेश राशि (INR)', mr: 'गुंतवणूक रक्कम (INR)' },
  'Get Guidance': { hi: 'मार्गदर्शन प्राप्त करें', mr: 'मार्गदर्शन मिळवा' },
  'Your Personalized Investment Guidance': { hi: 'आपकी व्यक्तिगत निवेश मार्गदर्शिका', mr: 'तुमचे वैयक्तिक गुंतवणूक मार्गदर्शन' },
};

export function CulturalInvestmentClient() {
  const [result, setResult] =
    useState<CulturalInvestmentGuidanceOutput | null>(null);
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
      culturalBackground: 'North Indian',
      festival: 'Diwali',
      location: 'Mumbai',
      investmentAmount: 50000,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const guidance = await culturalInvestmentGuidance(values);
      setResult(guidance);
    } catch (error) {
      console.error('Error getting investment guidance:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="culturalBackground"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Cultural Background')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('e.g., South Indian')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="festival"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Festival')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('e.g., Diwali, Pongal')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Location')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('Select a location')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
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
              name="investmentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Investment Amount (INR)')}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="50000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('Get Guidance')}
          </Button>
        </form>
      </Form>

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              {t('Your Personalized Investment Guidance')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              {result.guidance.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
