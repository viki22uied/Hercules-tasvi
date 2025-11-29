'use client';

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
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

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

const translations: Record<string, Record<string, string>> = {
    'Shared This Month': { hi: 'इस महीने साझा किया गया', mr: 'या महिन्यात शेअर केले' },
    'Total from %s transactions': { hi: '%s लेनदेन से कुल', mr: '%s व्यवहारांमधून एकूण' },
    'Your Contribution': { hi: 'आपका योगदान', mr: 'तुमचे योगदान' },
    '%s% of total expenses': { hi: 'कुल खर्च का %s%', mr: 'एकूण खर्चाच्या %s%' },
    'Shared Expenses': { hi: 'साझा खर्च', mr: 'सामायिक खर्च' },
    'Recent expenses shared with your family.': { hi: 'हाल ही में आपके परिवार के साथ साझा किए गए खर्च।', mr: 'तुमच्या कुटुंबासोबत अलीकडे शेअर केलेले खर्च.' },
    'Description': { hi: 'विवरण', mr: 'वर्णन' },
    'Category': { hi: 'वर्ग', mr: 'श्रेणी' },
    'Date': { hi: 'तारीख', mr: 'तारीख' },
    'Paid By': { hi: 'द्वारा भुगतान', mr: 'द्वारे देय' },
    'Amount': { hi: 'रकम', mr: 'रक्कम' },
    'Family Members': { hi: 'परिवार के सदस्य', mr: 'कुटुंब सदस्य' },
    'Manage your family members and their contributions.': { hi: 'अपने परिवार के सदस्यों और उनके योगदान का प्रबंधन करें।', mr: 'तुमचे कुटुंब सदस्य आणि त्यांचे योगदान व्यवस्थापित करा.' },
    'Add Member': { hi: 'सदस्य जोड़ें', mr: 'सदस्य जोडा' },
    'Contribution Status': { hi: 'योगदान की स्थिति', mr: 'योगदान स्थिती' },
    'Paid': { hi: 'भुगतान किया गया', mr: 'पैसे दिले' },
    'Pending': { hi: 'लंबित', mr: 'प्रलंबित' },
    'Overdue': { hi: 'अतिदेय', mr: 'थकबाकी' },
    'You': { hi: 'आप', mr: 'तुम्ही' },
    'Riya': { hi: 'रिया', mr: 'रिया' },
    'Rohan': { hi: 'रोहन', mr: 'रोहन' },
    'Priya': { hi: 'प्रिया', mr: 'प्रिया' },
    'Monthly Rent': { hi: 'मासिक किराया', mr: 'मासिक भाडे' },
    'Housing': { hi: 'आवास', mr: 'गृहनिर्माण' },
    'Groceries': { hi: 'किराने का सामान', mr: 'किराणा' },
    'Food': { hi: 'भोजन', mr: 'अन्न' },
    'Internet & Cable': { hi: 'इंटरनेट और केबल', mr: 'इंटरनेट आणि केबल' },
    'Utilities': { hi: 'उपयोगिताएँ', mr: 'उपयुक्तता' },
    'Family Dinner': { hi: 'पारिवारिक रात्रिभोज', mr: 'कौटुंबिक जेवण' },
    'Entertainment': { hi: 'मनोरंजन', mr: 'मनोरंजन' },
    'Electricity Bill': { hi: 'बिजली का बिल', mr: 'वीज बिल' },
};

const getAvatarUrl = (avatarId: string) => {
  return PlaceHolderImages.find((img) => img.id === avatarId)?.imageUrl || '';
};

const getAvatarHint = (avatarId: string) => {
  return PlaceHolderImages.find((img) => img.id === avatarId)?.imageHint || '';
};

export function FamilyFinanceClient() {
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


  const totalShared = sharedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const yourContribution = sharedExpenses
    .filter((e) => e.paidBy === 'You')
    .reduce((sum, exp) => sum + exp.amount, 0);
  const yourContributionPercentage =
    totalShared > 0 ? (yourContribution / totalShared) * 100 : 0;

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t('Shared This Month')}</CardDescription>
              <CardTitle className="text-4xl">
                ₹{totalShared.toLocaleString('en-IN')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {t('Total from %s transactions', sharedExpenses.length)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t('Your Contribution')}</CardDescription>
              <CardTitle className="text-4xl">
                ₹{yourContribution.toLocaleString('en-IN')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {t('%s% of total expenses', yourContributionPercentage.toFixed(0))}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="px-7">
            <CardTitle>{t('Shared Expenses')}</CardTitle>
            <CardDescription>
              {t('Recent expenses shared with your family.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('Description')}</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    {t('Category')}
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">{t('Date')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('Paid By')}</TableHead>
                  <TableHead className="text-right">{t('Amount')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sharedExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <div className="font-medium">{t(expense.description)}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {t(expense.category)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {new Date(expense.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {t(expense.paidBy)}
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
              <CardTitle>{t('Family Members')}</CardTitle>
              <CardDescription>
                {t('Manage your family members and their contributions.')}
              </CardDescription>
            </div>
            <Button size="sm" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> {t('Add Member')}
            </Button>
          </CardHeader>
          <CardContent className="grid gap-6">
            {familyMembers.map((member) => (
              <div
                key={member.name}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={getAvatarUrl(member.avatarId)}
                      data-ai-hint={getAvatarHint(member.avatarId)}
                    />
                    <AvatarFallback>{t(member.name).charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {t(member.name)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('Contribution Status')}
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
                  {t(member.status)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
