export type SystemUserRole = 'ADMIN' | 'OPERATOR' | 'VIEWER';

export interface SystemUser {
  id: string;
  email: string;
  fullName: string;
  role: SystemUserRole;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: SystemUser;
}

export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
export type KycStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address?: string;
  status: ClientStatus;
  kycStatus: KycStatus;
  createdAt: string;
  updatedAt: string;
  _count?: {
    accounts: number;
  };
}

export type AccountType = 'CURRENT' | 'SAVINGS' | 'CREDIT' | 'DEPOSIT';
export type AccountStatus = 'ACTIVE' | 'FROZEN' | 'CLOSED';
export type Currency = 'USD' | 'EUR' | 'RUB' | 'KGS';

export interface Account {
  id: string;
  accountNumber: string;
  clientId: string;
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  type: AccountType;
  status: AccountStatus;
  currency: Currency;
  balance: number;
  creditLimit?: number;
  openedAt: string;
  closedAt?: string;
  updatedAt: string;
}

export type TransactionType = 'DEBIT' | 'CREDIT' | 'TRANSFER' | 'FEE' | 'REVERSAL';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';

export interface Transaction {
  id: string;
  referenceNumber: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: Currency;
  description?: string;
  fromAccountId?: string;
  fromAccount?: {
    id: string;
    accountNumber: string;
    client?: {
      firstName: string;
      lastName: string;
    };
  };
  toAccountId?: string;
  toAccount?: {
    id: string;
    accountNumber: string;
    client?: {
      firstName: string;
      lastName: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalActiveAccounts: number;
  totalBalance: number;
  todayTransactions: number;
  newClientsThisMonth: number;
  blockedAccounts: number;
  recentTransactions: Transaction[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
