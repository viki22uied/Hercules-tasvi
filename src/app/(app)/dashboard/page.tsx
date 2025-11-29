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
import React from 'react';

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

export default function DashboardPage() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Balance</CardDescription>
            <CardTitle className="text-4xl">₹45,329</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +10% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>This Month's Income</CardDescription>
            <CardTitle className="text-4xl">₹25,000</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              -15% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>This Month's Expenses</CardDescription>
            <CardTitle className="text-4xl">₹32,000</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +20.1% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Credit Score</CardDescription>
            <CardTitle className="text-4xl">750</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-green-600">
              +10 points from last check
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
            <CardDescription>
              Income vs. Expenses over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
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
                  content={<ChartTooltipContent formatter={(value, name) => [`₹${(value as number).toLocaleString()}`, name === 'income' ? 'Income' : 'Expenses']}/>}
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
            <CardTitle>Upcoming Bills</CardTitle>
            <CardDescription>
              You have {upcomingBills.length} upcoming bills.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {upcomingBills.map((bill) => (
              <div key={bill.id} className="flex items-center gap-4">
                <div className="grid gap-1">
                  <p className="font-medium leading-none">{bill.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Due: {new Date(bill.dueDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  ₹{bill.amount.toLocaleString('en-IN')}
                </div>
                <Button size="sm" variant="outline">
                  Pay
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
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Your 5 most recent transactions.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="#">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="font-medium">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-muted-foreground">
                         {new Date(transaction.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric'})}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.category}</Badge>
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
            <CardTitle>Savings Goals</CardTitle>
            <CardDescription>
              Track your progress towards your financial goals.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {savingsGoals.map((goal) => (
              <div key={goal.id} className="grid gap-2">
                <div className="flex justify-between font-medium">
                  <span>{goal.name}</span>
                  <span>
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

    