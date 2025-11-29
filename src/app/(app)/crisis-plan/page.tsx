'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CrisisPlanClient } from './components/CrisisPlanClient';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

const translations: Record<string, Record<string, string>> = {
  'Personalized Crisis Response': { hi: 'व्यक्तिगत संकट प्रतिक्रिया', mr: 'वैयक्तिक संकट प्रतिसाद' },
  'Generate a custom, actionable plan to manage a financial shortfall without causing panic.': { hi: 'घबराहट पैदा किए बिना वित्तीय कमी का प्रबंधन करने के लिए एक कस्टम, कार्रवाई योग्य योजना बनाएं।', mr: 'घाबरल्याशिवाय आर्थिक तुटवडा व्यवस्थापित करण्यासाठी सानुकूल, कार्यवाही करण्यायोग्य योजना तयार करा.' },
  'Crisis Plan Generator': { hi: 'संकट योजना जेनरेटर', mr: 'संकट योजना जनरेटर' },
  'Provide your financial details to receive a step-by-step plan to navigate your financial shortfall.': { hi: 'अपनी वित्तीय कमी को दूर करने के लिए चरण-दर-चरण योजना प्राप्त करने के लिए अपना वित्तीय विवरण प्रदान करें।', mr: 'तुमच्या आर्थिक तुटवड्यावर मात करण्यासाठी चरण-दर-चरण योजना प्राप्त करण्यासाठी तुमचे आर्थिक तपशील प्रदान करा.' },
};

export default function CrisisPlanPage() {
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
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t('Personalized Crisis Response')}</h1>
        <p className="text-muted-foreground">
          {t('Generate a custom, actionable plan to manage a financial shortfall without causing panic.')}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('Crisis Plan Generator')}</CardTitle>
          <CardDescription>
            {t('Provide your financial details to receive a step-by-step plan to navigate your financial shortfall.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CrisisPlanClient />
        </CardContent>
      </Card>
    </div>
  );
}
