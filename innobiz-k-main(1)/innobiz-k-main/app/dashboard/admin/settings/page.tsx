'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Settings, Bell, Lock, Users, Database, Shield } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">System Settings</h1>
        <p className="text-xs text-muted-foreground mt-1">Manage platform configuration and preferences</p>
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-primary/10 rounded">
            <Settings className="text-primary" size={20} />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-foreground">General Settings</h2>
            <p className="text-xs text-muted-foreground mt-1">Configure basic platform settings</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Platform Name</p>
              <p className="text-xs text-muted-foreground mt-1">Innobiz-K</p>
            </div>
            <Button variant="outline" className="text-xs h-8">Edit</Button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Support Email</p>
              <p className="text-xs text-muted-foreground mt-1">support@innobiz-k.com</p>
            </div>
            <Button variant="outline" className="text-xs h-8">Edit</Button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Time Zone</p>
              <p className="text-xs text-muted-foreground mt-1">East Africa Time (EAT)</p>
            </div>
            <Button variant="outline" className="text-xs h-8">Edit</Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-secondary/10 rounded">
            <Bell className="text-secondary" size={20} />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
            <p className="text-xs text-muted-foreground mt-1">Configure system notifications and alerts</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Email Notifications</p>
              <p className="text-xs text-muted-foreground mt-1">Send alerts for new applications</p>
            </div>
            <Badge className="bg-green-50 text-green-700 border-green-200 border text-xs">Enabled</Badge>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Review Reminders</p>
              <p className="text-xs text-muted-foreground mt-1">Remind reviewers of pending evaluations</p>
            </div>
            <Badge className="bg-green-50 text-green-700 border-green-200 border text-xs">Enabled</Badge>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-foreground">SMS Alerts</p>
              <p className="text-xs text-muted-foreground mt-1">Send critical alerts via SMS</p>
            </div>
            <Badge className="bg-gray-50 text-gray-700 border-gray-200 border text-xs">Disabled</Badge>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-accent/10 rounded">
            <Lock className="text-accent" size={20} />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-foreground">Security</h2>
            <p className="text-xs text-muted-foreground mt-1">Manage security settings and access control</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground mt-1">Require 2FA for admin accounts</p>
            </div>
            <Badge className="bg-green-50 text-green-700 border-green-200 border text-xs">Enabled</Badge>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Session Timeout</p>
              <p className="text-xs text-muted-foreground mt-1">30 minutes of inactivity</p>
            </div>
            <Button variant="outline" className="text-xs h-8">Configure</Button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-foreground">IP Whitelist</p>
              <p className="text-xs text-muted-foreground mt-1">Restrict admin access to specific IPs</p>
            </div>
            <Button variant="outline" className="text-xs h-8">Configure</Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-primary/10 rounded">
            <Database className="text-primary" size={20} />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-foreground">Data & Backups</h2>
            <p className="text-xs text-muted-foreground mt-1">Manage system data and backups</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Last Backup</p>
              <p className="text-xs text-muted-foreground mt-1">March 27, 2024 at 2:30 AM</p>
            </div>
            <Badge className="bg-green-50 text-green-700 border-green-200 border text-xs">Success</Badge>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Backup Frequency</p>
              <p className="text-xs text-muted-foreground mt-1">Daily at 2:00 AM</p>
            </div>
            <Button variant="outline" className="text-xs h-8">Configure</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
