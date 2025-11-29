'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';

const formSchema = z.object({
  upiId: z.string().min(3, 'UPI ID is too short').regex(/@/, 'Invalid UPI ID format'),
  amount: z.coerce.number().positive('Amount must be positive.'),
  note: z.string().optional(),
});

interface SendMoneyDialogProps {
  t: (key: string, ...args: (string | number)[]) => string;
}

export function SendMoneyDialog({ t }: SendMoneyDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      upiId: '',
      amount: 0,
      note: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setOpen(false);
    toast({
      title: t('Payment Sent!'),
      description: t('Successfully sent ₹%s to %s.', values.amount, values.upiId),
    });
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          {t('Send Money')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('Send Money')}</DialogTitle>
          <DialogDescription>
            {t('Enter the UPI ID and amount to send money.')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="upiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Recipient UPI ID')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('name@bank')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Amount (₹)')}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Note (Optional)')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('For groceries, rent, etc.')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('Pay Now')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Adding new translations
const newTranslations: Record<string, Record<string, string>> = {
    'Send Money': { hi: 'पैसे भेजें', mr: 'पैसे पाठवा' },
    'Enter the UPI ID and amount to send money.': { hi: 'पैसे भेजने के लिए UPI ID और राशि दर्ज करें।', mr: 'पैसे पाठवण्यासाठी UPI आयडी आणि रक्कम प्रविष्ट करा.' },
    'Recipient UPI ID': { hi: 'प्राप्तकर्ता UPI ID', mr: 'प्राप्तकर्त्याचा UPI आयडी' },
    'name@bank': { hi: 'नाम@बैंक', mr: 'नाव@बँक' },
    'Amount (₹)': { hi: 'राशि (₹)', mr: 'रक्कम (₹)' },
    'Note (Optional)': { hi: 'नोट (वैकल्पिक)', mr: 'टीप (पर्यायी)' },
    'For groceries, rent, etc.': { hi: 'किराने, किराए आदि के लिए।', mr: 'किराणा, भाडे इत्यादींसाठी.' },
    'Pay Now': { hi: 'अभी भुगतान करें', mr: 'आता पैसे द्या' },
    'Payment Sent!': { hi: 'भुगतान भेजा गया!', mr: 'पेमेंट पाठवले!' },
    'Successfully sent ₹%s to %s.': { hi: '%s को सफलतापूर्वक ₹%s भेजे गए।', mr: '%s ला यशस्वीरित्या ₹%s पाठवले.' },
};
