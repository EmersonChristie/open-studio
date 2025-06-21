'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconUser, IconUserCog, IconUserShield } from '@tabler/icons-react'
import { useParams } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { User, userFormSchema, userRoleEnum } from '../data/schema'

interface Props {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

const roleOptions = [
  {
    value: 'admin',
    label: 'Admin',
    icon: IconUserCog,
    description: 'Elevated permissions in the organization',
  },
  {
    value: 'member',
    label: 'Member',
    icon: IconUser,
    description: 'Non-privileged permissions in the organization',
  },
]

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const params = useParams()
  const isEdit = !!currentRow

  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: currentRow?.firstName || '',
      lastName: currentRow?.lastName || '',
      email: currentRow?.email || '',
      role: currentRow?.role || 'user',
    },
  })

  async function onSubmit(data: any) {
    try {
      const response = await fetch(`/api/${params.tenant}/users`, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userId: currentRow?.clerkId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save user')
      }

      toast({
        title: 'Success',
        description: `User ${isEdit ? 'updated' : 'created'} successfully.`,
      })

      onOpenChange(false)
    } catch (error) {
      console.error('Error saving user:', error)
      toast({
        title: 'Error',
        description: 'Failed to save user. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the user here. ' : 'Create new user here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='-mr-4 h-[26.25rem] w-full py-1 pr-4'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Doe'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john@example.com'
                        className='col-span-4'
                        type='email'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      Role
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='col-span-4'>
                          <SelectValue placeholder='Select a role' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem
                            key={role.value}
                            value={role.value}
                            className='flex items-center gap-2'
                          >
                            <div className='flex items-center gap-2'>
                              <role.icon size={16} />
                              <div>
                                <div>{role.label}</div>
                                <div className='text-xs text-muted-foreground'>
                                  {role.description}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <div className='flex justify-end gap-2 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type='submit'>Save</Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
