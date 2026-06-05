'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, MoreVertical, Ban, CheckCircle, Eye } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'seeker' | 'employer' | 'admin';
  status: 'Active' | 'Suspended' | 'Pending';
  joinDate: string;
  applications: number;
}

const USERS: User[] = [
  { id: '1', name: 'Arjun Singh', email: 'arjun@example.com', role: 'seeker', status: 'Active', joinDate: 'Jan 10, 2024', applications: 12 },
  { id: '2', name: 'TechCorp HR', email: 'hr@techcorp.com', role: 'employer', status: 'Active', joinDate: 'Jan 5, 2024', applications: 0 },
  { id: '3', name: 'Priya Sharma', email: 'priya@example.com', role: 'seeker', status: 'Suspended', joinDate: 'Jan 1, 2024', applications: 8 },
  { id: '4', name: 'StartupHub', email: 'hiring@startuphub.com', role: 'employer', status: 'Active', joinDate: 'Dec 28, 2023', applications: 0 },
  { id: '5', name: 'Rahul Kumar', email: 'rahul@example.com', role: 'seeker', status: 'Pending', joinDate: 'Today', applications: 0 },
];

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'bg-destructive/20 text-destructive';
    case 'employer':
      return 'bg-primary/20 text-primary';
    default:
      return 'bg-secondary/20 text-secondary-foreground';
  }
};

export default function UserManagement() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <Button className="bg-primary">Add User</Button>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="Search by name, email, or ID..." className="pl-10" />
          </div>
          <select className="px-3 py-2 border border-border rounded-md bg-card text-foreground">
            <option>All Roles</option>
            <option>Seekers</option>
            <option>Employers</option>
            <option>Admins</option>
          </select>
          <select className="px-3 py-2 border border-border rounded-md bg-card text-foreground">
            <option>All Status</option>
            <option>Active</option>
            <option>Suspended</option>
            <option>Pending</option>
          </select>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">User</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Role</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Join Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Activity</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map((user, idx) => (
                <tr key={user.id} className={`border-b border-border hover:bg-muted/5 transition ${idx === USERS.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={getRoleColor(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        user.status === 'Active'
                          ? 'default'
                          : user.status === 'Suspended'
                          ? 'destructive'
                          : 'outline'
                      }
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground">{user.joinDate}</td>
                  <td className="py-3 px-4 text-sm text-foreground">
                    {user.applications > 0
                      ? `${user.applications} applications`
                      : 'No activity'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {user.status === 'Active' ? (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                          <Ban className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-accent hover:bg-accent/10">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing 5 of 12,450 users
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm">1</Button>
            <Button className="bg-primary" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
