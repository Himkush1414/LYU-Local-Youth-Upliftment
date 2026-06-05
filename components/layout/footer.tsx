'use client';

import Link from 'next/link';
import { Briefcase, Mail, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">LYU</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering Indian youth through job opportunities and skill development.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">For Job Seekers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/seeker/jobs" className="text-muted-foreground hover:text-foreground transition-colors">Browse Jobs</Link></li>
              <li><Link href="/seeker/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link href="/seeker/applications" className="text-muted-foreground hover:text-foreground transition-colors">Applications</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">For Employers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/employer/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link href="/employer/jobs/new" className="text-muted-foreground hover:text-foreground transition-colors">Post a Job</Link></li>
              <li><Link href="/employer/applicants" className="text-muted-foreground hover:text-foreground transition-colors">Applicants</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; {currentYear} Local Youth Upliftment. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="#terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
