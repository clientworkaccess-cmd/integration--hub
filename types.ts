
export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  status: 'active' | 'pending' | 'disconnected';
}

export interface WebhookPayload {
  code: string;
  clientId: string;
  clientSecret: string;
  email: string;
  timestamp: string;
}

export interface AppState {
  isConnecting: boolean;
  error: string | null;
  success: boolean;
  email: string;
}
