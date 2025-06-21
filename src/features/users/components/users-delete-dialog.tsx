'use client'

import { useParams } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { User } from '../data/schema'

interface Props {
  currentRow: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersDeleteDialog({ currentRow, open, onOpenChange }: Props) {
  const params = useParams()

  async function onDelete() {
    try {
      const response = await fetch(`/api/${params.tenant}/users`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentRow.clerkId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to remove user')
      }

      toast({
        title: 'Success',
        description: 'User removed successfully.',
      })

      onOpenChange(false)
    } catch (error) {
      console.error('Error removing user:', error)
      toast({
        title: 'Error',
        description: 'Failed to remove user. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove User</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove{' '}
            {currentRow.name || currentRow.email}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={onDelete}>
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
