'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 p-2">
          <AppLogo className="size-8 text-primary" />
          <span className="text-lg font-bold">Hercules AI</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.tooltip, side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span className='whitespace-normal'>{item.label}</span>
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
              tooltip={{ children: 'Settings', side: 'right' }}
            >
              <Link href="#">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={{ children: 'Support', side: 'right' }}
            >
              <Link href="#">
                <HelpCircle />
                <span>Support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
