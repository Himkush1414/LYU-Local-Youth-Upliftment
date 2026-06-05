'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Trash2, Shield } from 'lucide-react';

export default function ContentReviewPage() {
  const [flaggedContent, setFlaggedContent] = useState([
    { id: '1', type: 'Job Post', title: 'Senior Developer', reason: 'Inappropriate language', severity: 'high', status: 'pending' },
    { id: '2', type: 'Profile', title: 'User Profile - ABC123', reason: 'Potentially spam', severity: 'medium', status: 'pending' },
    { id: '3', type: 'Job Post', title: 'Marketing Manager', reason: 'Discriminatory content', severity: 'high', status: 'resolved' },
    { id: '4', type: 'Review', title: 'Company Rating', reason: 'Suspicious activity', severity: 'low', status: 'pending' },
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'resolved' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Content Review</h1>
        <p className="text-muted-foreground">Moderate user-generated content and flagged items</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">12</p>
              <p className="text-sm text-muted-foreground">Pending Reviews</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-destructive">3</p>
              <p className="text-sm text-muted-foreground">High Priority</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">156</p>
              <p className="text-sm text-muted-foreground">Resolved Today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">98%</p>
              <p className="text-sm text-muted-foreground">Accuracy Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flagged Content Table */}
      <Card>
        <CardHeader>
          <CardTitle>Flagged Content</CardTitle>
          <CardDescription>Review and moderate flagged items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Title</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Reason</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Severity</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {flaggedContent.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm">{item.type}</td>
                    <td className="py-3 px-4 text-sm text-foreground font-medium">{item.title}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{item.reason}</td>
                    <td className="py-3 px-4">
                      <Badge className={getSeverityColor(item.severity)}>
                        {item.severity}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Eye className="w-4 h-4" />
                        Review
                      </Button>
                      <Button size="sm" variant="outline">
                        <Shield className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Moderation Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Moderation Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">High Severity</p>
              <p className="text-sm text-muted-foreground">Explicit content, hate speech, harassment - Remove immediately</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Medium Severity</p>
              <p className="text-sm text-muted-foreground">Spam, misleading content, duplicate posts - Review and action</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Low Severity</p>
              <p className="text-sm text-muted-foreground">Minor issues, formatting problems - Monitor and document</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
