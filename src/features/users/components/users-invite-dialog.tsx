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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { userFormSchema, userRoleEnum } from '../data/schema'

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

export function UsersInviteDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const params = useParams()

  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: '',
      role: 'user',
    },
  })

  async function onSubmit(data: any) {
    try {
      const response = await fetch(`/api/${params.tenant}/users/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to invite user')
      }

      toast({
        title: 'Success',
        description: 'Invitation sent successfully.',
      })

      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error inviting user:', error)
      toast({
        title: 'Error',
        description: 'Failed to send invitation. Please try again.',
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
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Send an invitation to join your organization. The user will receive
            an email with instructions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='invite-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='john@example.com'
                      type='email'
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
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
                  <FormMessage />
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
              <Button type='submit'>Send Invitation</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
