import { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'

/**
 * Handles server errors and displays appropriate toast messages
 * @param error The error to handle
 * @param defaultMessage The default message to show if no specific error message is found
 */
export function handleServerError(
  error: unknown,
  defaultMessage: string = 'Something went wrong!'
) {
  console.error('Server Error:', error)

  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    Number(error.status) === 204
  ) {
    toast({
      title: 'Error',
      description: 'Content not found.',
      variant: 'destructive',
    })
    return
  }

  if (error instanceof AxiosError) {
    const message =
      error.response?.data?.title || error.message || defaultMessage
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
