'use client'

import { useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { format } from 'date-fns'
import {
  IconArrowLeft,
  IconDotsVertical,
  IconEdit,
  IconMessages,
  IconPaperclip,
  IconPhone,
  IconPhotoPlus,
  IconPlus,
  IconSearch,
  IconSend,
  IconVideo,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { NewChat } from './components/new-chat'
import { type ChatUser, type Convo } from './data/chat-types'
// Fake Data
import chatData from './data/convo.json'

export default function Chats() {
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [mobileSelectedUser, setMobileSelectedUser] = useState<ChatUser | null>(
    null
  )
  const [createConversationDialogOpened, setCreateConversationDialog] =
    useState(false)

  // Get conversations from imported data
  const { conversations } = chatData

  // Filtered data based on the search query
  const filteredChatList = conversations.filter(({ fullName }) =>
    fullName.toLowerCase().includes(search.trim().toLowerCase())
  )

  const currentMessage = selectedUser?.messages.reduce(
    (acc: Record<string, Convo[]>, obj) => {
      const key = format(obj.timestamp, 'd MMM, yyyy')

      // Create an array for the category if it doesn't exist
      if (!acc[key]) {
        acc[key] = []
      }

      // Push the current object to the array
      acc[key].push(obj)

      return acc
    },
    {}
  )

  const users = conversations.map(({ messages, ...user }) => user)

  // Handle sending a new message (prevents form submission freezing)
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the message
    console.log('Message sent')
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      {/* <Header fixed>
          <Search />
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header> */}

      <Header
        fixed
        className='flex h-16 items-center gap-3 bg-background p-4 shadow-none sm:gap-4'
      >
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* <Main className='flex h-[calc(100vh-64px)] flex-col px-4 pb-4 pt-0'> */}
      <Main className='fixed-main flex flex-grow flex-col overflow-hidden px-4 py-6 peer-[.header-fixed]/header:mt-16'>
        <div className='flex h-full w-full'>
          {/* Left Side - Inbox */}
          <div className='flex h-full w-[320px] flex-none flex-col border-r border-border bg-background dark:bg-background'>
            <div className='flex h-full flex-col'>
              <div className='flex flex-col py-3 pr-4'>
                <div className='flex items-center justify-between pb-2'>
                  <div className='flex items-center gap-2'>
                    <h1 className='text-2xl font-bold'>Inbox</h1>
                    <IconMessages size={20} className='mt-1' />
                  </div>

                  <Button
                    size='icon'
                    variant='ghost'
                    onClick={() => setCreateConversationDialog(true)}
                    className='rounded-lg'
                  >
                    <IconEdit size={20} className='stroke-muted-foreground' />
                  </Button>
                </div>

                <div className='flex h-10 w-full items-center rounded-md border border-input bg-background pl-2 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring dark:bg-muted/50'>
                  <IconSearch
                    size={15}
                    className='mr-2 stroke-muted-foreground'
                  />
                  <input
                    type='text'
                    className='w-full flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus-visible:outline-none'
                    placeholder='Search chat...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <ScrollArea className='flex-1 pr-4'>
                {filteredChatList.map((chatUsr) => {
                  const { id, profile, username, messages, fullName } = chatUsr
                  const lastConvo = messages[0]
                  const lastMsg =
                    lastConvo.sender === 'You'
                      ? `You: ${lastConvo.message}`
                      : lastConvo.message
                  return (
                    <div key={id} className='py-1'>
                      <button
                        type='button'
                        className={cn(
                          'flex w-full rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-muted/50',
                          selectedUser?.id === id && 'bg-muted/70'
                        )}
                        onClick={() => {
                          setSelectedUser(chatUsr)
                          setMobileSelectedUser(chatUsr)
                        }}
                      >
                        <div className='flex gap-2'>
                          <Avatar>
                            <AvatarImage src={profile} alt={username} />
                            <AvatarFallback>{username}</AvatarFallback>
                          </Avatar>
                          <div className='flex flex-col'>
                            <span className='line-clamp-1 font-medium'>
                              {fullName}
                            </span>
                            <span className='line-clamp-1 text-xs text-muted-foreground'>
                              {lastMsg}
                            </span>
                          </div>
                        </div>
                      </button>
                      <Separator className='my-1' />
                    </div>
                  )
                })}
              </ScrollArea>
            </div>
          </div>

          {/* Right Side - Chat */}
          <div className='relative flex h-full flex-1 bg-slate-50 dark:bg-slate-950/70'>
            {selectedUser ? (
              <div className='flex h-full w-full flex-col'>
                {/* Top Part */}
                <div className='flex flex-none justify-between border-b border-border bg-background p-3 dark:bg-background'>
                  {/* Left */}
                  <div className='flex gap-3'>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='md:hidden'
                      onClick={() => setMobileSelectedUser(null)}
                    >
                      <IconArrowLeft />
                    </Button>
                    <div className='flex items-center gap-3'>
                      <Avatar>
                        <AvatarImage
                          src={selectedUser.profile}
                          alt={selectedUser.username}
                        />
                        <AvatarFallback>{selectedUser.username}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className='block text-sm font-medium'>
                          {selectedUser.fullName}
                        </span>
                        <span className='block text-xs text-muted-foreground'>
                          {selectedUser.title || 'Online'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className='flex items-center gap-2'>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='hidden md:inline-flex'
                    >
                      <IconVideo
                        size={18}
                        className='stroke-muted-foreground'
                      />
                    </Button>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='hidden md:inline-flex'
                    >
                      <IconPhone
                        size={18}
                        className='stroke-muted-foreground'
                      />
                    </Button>
                    <Button size='icon' variant='ghost'>
                      <IconDotsVertical
                        size={18}
                        className='stroke-muted-foreground'
                      />
                    </Button>
                  </div>
                </div>

                {/* Conversation */}
                <div className='flex flex-1 flex-col overflow-hidden px-4'>
                  <ScrollArea className='flex-1 py-4'>
                    <div className='flex min-h-full flex-col justify-end'>
                      {currentMessage &&
                        Object.keys(currentMessage).map((key) => (
                          <Fragment key={key}>
                            <div className='py-2 text-center text-xs text-muted-foreground'>
                              {key}
                            </div>
                            {currentMessage[key].map((msg, index) => (
                              <div
                                key={`${msg.sender}-${msg.timestamp}-${index}`}
                                className={cn(
                                  'mb-4 max-w-[75%] px-4 py-2 shadow-sm',
                                  msg.sender === 'You'
                                    ? 'ml-auto rounded-2xl rounded-br-none bg-primary text-primary-foreground'
                                    : 'mr-auto rounded-2xl rounded-bl-none bg-muted dark:bg-slate-800'
                                )}
                              >
                                <div>{msg.message}</div>
                                <div
                                  className={cn(
                                    'mt-1 text-xs',
                                    msg.sender === 'You'
                                      ? 'text-right text-primary-foreground/75'
                                      : 'text-muted-foreground'
                                  )}
                                >
                                  {format(msg.timestamp, 'h:mm a')}
                                </div>
                              </div>
                            ))}
                          </Fragment>
                        ))}
                    </div>
                  </ScrollArea>
                  <div className='py-3'>
                    <form
                      className='flex flex-none gap-2'
                      onSubmit={handleSendMessage}
                    >
                      <div className='flex flex-1 items-center gap-2 rounded-md border border-input bg-background px-3 py-2 focus-within:ring-1 focus-within:ring-ring dark:bg-muted/20'>
                        <div className='flex space-x-1'>
                          <Button
                            size='icon'
                            type='button'
                            variant='ghost'
                            className='h-8 w-8'
                          >
                            <IconPlus
                              size={18}
                              className='stroke-muted-foreground'
                            />
                          </Button>
                          <Button
                            size='icon'
                            type='button'
                            variant='ghost'
                            className='hidden h-8 w-8 md:inline-flex'
                          >
                            <IconPhotoPlus
                              size={18}
                              className='stroke-muted-foreground'
                            />
                          </Button>
                          <Button
                            size='icon'
                            type='button'
                            variant='ghost'
                            className='hidden h-8 w-8 md:inline-flex'
                          >
                            <IconPaperclip
                              size={18}
                              className='stroke-muted-foreground'
                            />
                          </Button>
                        </div>
                        <input
                          type='text'
                          placeholder='Type your messages...'
                          className='h-8 flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus-visible:outline-none'
                        />
                        <Button
                          variant='ghost'
                          size='icon'
                          type='submit'
                          className='hidden h-8 w-8 md:inline-flex'
                        >
                          <IconSend size={18} />
                        </Button>
                      </div>
                      <Button className='md:hidden' type='submit'>
                        <IconSend size={16} className='mr-2' /> Send
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              <div className='flex h-full w-full items-center justify-center'>
                <div className='flex flex-col items-center space-y-6 text-center'>
                  <div className='flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/20'>
                    <IconMessages className='h-8 w-8 text-muted-foreground' />
                  </div>
                  <div className='space-y-2'>
                    <h1 className='text-xl font-semibold'>Your messages</h1>
                    <p className='text-sm text-muted-foreground'>
                      Send a message to start a chat.
                    </p>
                  </div>
                  <Button onClick={() => setCreateConversationDialog(true)}>
                    Send message
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <NewChat
          users={users}
          onOpenChange={setCreateConversationDialog}
          open={createConversationDialogOpened}
        />
      </Main>
    </>
  )
}
