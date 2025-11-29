'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { ArrowUpRight, DollarSign, CreditCard, Activity } from 'lucide-react';
import Link from 'next/link';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart';

const cashFlowData = [
  { name: 'Jan', income: 4000, expenses: 2400 },
  { name: 'Feb', income: 3000, expenses: 1398 },
  { name: 'Mar', income: 5000, expenses: 3800 },
  { name: 'Apr', income: 2780, expenses: 3908 },
  { name: 'May', income: 1890, expenses: 4800 },
  { name: 'Jun', income: 2390, expenses: 3800 },
];

const transactions = [
  {
    id: 'txn1',
    description: 'Starbucks',
    amount: -5.75,
    date: '2024-07-22',
    category: 'Food',
  },
  {
    id: 'txn2',
    description: 'Paycheck',
    amount: 1250.0,
    date: '2024-07-21',
    category: 'Income',
  },
  {
    id: 'txn3',
    description: 'Netflix Subscription',
    amount: -15.99,
    date: '2024-07-20',
    category: 'Bills',
  },
  {
    id: 'txn4',
    description: 'Gas Station',
    amount: -45.3,
    date: '2024-07-20',
    category: 'Transport',
  },
  {
    id: 'txn5',
    description: 'Grocery Store',
    amount: -120.55,
    date: '2024-07-19',
    category: 'Food',
  },
];

const upcomingBills = [
  { id: 'bill1', name: 'Rent', amount: 1500, dueDate: '2024-08-01' },
  { id: 'bill2', name: 'Car Payment', amount: 350, dueDate: '2024-08-05' },
  { id: 'bill3', name: 'Internet', amount: 60, dueDate: '2024-08-10' },
];

const savingsGoals = [
  {
    id: 'goal1',
    name: 'Vacation Fund',
    current: 1200,
    goal: 3000,
    progress: 40,
  },
  {
    id: 'goal2',
    name: 'Emergency Fund',
    current: 4500,
    goal: 5000,
    progress: 90,
  },
  {
    id: 'goal3',
    name: 'New Car',
    current: 2500,
    goal: 20000,
    progress: 12.5,
  },
];

export default function DashboardPage() {
  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Balance</CardDescription>
            <CardTitle className="text-4xl">$5,329</CardTitle>
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
            <CardTitle className="text-4xl">$1,890</CardTitle>
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
            <CardTitle className="text-4xl">$4,800</CardTitle>
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
            <CardDescription>Income vs. Expenses over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cashFlowData}>
                <XAxis
                  dataKey="name"
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
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--accent))' }}
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="income"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expenses"
                  fill="hsl(var(--muted-foreground))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
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
                    Due: {bill.dueDate}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  ${bill.amount.toFixed(2)}
                </div>
                <Button size="sm" variant="outline">Pay</Button>
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
              <CardDescription>Your 5 most recent transactions.</CardDescription>
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
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.category}</Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-foreground'
                      }`}
                    >
                      {transaction.amount > 0 ? '+' : ''}$
                      {Math.abs(transaction.amount).toFixed(2)}
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
            <CardDescription>Track your progress towards your financial goals.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {savingsGoals.map(goal => (
              <div key={goal.id} className="grid gap-2">
                <div className="flex justify-between font-medium">
                  <span>{goal.name}</span>
                  <span>${goal.current.toLocaleString()} / ${goal.goal.toLocaleString()}</span>
                </div>
                <Progress value={goal.progress} aria-label={`${goal.progress}% progress on ${goal.name}`} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
