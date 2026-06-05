'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Sparkles, 
  MessageSquare, 
  Bell, 
  Settings, 
  LogOut,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  userRole?: 'seeker' | 'employer' | 'admin';
}

export default function Sidebar({ userRole = 'seeker' }: SidebarProps) {
  const pathname = usePathname();
  
  const seekerItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/seeker/dashboard' },
    { icon: Briefcase, label: 'Browse Jobs', href: '/seeker/jobs' },
    { icon: FileText, label: 'Applications', href: '/seeker/applications' },
    { icon: Sparkles, label: 'Recommendations', href: '/seeker/recommendations' },
    { icon: BookOpen, label: 'Resume', href: '/seeker/resume' },
    { icon: MessageSquare, label: 'Messages', href: '/seeker/messages' },
    { icon: Bell, label: 'Notifications', href: '/seeker/notifications' },
    { icon: Settings, label: 'Settings', href: '/seeker/settings' },
  ];

  const employerItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/employer/dashboard' },
    { icon: Briefcase, label: 'Post Job', href: '/employer/jobs/new' },
    { icon: FileText, label: 'My Jobs', href: '/employer/jobs' },
    { icon: Sparkles, label: 'Applicants', href: '/employer/applicants' },
    { icon: MessageSquare, label: 'Messages', href: '/employer/messages' },
    { icon: Bell, label: 'Analytics', href: '/employer/analytics' },
    { icon: Settings, label: 'Settings', href: '/employer/settings' },
  ];

  const adminItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Briefcase, label: 'Users', href: '/admin/users' },
    { icon: FileText, label: 'Jobs', href: '/admin/jobs' },
    { icon: Bell, label: 'Reports', href: '/admin/reports' },
    { icon: Sparkles, label: 'Fraud', href: '/admin/fraud' },
    { icon: Settings, label: 'Analytics', href: '/admin/analytics' },
  ];

  const items = userRole === 'employer' ? employerItems : userRole === 'admin' ? adminItems : seekerItems;

  return (
    <aside className="w-60 border-r border-border bg-card h-screen overflow-y-auto fixed left-0 top-0 hidden md:flex flex-col">
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground">LYU</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button variant="outline" size="sm" className="w-full justify-start">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
