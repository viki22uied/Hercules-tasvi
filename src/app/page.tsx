
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AppLogo } from '@/components/common/AppLogo';
import { ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useAuth } from '@/firebase/auth';

const translations: Record<string, Record<string, string>> = {
  'Hercules Finance AI': { hi: 'हरक्यूलिस फाइनेंस एआई', mr: 'हरक्यूलिस फायनान्स एआय' },
  'Get Started': { hi: 'शुरू करें', mr: 'सुरु करा' },
  'Dashboard': { hi: 'डैशबोर्ड', mr: 'डॅशबोर्ड' },
  'Your Intelligent Financial Companion': { hi: 'आपका बुद्धिमान वित्तीय साथी', mr: 'तुमचा बुद्धिमान आर्थिक साथीदार' },
  'Harness the power of AI to forecast income, manage cash flow, and build a secure financial future with confidence.': { hi: 'आय का पूर्वानुमान लगाने, नकदी प्रवाह का प्रबंधन करने और आत्मविश्वास के साथ एक सुरक्षित वित्तीय भविष्य बनाने के लिए एआई की शक्ति का उपयोग करें।', mr: 'उत्पन्नाचा अंदाज घेण्यासाठी, रोकड प्रवाहाचे व्यवस्थापन करण्यासाठी आणि आत्मविश्वासाने सुरक्षित आर्थिक भविष्य घडवण्यासाठी एआयच्या सामर्थ्याचा वापर करा.' },
  'Take Control of Your Finances': { hi: 'अपने वित्त पर नियंत्रण रखें', mr: 'आपल्या वित्तावर नियंत्रण ठेवा' },
  'AI-Powered Forecasting': { hi: 'एआई-संचालित पूर्वानुमान', mr: 'एआय-चालित अंदाज' },
  'Predict income dips and plan ahead with our intelligent forecasting tools.': { hi: 'आय में गिरावट का अनुमान लगाएं और हमारे बुद्धिमान पूर्वानुमान उपकरणों के साथ आगे की योजना बनाएं।', mr: 'उत्पन्न घसरणीचा अंदाज घ्या आणि आमच्या बुद्धिमान अंदाज साधनांसह पुढे योजना करा.' },
  'Personalized Plans': { hi: 'व्यक्तिगत योजनाएं', mr: 'वैयक्तिक योजना' },
  'Get custom crisis plans and culturally-aware investment advice.': { hi: 'कस्टम संकट योजनाएं और सांस्कृतिक रूप से जागरूक निवेश सलाह प्राप्त करें।', mr: 'सानुकूल संकट योजना आणि सांस्कृतिकदृष्ट्या जागरूक गुंतवणूक सल्ला मिळवा.' },
  'Family & Security': { hi: 'परिवार और सुरक्षा', mr: 'कुटुंब आणि सुरक्षा' },
  'Collaborate on family finances and learn to spot scams with our simulations.': { hi: 'पारिवारिक वित्त पर सहयोग करें और हमारे सिमुलेशन के साथ घोटालों को पहचानना सीखें।', mr: 'कौटुंबिक वित्तावर सहयोग करा आणि आमच्या सिमुलेशनद्वारे घोटाळे ओळखायला शिका.' },
  '© %s Hercules Finance AI. All rights reserved.': { hi: '© %s हरक्यूलिस फाइनेंस एआई। सर्वाधिकार सुरक्षित।', mr: '© %s हरक्यूलिस फायनान्स एआय। सर्व हक्क राखीव.' },
};


export default function LandingPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');
  const searchParams = useSearchParams();
  const { user } = useAuth();
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

  const getHref = (href: string) => {
    if (lang === 'en') return href;
    return `${href}?lang=${lang}`;
  }

  const getStartedLink = user ? getHref("/dashboard") : getHref("/signup");
  const getStartedText = user ? t('Dashboard') : t('Get Started');

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href={getHref("/")} className="flex items-center gap-2">
          <AppLogo className="size-8 text-primary" />
          <span className="text-lg font-bold text-foreground">
            {t('Hercules Finance AI')}
          </span>
        </Link>
        <Button asChild>
          <Link href={getStartedLink}>
            {getStartedText} <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </header>
      <main className="flex-1">
        <section className="relative h-[60vh] min-h-[400px] w-full">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="relative z-10 flex h-full items-center justify-center">
            <div className="container mx-auto px-4 text-center text-card-foreground">
              <div className="max-w-3xl mx-auto bg-background/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
                <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  {t('Your Intelligent Financial Companion')}
                </h1>
                <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                  {t('Harness the power of AI to forecast income, manage cash flow, and build a secure financial future with confidence.')}
                </p>
                <div className="mt-10">
                  <Button size="lg" asChild>
                    <Link href={getStartedLink}>
                      {t('Take Control of Your Finances')}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="text-center">
                <h3 className="font-headline text-2xl font-bold">
                  {t('AI-Powered Forecasting')}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {t('Predict income dips and plan ahead with our intelligent forecasting tools.')}
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-headline text-2xl font-bold">
                  {t('Personalized Plans')}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {t('Get custom crisis plans and culturally-aware investment advice.')}
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-headline text-2xl font-bold">
                  {t('Family & Security')}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {t('Collaborate on family finances and learn to spot scams with our simulations.')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>{t('© %s Hercules Finance AI. All rights reserved.', new Date().getFullYear())}</p>
        </div>
      </footer>
    </div>
  );
}
