import { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'

/**
 * Handles API errors and displays appropriate toast messages
 * @param error The error to handle
 * @param defaultMessage The default message to show if no specific error message is found
 */
export function handleApiError(
  error: unknown,
  defaultMessage: string = 'An error occurred'
) {
  console.error('API Error:', error)

  if (error instanceof AxiosError) {
    const message =
      error.response?.data?.message || error.message || defaultMessage
    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
    })
    return
  }

  if (error instanceof Error) {
    toast({
      title: 'Error',
      description: error.message || defaultMessage,
      variant: 'destructive',
    })
    return
  }

  toast({
    title: 'Error',
    description: defaultMessage,
    variant: 'destructive',
  })
}

/**
 * Creates a standardized API response
 * @param data The data to include in the response
 * @param message Optional success message
 * @returns Standardized API response object
 */
export function createApiResponse<T>(data: T, message?: string) {
  return {
    success: true,
    data,
    message,
  }
}

/**
 * Creates a standardized API error response
 * @param message Error message
 * @param code Optional error code
 * @returns Standardized API error response object
 */
export function createApiError(message: string, code?: string) {
  return {
    success: false,
    error: {
      message,
      code,
    },
  }
}

/**
 * Validates an API response
 * @param response The response to validate
 * @returns True if the response is valid
 */
export function isValidApiResponse(
  response: unknown
): response is { success: boolean; data: unknown } {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    'data' in response
  )
}
