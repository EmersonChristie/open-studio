'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersTable } from './components/users-table'
import UsersProvider from './context/users-context'
import { User } from './data/schema'

export default function Users() {
  const params = useParams()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`/api/${params.tenant}/users`)
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error('Error fetching users:', error)
        toast({
          title: 'Error',
          description: 'Failed to load users. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [params.tenant])

  return (
    <UsersProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {isLoading ? (
            <div className='flex h-[400px] items-center justify-center'>
              <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
            </div>
          ) : (
            <UsersTable data={users} columns={columns} />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
