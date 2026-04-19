export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `${prefix}${timestamp}${random}`;
}

export function generateUPITxnId(): string {
  return `UPI${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export function generateSolanaAddress(): string {
  return `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

export function formatUSDC(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function truncateAddress(address: string, start: number = 6, end: number = 4): string {
  if (address.length <= start + end) return address;
  return `${address.substring(0, start)}...${address.substring(address.length - end)}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 100) / 100;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUPIId(upiId: string): boolean {
  const upiRegex = /^[a-zA-Z0-9@._-]+@[a-zA-Z]{2,}$/;
  return upiRegex.test(upiId);
}

export function sanitizeString(input: string): string {
  return input.replace(/[<>]/g, '').trim();
}

export function parseError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error occurred';
}

export const TRANSACTION_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  UPI_CONFIRMED: 'UPI Confirmed',
  CONVERTING: 'Converting',
  BLOCKCHAIN_PENDING: 'On Chain',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
};

export const CATEGORY_ICONS: Record<string, string> = {
  FOOD: '🍔',
  TRANSPORT: '🚗',
  SHOPPING: '🛍️',
  BILLS: '📄',
  ENTERTAINMENT: '🎬',
  HEALTHCARE: '🏥',
  EDUCATION: '📚',
  TRAVEL: '✈️',
  SAVINGS: '💰',
  OTHER: '📦',
};

export const BLOCKCHAIN_EXPLORER_URL = 'https://explorer.solana.com';
export const DEFAULT_CONVERSION_FEE = 0.005;
export const DEFAULT_PLATFORM_FEE = 0.01;