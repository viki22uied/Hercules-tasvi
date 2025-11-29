'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IncomeIntelligenceClient } from './components/IncomeIntelligenceClient';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

const translations: Record<string, Record<string, string>> = {
  'Income Intelligence & Forecasting': { hi: 'आय बुद्धिमत्ता और पूर्वानुमान', mr: 'उत्पन्न बुद्धिमत्ता आणि अंदाज' },
  'Analyze historical income data to forecast weekly income and proactively identify potential income dips.': { hi: 'साप्ताहिक आय का पूर्वानुमान करने और संभावित आय में गिरावट की सक्रिय रूप से पहचान करने के लिए ऐतिहासिक आय डेटा का विश्लेषण करें।', mr: 'साप्ताहिक उत्पन्नाचा अंदाज घेण्यासाठी आणि संभाव्य उत्पन्न घसरणी सक्रियपणे ओळखण्यासाठी ऐतिहासिक उत्पन्न डेटाचे विश्लेषण करा.' },
  'Income Analysis': { hi: 'आय विश्लेषण', mr: 'उत्पन्न विश्लेषण' },
  'Provide your financial details to get an AI-powered income forecast.': { hi: 'एआई-संचालित आय पूर्वानुमान प्राप्त करने के लिए अपना वित्तीय विवरण प्रदान करें।', mr: 'एआय-चालित उत्पन्न अंदाज मिळवण्यासाठी तुमचे आर्थिक तपशील प्रदान करा.' },
};

export default function IncomeIntelligencePage() {
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

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t('Income Intelligence & Forecasting')}</h1>
        <p className="text-muted-foreground">
          {t('Analyze historical income data to forecast weekly income and proactively identify potential income dips.')}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('Income Analysis')}</CardTitle>
          <CardDescription>
            {t('Provide your financial details to get an AI-powered income forecast.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IncomeIntelligenceClient />
        </CardContent>
      </Card>
    </div>
  );
}
