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
import { usePathname, useRouter } from 'next/navigation';
import { useState, useTransition, useEffect } from 'react';

const pageTitles: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/income-intelligence': 'Income Intelligence',
  '/family-finance': 'Family Finance',
  '/crisis-plan': 'Personalized Crisis Plan',
  '/cultural-investment': 'Cultural Investment',
  '/stress-sensing': 'Emotional Stress Sensing',
  '/scam-simulation': 'Scam & Fraud Simulation',
};

// A mock translation function. In a real app, you'd use a library like i18next.
const translate = (key: string, lang: string) => {
  const translations: Record<string, Record<string, string>> = {
    Dashboard: { hi: 'डैशबोर्ड', mr: 'डॅशबोर्ड' },
    'Income Intelligence': { hi: 'आय बुद्धिमत्ता', mr: 'उत्पन्न बुद्धिमत्ता' },
    'Family Finance': { hi: 'पारिवारिक वित्त', mr: 'कौटुंबिक वित्त' },
    'Personalized Crisis Plan': { hi: 'व्यक्तिगत संकट योजना', mr: 'वैयक्तिक संकट योजना'},
    'Cultural Investment': { hi: 'सांस्कृतिक गुंतवणूक', mr: 'सांस्कृतिक गुंतवणूक' },
    'Emotional Stress Sensing': { hi: 'भावनिक तणाव सेन्सिंग', mr: 'भावनिक तणाव सेन्सिंग' },
    'Scam & Fraud Simulation': { hi: 'घोटाळा आणि फसवणूक सिम्युलेशन', mr: 'घोटाळा आणि फसवणूक सिम्युलेशन' },
    'Hercules Finance AI': { hi: 'हरक्यूलिस फायनान्स एआय', mr: 'हरक्यूलिस फायनान्स एआय' },
  };
  return translations[key]?.[lang] || key;
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Get initial language from URL or default to 'en'
  const getInitialLang = () => {
    if (typeof window === 'undefined') return 'en';
    const params = new URLSearchParams(window.location.search);
    return params.get('lang') || 'en';
  };

  const [language, setLanguage] = useState(getInitialLang);

  useEffect(() => {
    setLanguage(getInitialLang());
  }, [pathname]);

  const onSelectLanguage = (lang: string) => {
    setLanguage(lang);
    const newUrl = `${pathname}?lang=${lang}`;
    startTransition(() => {
      router.replace(newUrl);
      // In a real app with i18next, this would trigger a re-render with new translations.
      // Here, we manually update the title as a demonstration.
    });
  };
  
  const originalTitle = pageTitles[pathname] || 'Hercules Finance AI';
  const title = translate(originalTitle, language);

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" disabled={isPending}>
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

    