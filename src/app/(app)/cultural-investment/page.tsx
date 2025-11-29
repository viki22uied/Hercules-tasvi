'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CulturalInvestmentClient } from './components/CulturalInvestmentClient';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

const translations: Record<string, Record<string, string>> = {
  'Cultural Investment Education': { hi: 'सांस्कृतिक निवेश शिक्षा', mr: 'सांस्कृतिक गुंतवणूक शिक्षण' },
  'Receive personalized investment guidance that considers your cultural background and traditional festivals.': { hi: 'व्यक्तिगत निवेश मार्गदर्शन प्राप्त करें जो आपकी सांस्कृतिक पृष्ठभूमि और पारंपरिक त्योहारों पर विचार करता है।', mr: 'तुमची सांस्कृतिक पार्श्वभूमी आणि पारंपरिक सणांचा विचार करून वैयक्तिक गुंतवणूक मार्गदर्शन मिळवा.' },
  'Investment Guidance': { hi: 'निवेश मार्गदर्शन', mr: 'गुंतवणूक मार्गदर्शन' },
  'Tell us about your context to receive culturally relevant investment advice.': { hi: 'सांस्कृतिक रूप से प्रासंगिक निवेश सलाह प्राप्त करने के लिए हमें अपने संदर्भ के बारे में बताएं।', mr: 'सांस्कृतिकदृष्ट्या संबंधित गुंतवणूक सल्ला मिळवण्यासाठी आम्हाला तुमच्या संदर्भाबद्दल सांगा.' },
};

export default function CulturalInvestmentPage() {
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
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t('Cultural Investment Education')}</h1>
        <p className="text-muted-foreground">
          {t('Receive personalized investment guidance that considers your cultural background and traditional festivals.')}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('Investment Guidance')}</CardTitle>
          <CardDescription>
            {t('Tell us about your context to receive culturally relevant investment advice.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CulturalInvestmentClient />
        </CardContent>
      </Card>
    </div>
  );
}
