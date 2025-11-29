'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowUpRight,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

const transactions = [
  {
    id: 'txn1',
    description: 'Swiggy',
    amount: -250,
    date: '2024-07-22',
    category: 'Food',
  },
  {
    id: 'txn2',
    description: 'Weekly Payout',
    amount: 8000,
    date: '2024-07-21',
    category: 'Income',
  },
  {
    id: 'txn3',
    description: 'Phone Bill',
    amount: -499,
    date: '2024-07-20',
    category: 'Bills',
  },
  {
    id: 'txn4',
    description: 'Petrol',
    amount: -1500,
    date: '2024-07-20',
    category: 'Transport',
  },
  {
    id: 'txn5',
    description: 'Groceries from DMart',
    amount: -3500,
    date: '2024-07-19',
    category: 'Food',
  },
];

const translations: Record<string, Record<string, string>> = {
  'Recent Transactions': { hi: 'हाल के लेनदेन', mr: 'अलीकडील व्यवहार' },
  'Your 5 most recent transactions.': {
    hi: 'आपके 5 सबसे हाल के लेनदेन।',
    mr: 'तुमचे ५ सर्वात अलीकडील व्यवहार.',
  },
  'View All': { hi: 'सभी देखें', mr: 'सर्व पहा' },
  'Description': { hi: 'विवरण', mr: 'वर्णन' },
  'Category': { hi: 'श्रेणी', mr: 'श्रेणी' },
  'Amount': { hi: 'राशि', mr: 'रक्कम' },
  'Swiggy': { hi: 'स्विगी', mr: 'स्विगी' },
  'Food': { hi: 'भोजन', mr: 'अन्न' },
  'Weekly Payout': { hi: 'साप्ताहिक भुगतान', mr: 'साप्ताहिक पेआउट' },
  'Income': { hi: 'आय', mr: 'उत्पन्न' },
  'Phone Bill': { hi: 'फोन बिल', mr: 'फोन बिल' },
  'Bills': { hi: 'बिल', mr: 'बिले' },
  'Petrol': { hi: 'पेट्रोल', mr: 'पेट्रोल' },
  'Transport': { hi: 'परिवहन', mr: 'वाहतूक' },
  'Groceries from DMart': { hi: 'DMart से किराना', mr: 'DMart मधून किराणा' },
  'Welcome Back, User!': { hi: 'वापसी पर स्वागत है, उपयोगकर्ता!', mr: 'परत स्वागत आहे, वापरकर्ता!' },
  'yourname@hercules': { hi: 'आपकानाम@हरक्यूलिस', mr: 'तुमचेनाव@हरक्यूलिस' },
  'Send Money': { hi: 'पैसे भेजें', mr: 'पैसे पाठवा' },
  'Request Money': { hi: 'पैसे का अनुरोध करें', mr: 'पैसे विनंती करा' },
  'Scan & Pay': { hi: 'स्कैन और भुगतान करें', mr: 'स्कॅन करा आणि पैसे द्या' },
};

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';

  const t = useMemo(
    () =>
      (key: string, ...args: (string | number)[]) => {
        if (lang === 'en' || !key) {
          return args.length > 0
            ? key.replace(/%s/g, () => String(args.shift()))
            : key;
        }
        let translated = translations[key]?.[lang] || key;
        if (args.length > 0) {
          translated = translated.replace(/%s/g, () => String(args.shift()));
        }
        return translated;
      },
    [lang]
  );

  return (
    <div className="flex flex-col gap-8">
      <Card className="w-full">
        <CardContent className="p-6 flex flex-col items-center text-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://picsum.photos/seed/user/100/100" />
            <AvatarFallback>
              <User className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <h2 className="text-2xl font-bold">
              {t('Welcome Back, User!')}
            </h2>
            <p className="text-sm text-muted-foreground font-mono bg-muted px-3 py-1 rounded-full">
              {t('yourname@hercules')}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>{t('Recent Transactions')}</CardTitle>
            <CardDescription>
              {t('Your 5 most recent transactions.')}
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="#">
              {t('View All')}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('Description')}</TableHead>
                <TableHead>{t('Category')}</TableHead>
                <TableHead className="text-right">{t('Amount')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="font-medium">{t(transaction.description)}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{t(transaction.category)}</Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      transaction.amount > 0
                        ? 'text-green-600'
                        : 'text-foreground'
                    }`}
                  >
                    {transaction.amount > 0 ? '+' : ''}₹
                    {Math.abs(transaction.amount).toLocaleString('en-IN')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
