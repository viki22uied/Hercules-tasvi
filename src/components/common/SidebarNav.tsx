'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { AppLogo } from './AppLogo';
import {
  LayoutDashboard,
  LineChart,
  Users,
  ShieldAlert,
  Sprout,
  HeartPulse,
  Scan,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { useCallback } from 'react';

const menuItems = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    tooltip: 'Dashboard',
  },
  {
    href: '/income-intelligence',
    icon: LineChart,
    label: 'Income Intelligence',
    tooltip: 'Income Intelligence',
  },
  {
    href: '/family-finance',
    icon: Users,
    label: 'Family Finance',
    tooltip: 'Family Finance',
  },
  {
    href: '/crisis-plan',
    icon: ShieldAlert,
    label: 'Crisis Plan',
    tooltip: 'Crisis Plan',
  },
  {
    href: '/cultural-investment',
    icon: Sprout,
    label: 'Cultural Investment',
    tooltip: 'Cultural Investment',
  },
  {
    href: '/stress-sensing',
    icon: HeartPulse,
    label: 'Stress Sensing',
    tooltip: 'Stress Sensing',
  },
  {
    href: '/scam-simulation',
    icon: Scan,
    label: 'Scam Simulation',
    tooltip: 'Scam Simulation',
  },
];

const translations: Record<string, Record<string, string>> = {
    'Dashboard': { hi: 'डैशबोर्ड', mr: 'डॅशबोर्ड' },
    'Income Intelligence': { hi: 'आय बुद्धिमत्ता', mr: 'उत्पन्न बुद्धिमत्ता' },
    'Family Finance': { hi: 'पारिवारिक वित्त', mr: 'कौटुंबिक वित्त' },
    'Crisis Plan': { hi: 'संकट योजना', mr: 'संकट योजना' },
    'Cultural Investment': { hi: 'सांस्कृतिक गुंतवणूक', mr: 'सांस्कृतिक गुंतवणूक' },
    'Stress Sensing': { hi: 'तणाव सेन्सिंग', mr: 'तणाव सेन्सिंग' },
    'Scam Simulation': { hi: 'घोटाळा सिम्युलेशन', mr: 'घोटाळा सिम्युलेशन' },
    'Hercules AI': { hi: 'हरक्यूलिस एआय', mr: 'हरक्यूलिस एआय'},
    'Settings': { hi: 'सेटिंग्ज', mr: 'सेटिंग्ज' },
    'Support': { hi: 'समर्थन', mr: 'समर्थन' },
};

const translate = (key: string, lang: string) => {
  if (lang === 'en' || !key) return key;
  return translations[key]?.[lang] || key;
};

export function SidebarNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getLang = useCallback(() => {
    const lang = searchParams.get('lang');
    return lang && ['en', 'hi', 'mr'].includes(lang) ? lang : 'en';
  }, [searchParams]);

  const lang = getLang();

  const getHref = (href: string) => {
      if (lang === 'en') return href;
      return `${href}?lang=${lang}`;
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 p-2">
          <AppLogo className="size-8 text-primary" />
          <span className="text-lg font-bold">{translate('Hercules AI', lang)}</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: translate(item.tooltip, lang), side: 'right' }}
              >
                <Link href={getHref(item.href)}>
                  <item.icon />
                  <span>{translate(item.label, lang)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={{ children: translate('Settings', lang), side: 'right' }}
            >
              <Link href="#">
                <Settings />
                <span>{translate('Settings', lang)}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={{ children: translate('Support', lang), side: 'right' }}
            >
              <Link href="#">
                <HelpCircle />
                <span>{translate('Support', lang)}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
