'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/layout/sidebar';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole="admin" />
      
      <div className="flex-1 md:ml-60 flex flex-col">
        {/* Top Header */}
        <header className="border-b border-border bg-card h-16 flex items-center justify-between px-6">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">Admin Dashboard</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </Button>
            
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
