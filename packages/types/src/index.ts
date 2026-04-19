export enum Role {
  USER = 'USER',
  MERCHANT = 'MERCHANT',
  ADMIN = 'ADMIN',
}

export enum KycStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum TxStatus {
  PENDING = 'PENDING',
  UPI_CONFIRMED = 'UPI_CONFIRMED',
  CONVERTING = 'CONVERTING',
  BLOCKCHAIN_PENDING = 'BLOCKCHAIN_PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum InsightType {
  SPENDING_ALERT = 'SPENDING_ALERT',
  SAVINGS_SUGGESTION = 'SAVINGS_SUGGESTION',
  INVESTMENT_TIP = 'INVESTMENT_TIP',
  BUDGET_WARNING = 'BUDGET_WARNING',
  SUBSCRIPTION_ALERT = 'SUBSCRIPTION_ALERT',
}

export enum Frequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  role: Role;
  solanaAddress?: string;
  upiId?: string;
  kycStatus: KycStatus;
  kycData?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Merchant {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  solanaAddress: string;
  apiKey: string;
  webhookUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  merchantId: string;
  amountINR: number;
  amountUSDC: number;
  conversionRate: number;
  upiTxnId?: string;
  upiStatus?: string;
  solanaTxHash?: string;
  solanaStatus?: string;
  status: TxStatus;
  category?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AiInsight {
  id: string;
  userId: string;
  type: InsightType;
  title: string;
  description: string;
  data: Record<string, unknown>;
  actionTaken: boolean;
  actionData?: Record<string, unknown>;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  amount: number;
  frequency: Frequency;
  nextDueDate: Date;
  isActive: boolean;
  autoPayEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentInput {
  amount: number;
  merchantId: string;
  description?: string;
}

export interface PaymentResponse {
  id: string;
  upiQR?: string;
  upiDeepLink?: string;
  status: TxStatus;
  amountINR: number;
  amountUSDC: number;
  conversionRate: number;
}

export interface PriceConversion {
  inrAmount: number;
  usdcAmount: number;
  rate: number;
  timestamp: Date;
}

export interface UPIQRCode {
  qrString: string;
  deepLink: string;
  upiId: string;
  amount: number;
  referenceId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}