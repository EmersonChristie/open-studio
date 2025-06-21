import { z } from 'zod'

// Only allow 'admin' and 'member' roles
export const userRoleEnum = z.enum(['admin', 'member'])

export const userSchema = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  name: z.string().optional(),
  avatarUrl: z.string().optional(),
  profileImageUrl: z.string().optional(),
  role: userRoleEnum,
  isActive: z.boolean().default(true),
  lastLoginAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export const userListSchema = z.array(userSchema)

export const userFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email(),
  role: userRoleEnum,
})

export type User = z.infer<typeof userSchema>
export type UserFormValues = z.infer<typeof userFormSchema>
export type UserRole = z.infer<typeof userRoleEnum>
