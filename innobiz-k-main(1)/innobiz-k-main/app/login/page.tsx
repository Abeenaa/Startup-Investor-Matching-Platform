'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

type UserRole = 'startup' | 'investor' | 'reviewer' | 'admin'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('startup')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate login - in production, this would call an API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Store user session in localStorage
      localStorage.setItem('user', JSON.stringify({
        email,
        role,
        loggedInAt: new Date().toISOString()
      }))

      // Redirect to appropriate dashboard
      router.push(`/dashboard/${role}`)
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image src="/logo.svg" alt="Innobiz-K" width={31} height={18} className="h-8 w-auto mx-auto" loading="eager" />
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-6 border border-border">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9 text-sm"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-9 text-sm"
              />
            </div>

            {/* User Role */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-xs font-medium">
                Login As
              </Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full h-9 px-3 text-sm border border-input rounded-md bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="startup">Startup</option>
                <option value="investor">Investor</option>
                <option value="reviewer">Reviewer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-9 text-sm bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>


        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up here
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link href="/" className="text-xs text-primary hover:underline font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
