'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StressSensingClient } from './components/StressSensingClient';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

const translations: Record<string, Record<string, string>> = {
  'Emotional Stress Sensing': { hi: 'भावनात्मक तनाव संवेदन', mr: 'भावनिक तणाव सेन्सिंग' },
  'Detect potential financial distress through sentiment analysis of your thoughts or transaction details.': { hi: 'अपने विचारों या लेनदेन विवरणों के भावना विश्लेषण के माध्यम से संभावित वित्तीय संकट का पता लगाएं।', mr: 'तुमच्या विचारांच्या किंवा व्यवहाराच्या तपशिलांच्या भावना विश्लेषणाद्वारे संभाव्य आर्थिक त्रासाचा शोध घ्या.' },
  'Sentiment Analysis': { hi: 'भावना विश्लेषण', mr: 'भावना विश्लेषण' },
  "Enter any text below, like a recent transaction or how you're feeling about your finances, to get an analysis.": { hi: 'नीचे कोई भी पाठ दर्ज करें, जैसे हाल का लेनदेन या आप अपनी वित्तीय स्थिति के बारे में कैसा महसूस कर रहे हैं, ताकि विश्लेषण प्राप्त हो सके।', mr: 'खाली कोणताही मजकूर प्रविष्ट करा, जसे की अलीकडील व्यवहार किंवा तुम्हाला तुमच्या वित्ताबद्दल कसे वाटत आहे, विश्लेषण मिळवण्यासाठी.' },
};

export default function StressSensingPage() {
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
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t('Emotional Stress Sensing')}</h1>
        <p className="text-muted-foreground">
          {t('Detect potential financial distress through sentiment analysis of your thoughts or transaction details.')}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('Sentiment Analysis')}</CardTitle>
          <CardDescription>
            {t("Enter any text below, like a recent transaction or how you're feeling about your finances, to get an analysis.")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StressSensingClient />
        </CardContent>
      </Card>
    </div>
  );
}
