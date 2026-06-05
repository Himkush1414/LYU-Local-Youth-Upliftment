'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PostJob() {
  return (
    <div className="p-6 max-w-3xl">
      <Link href="/employer/dashboard">
        <Button variant="ghost" size="sm" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </Link>

      <Card className="p-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Post a New Job</h1>

        <form className="space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Job Title</label>
            <Input placeholder="e.g., Senior React Developer" className="w-full" />
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Job Description</label>
            <Textarea
              placeholder="Describe the role, responsibilities, and requirements..."
              className="w-full min-h-40"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Location</label>
              <Input placeholder="e.g., Bangalore, India" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Job Type</label>
              <select className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground">
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Remote</option>
              </select>
            </div>
          </div>

          {/* Salary */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Salary Range (Min)</label>
              <Input placeholder="e.g., ₹8,00,000" type="text" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Salary Range (Max)</label>
              <Input placeholder="e.g., ₹12,00,000" type="text" />
            </div>
          </div>

          {/* Experience Required */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Experience Required</label>
            <Input placeholder="e.g., 3-5 years" />
          </div>

          {/* Required Skills */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Required Skills</label>
            <Input placeholder="e.g., React, TypeScript, Node.js (comma separated)" />
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Benefits & Perks</label>
            <Textarea
              placeholder="Health insurance, Remote work, Learning budget, etc."
              className="w-full min-h-28"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button className="bg-primary flex-1" size="lg">
              Post Job
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              Save as Draft
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
