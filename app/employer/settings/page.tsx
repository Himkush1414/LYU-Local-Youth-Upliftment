'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Settings, Bell, Lock, User, LogOut } from 'lucide-react';

export default function EmployerSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Settings
          </CardTitle>
          <CardDescription>Update your company information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Company Name</label>
              <Input defaultValue="TechCorp Solutions" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Contact Email</label>
              <Input defaultValue="hr@techcorp.com" type="email" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Phone</label>
              <Input defaultValue="+91 98765 43210" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Website</label>
              <Input defaultValue="www.techcorp.com" className="mt-1" />
            </div>
          </div>
          <Button className="w-full md:w-auto">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>Control how you receive updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Email Notifications</label>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">New Applications</label>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Interview Reminders</label>
            <input type="checkbox" className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security
          </CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full md:w-auto">Change Password</Button>
          <div className="pt-4 border-t border-border">
            <p className="text-sm font-medium text-foreground mb-2">Two-Factor Authentication</p>
            <p className="text-sm text-muted-foreground mb-3">Add an extra layer of security to your account</p>
            <Button variant="outline">Enable 2FA</Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="destructive" className="w-full md:w-auto">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
