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
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

const cashFlowData = [
  { month: 'Jan', income: 35000, expenses: 20000 },
  { month: 'Feb', income: 32000, expenses: 15000 },
  { month: 'Mar', income: 45000, expenses: 28000 },
  { month: 'Apr', income: 28000, expenses: 30000 },
  { month: 'May', income: 25000, expenses: 32000 },
  { month: 'Jun', income: 30000, expenses: 25000 },
];

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

const upcomingBills = [
  { id: 'bill1', name: 'Rent', amount: 12000, dueDate: '2024-08-01' },
  { id: 'bill2', name: 'Bike EMI', amount: 3500, dueDate: '2024-08-05' },
  { id: 'bill3', name: 'Internet', amount: 599, dueDate: '2024-08-10' },
];

const savingsGoals = [
  {
    id: 'goal1',
    name: 'Goa Trip',
    current: 12000,
    goal: 30000,
    progress: 40,
  },
  {
    id: 'goal2',
    name: 'Emergency Fund',
    current: 45000,
    goal: 50000,
    progress: 90,
  },
  {
    id: 'goal3',
    name: 'New Phone',
    current: 15000,
    goal: 50000,
    progress: 30,
  },
];

const chartConfig = {
  income: {
    label: 'Income',
    color: 'hsl(var(--primary))',
  },
  expenses: {
    label: 'Expenses',
    color: 'hsl(var(--muted-foreground))',
  },
};

const translations: Record<string, Record<string, string>> = {
  'Total Balance': { hi: 'कुल शेष', mr: 'एकूण शिल्लक' },
  '+10% from last month': { hi: 'पिछले महीने से +10%', mr: 'गेल्या महिन्यापासून +10%' },
  "This Month's Income": { hi: 'इस महीने की आय', mr: 'या महिन्याचे उत्पन्न' },
  '-15% from last month': { hi: 'पिछले महीने से -15%', mr: 'गेल्या महिन्यापासून -15%' },
  "This Month's Expenses": { hi: 'इस महीने के खर्च', mr: 'या महिन्याचा खर्च' },
  '+20.1% from last month': { hi: 'पिछले महीने से +20.1%', mr: 'गेल्या महिन्यापासून +20.1%' },
  'Credit Score': { hi: 'क्रेडिट स्कोर', mr: 'क्रेडिट स्कोअर' },
  '+10 points from last check': { hi: 'पिछली जांच से +10 अंक', mr: 'मागील तपासणीपासून +10 गुण' },
  'Cash Flow': { hi: 'नकद प्रवाह', mr: 'रोकड प्रवाह' },
  'Income vs. Expenses over the last 6 months.': { hi: 'पिछले 6 महीनों में आय बनाम व्यय।', mr: 'गेल्या 6 महिन्यांतील उत्पन्न विरुद्ध खर्च.' },
  'Income': { hi: 'आय', mr: 'उत्पन्न' },
  'Expenses': { hi: 'खर्च', mr: 'खर्च' },
  'Upcoming Bills': { hi: 'आगामी बिल', mr: 'आगामी बिले' },
  'You have %s upcoming bills.': { hi: 'आपके पास %s आगामी बिल हैं।', mr: 'तुमची %s आगामी बिले आहेत.' },
  'Due: %s': { hi: 'देय: %s', mr: 'देय: %s' },
  'Pay': { hi: 'भुगतान करें', mr: 'पैसे द्या' },
  'Recent Transactions': { hi: 'हाल के लेनदेन', mr: 'अलीकडील व्यवहार' },
  'Your 5 most recent transactions.': { hi: 'आपके 5 सबसे हाल के लेनदेन।', mr: 'तुमचे ५ सर्वात अलीकडील व्यवहार.' },
  'View All': { hi: 'सभी देखें', mr: 'सर्व पहा' },
  'Description': { hi: 'विवरण', mr: 'वर्णन' },
  'Category': { hi: 'श्रेणी', mr: 'श्रेणी' },
  'Amount': { hi: 'राशि', mr: 'रक्कम' },
  'Savings Goals': { hi: 'बचत लक्ष्य', mr: 'बचत उद्दिष्ट्ये' },
  'Track your progress towards your financial goals.': { hi: 'अपने वित्तीय लक्ष्यों की दिशा में अपनी प्रगति को ट्रैक करें।', mr: 'तुमच्या आर्थिक उद्दिष्टांच्या दिशेने तुमच्या प्रगतीचा मागोवा घ्या.' },
  // Dynamic content
  'Swiggy': { hi: 'स्विगी', mr: 'स्विगी' },
  'Food': { hi: 'भोजन', mr: 'अन्न' },
  'Weekly Payout': { hi: 'साप्ताहिक भुगतान', mr: 'साप्ताहिक पेआउट' },
  'Phone Bill': { hi: 'फोन बिल', mr: 'फोन बिल' },
  'Bills': { hi: 'बिल', mr: 'बिले' },
  'Petrol': { hi: 'पेट्रोल', mr: 'पेट्रोल' },
  'Transport': { hi: 'परिवहन', mr: 'वाहतूक' },
  'Groceries from DMart': { hi: 'DMart से किराना', mr: 'DMart मधून किराणा' },
  'Rent': { hi: 'किराया', mr: 'भाडे' },
  'Bike EMI': { hi: 'बाइक ईएमआई', mr: 'बाईक ईएमआय' },
  'Internet': { hi: 'इंटरनेट', mr: 'इंटरनेट' },
  'Goa Trip': { hi: 'गोवा यात्रा', mr: 'गोवा ट्रिप' },
  'Emergency Fund': { hi: 'आपातकालीन निधि', mr: 'आपत्कालीन निधी' },
  'New Phone': { hi: 'नया फोन', mr: 'नवीन फोन' },
};


