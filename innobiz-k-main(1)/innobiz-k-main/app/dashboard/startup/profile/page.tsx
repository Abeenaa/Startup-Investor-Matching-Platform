'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function StartupProfile() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    companyName: 'TechStart Ethiopia',
    foundedYear: '2023',
    sector: 'FinTech',
    teamSize: '5',
    location: 'Addis Ababa',
    description: 'We are building innovative financial solutions for Africa.',
    website: 'https://techstart.et',
    email: 'contact@techstart.et',
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setIsEditing(false)
    localStorage.setItem('startupProfile', JSON.stringify(profile))
  }

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
            <h1 className="text-xl font-semibold text-foreground">Startup Profile</h1>
            <p className="text-xs text-muted-foreground">Manage your company information</p>
          </div>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-medium text-foreground mb-2 block">Company Name</label>
            <Input
              name="companyName"
              value={profile.companyName}
              onChange={handleChange}
              disabled={!isEditing}
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-2 block">Founded Year</label>
            <Input
              name="foundedYear"
              value={profile.foundedYear}
              onChange={handleChange}
              disabled={!isEditing}
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-2 block">Sector</label>
            <Input
              name="sector"
              value={profile.sector}
              onChange={handleChange}
              disabled={!isEditing}
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-2 block">Team Size</label>
            <Input
              name="teamSize"
              value={profile.teamSize}
              onChange={handleChange}
              disabled={!isEditing}
              className="text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-foreground mb-2 block">Location</label>
            <Input
              name="location"
              value={profile.location}
              onChange={handleChange}
              disabled={!isEditing}
              className="text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-foreground mb-2 block">Description</label>
            <textarea
              name="description"
              value={profile.description}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-3 border border-border rounded-md text-sm disabled:bg-muted"
              rows={4}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-2 block">Website</label>
            <Input
              name="website"
              value={profile.website}
              onChange={handleChange}
              disabled={!isEditing}
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-2 block">Email</label>
            <Input
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="text-sm"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 mt-6">
            <Button onClick={handleSave} className="bg-primary text-primary-foreground">
              Save Changes
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="outline">
              Cancel
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
