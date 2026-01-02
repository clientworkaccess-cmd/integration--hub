
import { WEBHOOK_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../constants.tsx';
import { WebhookPayload } from '../types.ts';

export const triggerWebhook = async (code: string, email: string): Promise<boolean> => {
  const payload: WebhookPayload = {
    code,
    clientId: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    email,
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Webhook failed with status:', response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error triggering webhook:', error);
    return false;
  }
};