export default function DashboardPage() {
  const [mounted, setMounted] = React.useState(false);
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';

  const t = useMemo(() => (key: string, ...args: (string | number)[]) => {
    if (lang === 'en' || !key) {
      return args.length > 0 ? key.replace(/%s/g, () => args.shift()?.toString() || '') : key;
    }
    let translated = translations[key]?.[lang] || key;
    if (args.length > 0) {
      translated = translated.replace(/%s/g, () => args.shift()?.toString() || '');
    }
    return translated;
  }, [lang]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const translatedChartConfig = useMemo(() => ({
    income: {
      label: t('Income'),
      color: 'hsl(var(--primary))',
    },
    expenses: {
      label: t('Expenses'),
      color: 'hsl(var(--muted-foreground))',
    },
  }), [t]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t('Total Balance')}</CardDescription>
            <CardTitle className="text-4xl">₹45,329</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {t('+10% from last month')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("This Month's Income")}</CardDescription>
            <CardTitle className="text-4xl">₹25,000</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {t('-15% from last month')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("This Month's Expenses")}</CardDescription>
            <CardTitle className="text-4xl">₹32,000</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {t('+20.1% from last month')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t('Credit Score')}</CardDescription>
            <CardTitle className="text-4xl">750</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-green-600">
              {t('+10 points from last check')}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>{t('Cash Flow')}</CardTitle>
            <CardDescription>
              {t('Income vs. Expenses over the last 6 months.')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={translatedChartConfig} className="min-h-[300px] w-full">
              <BarChart accessibilityLayer data={cashFlowData}>
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <ChartTooltip
                  cursor={{ fill: 'hsl(var(--accent))' }}
                  content={<ChartTooltipContent formatter={(value, name) => [`₹${(value as number).toLocaleString()}`, t(name as string)]}/>}
                />
                <Bar
                  dataKey="income"
                  fill="var(--color-income)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expenses"
                  fill="var(--color-expenses)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t('Upcoming Bills')}</CardTitle>
            <CardDescription>
              {t('You have %s upcoming bills.', upcomingBills.length)}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {upcomingBills.map((bill) => (
              <div key={bill.id} className="flex items-center gap-2">
                <div className="grid gap-1 flex-1">
                  <p className="font-medium leading-none">{t(bill.name)}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('Due: %s', new Date(bill.dueDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric' }))}
                  </p>
                </div>
                <div className="font-medium text-right">
                  ₹{bill.amount.toLocaleString('en-IN')}
                </div>
                <Button size="sm" variant="outline" className="ml-auto">
                  {t('Pay')}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
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
                      <div className="font-medium">
                        {t(transaction.description)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                         {new Date(transaction.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric'})}
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
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t('Savings Goals')}</CardTitle>
            <CardDescription>
              {t('Track your progress towards your financial goals.')}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {savingsGoals.map((goal) => (
              <div key={goal.id} className="grid gap-2">
                <div className="flex justify-between items-start font-medium gap-2">
                  <span className="flex-1">{t(goal.name)}</span>
                  <span className="text-right">
                    ₹{goal.current.toLocaleString('en-IN')} / ₹
                    {goal.goal.toLocaleString('en-IN')}
                  </span>
                </div>
                <Progress
                  value={goal.progress}
                  aria-label={`${goal.progress}% progress on ${goal.name}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
