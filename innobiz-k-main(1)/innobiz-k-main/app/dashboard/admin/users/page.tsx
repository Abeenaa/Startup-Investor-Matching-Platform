'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2, Edit } from 'lucide-react'

const users = [
  { id: 1, name: 'Ahmed Mohamed', email: 'ahmed@startup.et', role: 'Startup', status: 'Active', joinDate: '2024-01-15' },
  { id: 2, name: 'Sarah Williams', email: 'sarah@investor.com', role: 'Investor', status: 'Active', joinDate: '2024-02-01' },
  { id: 3, name: 'John Doe', email: 'john@review.et', role: 'Reviewer', status: 'Active', joinDate: '2024-02-10' },
  { id: 4, name: 'Maria Garcia', email: 'maria@startup.et', role: 'Startup', status: 'Suspended', joinDate: '2024-01-20' },
  { id: 5, name: 'David Chen', email: 'david@investor.com', role: 'Investor', status: 'Active', joinDate: '2024-03-01' },
]

const statusColors: any = {
  'Active': 'bg-green-100 text-green-700',
  'Suspended': 'bg-red-100 text-red-700',
  'Pending': 'bg-yellow-100 text-yellow-700',
}

export default function UsersPage() {
  const router = useRouter()

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Manage Users</h1>
            <p className="text-xs text-muted-foreground">View and manage all system users</p>
          </div>
        </div>
        <Button className="bg-primary text-xs h-9">Add New User</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-xs text-muted-foreground">Name</th>
              <th className="text-left py-3 px-4 font-medium text-xs text-muted-foreground">Email</th>
              <th className="text-left py-3 px-4 font-medium text-xs text-muted-foreground">Role</th>
              <th className="text-left py-3 px-4 font-medium text-xs text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 font-medium text-xs text-muted-foreground">Joined</th>
              <th className="text-left py-3 px-4 font-medium text-xs text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 font-medium text-foreground">{user.name}</td>
                <td className="py-3 px-4 text-muted-foreground text-xs">{user.email}</td>
                <td className="py-3 px-4 text-muted-foreground text-xs">{user.role}</td>
                <td className="py-3 px-4">
                  <Badge className={statusColors[user.status] || 'bg-gray-100 text-gray-700'}>
                    {user.status}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-muted-foreground text-xs">{user.joinDate}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                      <Edit size={14} />
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-red-600 hover:bg-red-50">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
