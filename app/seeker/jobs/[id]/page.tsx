'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Star,
  Share2,
  Heart,
  Users,
  Building
} from 'lucide-react';
import Link from 'next/link';

export default function JobDetail({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <Link href="/seeker/jobs">
        <Button variant="ghost" size="sm" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>
      </Link>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Job Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <Card className="p-6 border border-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Senior React Developer</h1>
                <p className="text-lg text-muted-foreground">TechCorp India</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Share2 className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Salary</p>
                <p className="font-semibold text-foreground">₹8-12 LPA</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="font-semibold text-foreground">Bangalore</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Job Type</p>
                <p className="font-semibold text-foreground">Full-time</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Experience</p>
                <p className="font-semibold text-foreground">3-5 years</p>
              </div>
            </div>
          </Card>

          {/* Match Score */}
          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Your Match Score</p>
                <p className="text-4xl font-bold text-primary">95%</p>
                <p className="text-sm text-accent mt-2">Excellent match with your profile!</p>
              </div>
              <div className="w-24 h-24 rounded-full flex items-center justify-center bg-primary/10">
                <Star className="w-12 h-12 fill-primary text-primary" />
              </div>
            </div>
          </Card>

          {/* About the Role */}
          <Card className="p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">About the Role</h2>
            <p className="text-foreground leading-relaxed mb-4">
              We&apos;re looking for an experienced React Developer to join our growing team. You&apos;ll be working on modern web applications using the latest technologies and best practices. This is an excellent opportunity to grow your skills and make an impact.
            </p>
            <h3 className="font-semibold text-foreground mb-3">Responsibilities:</h3>
            <ul className="list-disc list-inside space-y-2 text-foreground mb-4">
              <li>Build scalable and performant React applications</li>
              <li>Collaborate with designers and backend engineers</li>
              <li>Implement responsive UI/UX designs</li>
              <li>Maintain code quality and write comprehensive tests</li>
              <li>Participate in code reviews and provide constructive feedback</li>
            </ul>
          </Card>

          {/* Requirements */}
          <Card className="p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Requirements</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">✓</span>
                <span className="text-foreground">3-5 years of professional React development experience</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">✓</span>
                <span className="text-foreground">Strong JavaScript/TypeScript skills</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">✓</span>
                <span className="text-foreground">Experience with Redux or Context API</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">✓</span>
                <span className="text-foreground">Familiarity with Node.js and REST APIs</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">✓</span>
                <span className="text-foreground">Git proficiency and understanding of CI/CD</span>
              </li>
            </ul>
          </Card>

          {/* Nice to Have */}
          <Card className="p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Nice to Have</h2>
            <div className="flex flex-wrap gap-2">
              {['AWS', 'Docker', 'GraphQL', 'Testing Libraries', 'Agile/Scrum'].map((skill, idx) => (
                <Badge key={idx} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Apply Card */}
          <Card className="p-6 border border-border sticky top-6">
            <Button className="w-full mb-3 bg-primary text-base h-auto py-3">
              Apply Now
            </Button>
            <Button variant="outline" className="w-full">
              Save Job
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-4">
              ✨ You match 95% of the job requirements
            </p>
          </Card>

          {/* Company Info */}
          <Card className="p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">TechCorp India</h3>
                <p className="text-sm text-muted-foreground">250+ employees</p>
              </div>
            </div>
            <Button variant="outline" className="w-full text-sm">
              Visit Company
            </Button>
          </Card>

          {/* Similar Jobs */}
          <Card className="p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-4">Similar Jobs</h3>
            <div className="space-y-3">
              {['Full Stack Engineer', 'Frontend Developer', 'Backend Developer'].map((job, idx) => (
                <Button key={idx} variant="outline" className="w-full justify-start text-left h-auto py-2">
                  <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{job}</span>
                </Button>
              ))}
            </div>
          </Card>

          {/* Stats */}
          <Card className="p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-4">Job Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Applications</span>
                </div>
                <span className="font-semibold text-foreground">342</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Posted</span>
                </div>
                <span className="font-semibold text-foreground">2 days ago</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
