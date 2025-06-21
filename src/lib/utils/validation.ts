import { z } from 'zod'

/**
 * Validates a string is a valid URL
 */
export const urlSchema = z.string().url('Please enter a valid URL')

/**
 * Validates a string is a valid email
 */
export const emailSchema = z.string().email('Please enter a valid email')

/**
 * Validates a string is a valid phone number
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')

/**
 * Validates a string is a valid slug
 */
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Please enter a valid slug')

/**
 * Validates a string is a valid organization name
 */
export const organizationNameSchema = z
  .string()
  .min(2, 'Organization name must be at least 2 characters')
  .max(50, 'Organization name must be less than 50 characters')
  .regex(
    /^[a-zA-Z0-9\s-]+$/,
    'Organization name can only contain letters, numbers, spaces, and hyphens'
  )

/**
 * Validates a string is a valid password
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
