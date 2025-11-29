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

const formSchema = z.object({
  income: z.coerce.number().positive('Income must be positive.'),
  expenses: z.coerce.number().positive('Expenses must be positive.'),
  savings: z.coerce.number().nonnegative('Savings cannot be negative.'),
  shortfallAmount: z.coerce.number().positive('Shortfall must be positive.'),
  location: z.string().min(2, 'Location is required.'),
  recentTransactions: z.string().min(10, 'Please list some transactions.'),
});

export function CrisisPlanClient() {
  const [result, setResult] = useState<CrisisPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: 5000,
      expenses: 4500,
      savings: 2000,
      shortfallAmount: 1000,
      location: 'New York, NY',
      recentTransactions: 'Groceries: $150, Rent: $2000, Gas: $50, Dining out: $80',
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
        <div className="prose prose-sm max-w-none text-muted-foreground">
            {content.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
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
                  <FormLabel>Monthly Income ($)</FormLabel>
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
                  <FormLabel>Monthly Expenses ($)</FormLabel>
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
                  <FormLabel>Total Savings ($)</FormLabel>
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
                  <FormLabel>Financial Shortfall Amount ($)</FormLabel>
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
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="City, State" {...field} />
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
                  <FormLabel>Recent Transactions</FormLabel>
                  <FormControl>
                    <Textarea placeholder="List some recent purchases..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Plan
          </Button>
        </form>
      </Form>

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Your Personalized Crisis Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderSection('Actionable Plan', result.plan, <ListChecks className="text-primary"/>)}
            {renderSection('Estimated Duration', result.estimatedDuration, <Clock className="text-primary"/>)}
            {renderSection('Suggested Resources', result.suggestedResources, <BookUser className="text-primary"/>)}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
