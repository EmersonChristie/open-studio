'use client'

import { useState } from 'react'
import { useOrganization, useOrganizationList } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SetupOrganizationPage() {
  const [galleryName, setGalleryName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const { createOrganization } = useOrganizationList()

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!galleryName.trim() || !createOrganization) {
      return
    }

    setIsCreating(true)

    try {
      // Create organization with Clerk
      const organization = await createOrganization({
        name: galleryName.trim(),
      })

      // Redirect to the new gallery dashboard
      router.push(`/${organization.slug}`)
    } catch (error) {
      console.error('Error creating organization:', error)
      // Handle error (you might want to show a toast or error message)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center p-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle>Welcome to Open Studio!</CardTitle>
          <CardDescription>
            Let's set up your first art gallery to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateGallery} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='gallery-name'>Gallery Name</Label>
              <Input
                id='gallery-name'
                type='text'
                placeholder='Enter your gallery name'
                value={galleryName}
                onChange={(e) => setGalleryName(e.target.value)}
                required
              />
            </div>

            <Button
              type='submit'
              className='w-full'
              disabled={isCreating || !galleryName.trim()}
            >
              {isCreating ? 'Creating Gallery...' : 'Create Gallery'}
            </Button>
          </form>

          <div className='mt-6 text-center text-sm text-muted-foreground'>
            <p>
              You can always create additional galleries later from your
              dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
