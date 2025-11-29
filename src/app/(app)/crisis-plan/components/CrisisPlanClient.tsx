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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  generateCrisisPlan,
  type CrisisPlanOutput,
} from '@/ai/flows/personalized-crisis-plan';
import {
  Loader2,
  ListChecks,
  Clock,
  BookUser,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';

const formSchema = z.object({
  income: z.coerce.number().positive('Income must be positive.'),
  expenses: z.coerce.number().positive('Expenses must be positive.'),
  savings: z.coerce.number().nonnegative('Savings cannot be negative.'),
  shortfallAmount: z.coerce.number().positive('Shortfall must be positive.'),
  location: z.string().min(2, 'Location is required.'),
  recentTransactions: z.string().min(10, 'Please list some transactions.'),
});

const translations: Record<string, Record<string, string>> = {
  'Monthly Income (₹)': { hi: 'मासिक आय (₹)', mr: 'मासिक उत्पन्न (₹)' },
  'Monthly Expenses (₹)': { hi: 'मासिक खर्च (₹)', mr: 'मासिक खर्च (₹)' },
  'Total Savings (₹)': { hi: 'कुल बचत (₹)', mr: 'एकूण बचत (₹)' },
  'Financial Shortfall Amount (₹)': { hi: 'वित्तीय कमी की राशि (₹)', mr: 'आर्थिक तुटवड्याची रक्कम (₹)' },
  'Location': { hi: 'स्थान', mr: 'स्थान' },
  'City, State': { hi: 'शहर, राज्य', mr: 'शहर, राज्य' },
  'Recent Transactions': { hi: 'हाल के लेनदेन', mr: 'अलीकडील व्यवहार' },
  'List some recent purchases...': { hi: 'कुछ हाल की खरीदारी की सूची बनाएं...', mr: 'काही अलीकडील खरेदीची सूची करा...' },
  'Generate Plan': { hi: 'योजना बनाएं', mr: 'योजना तयार करा' },
  'Your Personalized Crisis Plan': { hi: 'आपकी व्यक्तिगत संकट योजना', mr: 'तुमची वैयक्तिक संकट योजना' },
  'Actionable Plan': { hi: 'कार्रवाई योग्य योजना', mr: 'कार्यवाही करण्यायोग्य योजना' },
  'Estimated Duration': { hi: 'अनुमानित अवधि', mr: 'अंदाजे कालावधी' },
  'Suggested Resources': { hi: 'सुझाए गए संसाधन', mr: 'सुचवलेले संसाधने' },
};


export function CrisisPlanClient() {
  const [result, setResult] = useState<CrisisPlanOutput | null>(null);
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
      income: 50000,
      expenses: 45000,
      savings: 20000,
      shortfallAmount: 10000,
      location: 'Mumbai, MH',
      recentTransactions: 'Groceries: ₹1500, Rent: ₹20000, Petrol: ₹500, Dining out: ₹800',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const plan = await generateCrisisPlan(values);
      setResult(plan);
    } catch (error) {
      console.error('Error generating crisis plan:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const renderSection = (title: string, content: string, icon: React.ReactNode) => (
    <div className="flex items-start gap-4">
      <div className="mt-1 flex-shrink-0">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <div 
          className="prose prose-sm max-w-none text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: content.replace(/### (.*?)\n/g, '<h4>$1</h4>').replace(/\* (.*?)\n/g, '<li>$1</li>').replace(/\n/g, '<br/>') }} 
        />
      </div>
    </div>
  );

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Monthly Income (₹)')}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expenses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Monthly Expenses (₹)')}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="savings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Total Savings (₹)')}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortfallAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Financial Shortfall Amount (₹)')}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
           <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Location')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('City, State')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recentTransactions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Recent Transactions')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('List some recent purchases...')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('Generate Plan')}
          </Button>
        </form>
      </Form>

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              {t('Your Personalized Crisis Plan')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderSection(t('Actionable Plan'), result.plan, <ListChecks className="text-primary"/>)}
            {renderSection(t('Estimated Duration'), result.estimatedDuration, <Clock className="text-primary"/>)}
            {renderSection(t('Suggested Resources'), result.suggestedResources, <BookUser className="text-primary"/>)}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
