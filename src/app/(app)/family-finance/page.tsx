import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { PlusCircle } from 'lucide-react';

const familyMembers = [
  { name: 'You', status: 'Paid', avatarId: 'avatar1' },
  { name: 'Riya', status: 'Paid', avatarId: 'avatar2' },
  { name: 'Rohan', status: 'Pending', avatarId: 'avatar3' },
  { name: 'Priya', status: 'Overdue', avatarId: 'avatar4' },
];

const sharedExpenses = [
  {
    id: 'exp1',
    description: 'Monthly Rent',
    category: 'Housing',
    amount: 22000,
    date: '2024-07-01',
    paidBy: 'You',
  },
  {
    id: 'exp2',
    description: 'Groceries',
    category: 'Food',
    amount: 4500,
    date: '2024-07-15',
    paidBy: 'Riya',
  },
  {
    id: 'exp3',
    description: 'Internet & Cable',
    category: 'Utilities',
    amount: 1200,
    date: '2024-07-10',
    paidBy: 'You',
  },
  {
    id: 'exp4',
    description: 'Family Dinner',
    category: 'Entertainment',
    amount: 1500,
    date: '2024-07-18',
    paidBy: 'Riya',
  },
  {
    id: 'exp5',
    description: 'Electricity Bill',
    category: 'Utilities',
    amount: 850,
    date: '2024-07-20',
    paidBy: 'You',
  },
];

const getAvatarUrl = (avatarId: string) => {
  return PlaceHolderImages.find((img) => img.id === avatarId)?.imageUrl || '';
};

const getAvatarHint = (avatarId: string) => {
    return PlaceHolderImages.find((img) => img.id === avatarId)?.imageHint || '';
}

export default function FamilyFinancePage() {
  const totalShared = sharedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const yourContribution = sharedExpenses.filter(e => e.paidBy === 'You').reduce((sum, exp) => sum + exp.amount, 0);
  const yourContributionPercentage = totalShared > 0 ? (yourContribution / totalShared) * 100 : 0;

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Shared This Month</CardDescription>
              <CardTitle className="text-4xl">₹{totalShared.toLocaleString('en-IN')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Total from {sharedExpenses.length} transactions
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Your Contribution</CardDescription>
              <CardTitle className="text-4xl">₹{yourContribution.toLocaleString('en-IN')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {yourContributionPercentage.toFixed(0)}% of total expenses
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Shared Expenses</CardTitle>
            <CardDescription>
              Recent expenses shared with your family.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Category
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="hidden md:table-cell">Paid By</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sharedExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <div className="font-medium">{expense.description}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {expense.category}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                       {new Date(expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric'})}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {expense.paidBy}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{expense.amount.toLocaleString('en-IN')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Family Members</CardTitle>
              <CardDescription>
                Manage your family members and their contributions.
              </CardDescription>
            </div>
            <Button size="sm" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </CardHeader>
          <CardContent className="grid gap-6">
            {familyMembers.map((member) => (
              <div key={member.name} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={getAvatarUrl(member.avatarId)} data-ai-hint={getAvatarHint(member.avatarId)} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {member.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Contribution Status
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    member.status === 'Paid'
                      ? 'default'
                      : member.status === 'Pending'
                      ? 'secondary'
                      : 'destructive'
                  }
                  className="bg-opacity-20 text-opacity-100"
                >
                  {member.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    