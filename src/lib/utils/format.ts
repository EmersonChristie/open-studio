/**
 * Formats a date to a human-readable string
 * @param date The date to format
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', options).format(d)
}

/**
 * Formats a number to a currency string
 * @param amount The amount to format
 * @param currency The currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Formats a number to a percentage string
 * @param value The value to format
 * @param decimals Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100)
}

/**
 * Formats a number to a human-readable string with appropriate units
 * @param bytes The number of bytes
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted string with units
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/**
 * Formats a number to a human-readable string with appropriate units
 * @param number The number to format
 * @param decimals Number of decimal places (default: 1)
 * @returns Formatted string with units
 */
export function formatNumber(number: number, decimals: number = 1): string {
  if (number < 1000) return number.toString()

  const units = ['', 'K', 'M', 'B', 'T']
  const k = 1000
  const magnitude = Math.floor(Math.log(number) / Math.log(k))

  return `${(number / Math.pow(k, magnitude)).toFixed(decimals)}${units[magnitude]}`
}
