'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Globe } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition, useEffect, useCallback } from 'react';
import { translateText } from '@/ai/flows/translate-flow';

const pageTitles: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/income-intelligence': 'Income Intelligence',
  '/family-finance': 'Family Finance',
  '/crisis-plan': 'Personalized Crisis Plan',
  '/cultural-investment': 'Cultural Investment',
  '/stress-sensing': 'Emotional Stress Sensing',
  '/scam-simulation': 'Scam & Fraud Simulation',
};

const translations: Record<string, Record<string, string>> = {
    'Dashboard': { hi: 'डैशबोर्ड', mr: 'डॅशबोर्ड' },
    'Income Intelligence': { hi: 'आय बुद्धिमत्ता', mr: 'उत्पन्न बुद्धिमत्ता' },
    'Family Finance': { hi: 'पारिवारिक वित्त', mr: 'कौटुंबिक वित्त' },
    'Personalized Crisis Plan': { hi: 'व्यक्तिगत संकट योजना', mr: 'वैयक्तिक संकट योजना'},
    'Cultural Investment': { hi: 'सांस्कृतिक गुंतवणूक', mr: 'सांस्कृतिक गुंतवणूक' },
    'Emotional Stress Sensing': { hi: 'भावनिक तणाव सेन्सिंग', mr: 'भावनिक तणाव सेन्सिंग' },
    'Scam & Fraud Simulation': { hi: 'घोटाळा आणि फसवणूक सिम्युलेशन', mr: 'घोटाळा आणि फसवणूक सिम्युलेशन' },
    'Crisis Plan': { hi: 'संकट योजना', mr: 'संकट योजना' },
    'Stress Sensing': { hi: 'तणाव सेन्सिंग', mr: 'तणाव सेन्सिंग' },
    'Scam Simulation': { hi: 'घोटाळा सिम्युलेशन', mr: 'घोटाळा सिम्युलेशन' },
    'Hercules Finance AI': { hi: 'हरक्यूलिस फायनान्स एआय', mr: 'हरक्यूलिस फायनान्स एआय' },
    'Settings': { hi: 'सेटिंग्ज', mr: 'सेटिंग्ज' },
    'Support': { hi: 'समर्थन', mr: 'समर्थन' },
    'Hercules AI': { hi: 'हरक्यूलिस एआय', mr: 'हरक्यूलिस एआय'},
    'My Account': { hi: 'मेरा खाता', mr: 'माझे खाते' },
    'Logout': { hi: 'लॉग आउट', mr: 'लॉग आउट' },
  };

const translateTitle = (key: string, lang: string) => {
  if (lang === 'en' || !key) return key;
  return translations[key]?.[lang] || key;
};

// Debounce function
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<F>): Promise<ReturnType<F>> =>
      new Promise(resolve => {
        if (timeout) {
          clearTimeout(timeout);
        }

        timeout = setTimeout(() => resolve(func(...args)), waitFor);
      });
};

const debouncedTranslate = debounce(translateText, 300);

const translateElements = async (targetLang: string) => {
    document.querySelectorAll('[data-original-text]').forEach(el => {
        const originalText = (el as HTMLElement).dataset.originalText;
        if (originalText) {
            el.textContent = originalText;
        }
        (el as HTMLElement).removeAttribute('data-original-text');
        (el as HTMLElement).removeAttribute('data-translated');
    });

    if (targetLang === 'en') return;

    const elements = document.querySelectorAll('p, h1, h2, h3, h4, span, div, label, button, a, [data-translate]');
    const translatableElements: HTMLElement[] = [];

    const isTranslated = (lang: string, text: string) => {
        for (const key in translations) {
            const langValues = Object.values(translations[key]);
            if (langValues.includes(text)) return true;
        }
        return false;
    };
    
    elements.forEach(el => {
        const htmlEl = el as HTMLElement;
        const hasNoTranslatableChildren = ![...el.children].some(child => child.nodeName.match(/^(P|H[1-6]|SPAN|DIV|LABEL|BUTTON|A)$/));
        const isNotEmpty = htmlEl.textContent?.trim();
        const isNotSrOnly = !htmlEl.classList.contains('sr-only');
        const isNotTranslated = !htmlEl.hasAttribute('data-translated');

        if (hasNoTranslatableChildren && isNotEmpty && isNotSrOnly && isNotTranslated) {
            if (!isTranslated(targetLang, htmlEl.textContent!.trim())) {
                 translatableElements.push(htmlEl);
            }
        }
    });

    for (const el of translatableElements) {
        const originalText = el.textContent || '';
        if (originalText.trim().length > 1 && !originalText.startsWith('₹')) {
            if (el.hasAttribute('data-original-text')) continue;

            el.dataset.originalText = originalText;
            try {
                const staticTranslation = translations[originalText.trim()]?.[targetLang];
                if (staticTranslation) {
                     if (el.dataset.originalText === originalText) {
                        el.textContent = staticTranslation;
                        el.dataset.translated = "true";
                     }
                } else {
                    const { translation } = await debouncedTranslate({ text: originalText, targetLang });
                    if (el.dataset.originalText === originalText) { // Check again in case of race condition
                        el.textContent = translation;
                        el.dataset.translated = "true";
                    }
                }
            } catch (e) {
                console.error("Translation failed for:", originalText, e);
                 if (el.dataset.originalText) {
                    el.textContent = el.dataset.originalText; // Revert on failure
                 }
            }
        }
    }
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const getInitialLang = useCallback(() => {
    if (typeof window === 'undefined') return 'en';
    const lang = new URLSearchParams(window.location.search).get('lang');
    return lang && ['en', 'hi', 'mr'].includes(lang) ? lang : 'en';
  }, []);

  const [language, setLanguage] = useState(getInitialLang);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const lang = getInitialLang();
    setLanguage(lang);
    const timer = setTimeout(() => {
         translateElements(lang);
    }, 150);
    return () => clearTimeout(timer);
  }, [pathname, searchParams, getInitialLang]);
  
  const onSelectLanguage = (lang: string) => {
    if (language === lang) return;
    
    startTransition(() => {
      setLanguage(lang);
      const params = new URLSearchParams(window.location.search);
      if (lang === 'en') {
          params.delete('lang');
      } else {
          params.set('lang', lang);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };
  
  const originalTitle = pageTitles[pathname] || 'Hercules Finance AI';
  const title = hydrated ? translateTitle(originalTitle, language) : originalTitle;

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" disabled={isPending || !hydrated}>
              <Globe className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Language</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={language}
              onValueChange={onSelectLanguage}
            >
              <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="hi">Hindi</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="mr">Marathi</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src="https://picsum.photos/seed/user/100/100" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
