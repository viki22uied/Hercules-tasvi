'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScamSimulationClient } from './components/ScamSimulationClient';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

const translations: Record<string, Record<string, string>> = {
  'Scam & Fraud Simulation': { hi: 'घोटाला और धोखाधड़ी सिमुलेशन', mr: 'घोटाळा आणि फसवणूक सिमुलेशन' },
  'Learn to identify fraudulent activities by experiencing realistic, AI-powered scam simulations.': { hi: 'यथार्थवादी, एआई-संचालित घोटाले सिमुलेशन का अनुभव करके धोखाधड़ी गतिविधियों की पहचान करना सीखें।', mr: 'वास्तववादी, एआय-चालित घोटाळा सिमुलेशनचा अनुभव घेऊन फसव्या क्रियाकलाप ओळखायला शिका.' },
  'Scam Simulator': { hi: 'घोटाला सिमुलेटर', mr: 'घोटाळा सिम्युलेटर' },
  'Choose a scam type to start the simulation and test your awareness.': { hi: 'सिमुलेशन शुरू करने और अपनी जागरूकता का परीक्षण करने के लिए एक घोटाले का प्रकार चुनें।', mr: 'सिमुलेशन सुरू करण्यासाठी आणि तुमची जागरूकता तपासण्यासाठी घोटाळ्याचा प्रकार निवडा.' },
};

export default function ScamSimulationPage() {
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
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t('Scam & Fraud Simulation')}</h1>
        <p className="text-muted-foreground">
          {t('Learn to identify fraudulent activities by experiencing realistic, AI-powered scam simulations.')}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('Scam Simulator')}</CardTitle>
          <CardDescription>
            {t('Choose a scam type to start the simulation and test your awareness.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScamSimulationClient />
        </CardContent>
      </Card>
    </div>
  );
}
