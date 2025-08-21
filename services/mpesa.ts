import { 
  MpesaPaymentRequest, 
  MpesaSTKPushRequest, 
  MpesaSTKPushResponse, 
  MpesaCallback,
  ApiResponse 
} from '@/types';

// M-Pesa API configuration
const MPESA_CONFIG = {
  consumerKey: process.env.MPESA_CONSUMER_KEY!,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
  passkey: process.env.MPESA_PASSKEY!,
  businessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE!,
  environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
  baseUrl: process.env.MPESA_ENVIRONMENT === 'production' 
    ? 'https://api.safaricom.co.ke' 
    : 'https://sandbox.safaricom.co.ke',
};

// Generate M-Pesa API password
const generatePassword = (): string => {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const password = Buffer.from(
    `${MPESA_CONFIG.businessShortCode}${MPESA_CONFIG.passkey}${timestamp}`
  ).toString('base64');
  return password;
};

// Get M-Pesa access token
const getAccessToken = async (): Promise<string> => {
  try {
    const auth = Buffer.from(`${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`).toString('base64');
    
    const response = await fetch(`${MPESA_CONFIG.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting M-Pesa access token:', error);
    throw new Error('Failed to authenticate with M-Pesa API');
  }
};

// Initiate STK Push payment
export const initiateSTKPush = async (
  request: MpesaPaymentRequest
): Promise<ApiResponse<MpesaSTKPushResponse>> => {
  try {
    const accessToken = await getAccessToken();
    const password = generatePassword();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);

    const stkPushRequest: MpesaSTKPushRequest = {
      BusinessShortCode: MPESA_CONFIG.businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(request.amount), // M-Pesa expects integer amount
      PartyA: request.phone,
      PartyB: MPESA_CONFIG.businessShortCode,
      PhoneNumber: request.phone,
      CallBackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/mpesa/callback`,
      AccountReference: request.reference,
      TransactionDesc: request.description,
    };

    const response = await fetch(`${MPESA_CONFIG.baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPushRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errorMessage || `STK Push failed: ${response.statusText}`);
    }

    const data: MpesaSTKPushResponse = await response.json();

    if (data.ResponseCode !== '0') {
      throw new Error(data.ResponseDescription || 'STK Push request failed');
    }

    return {
      success: true,
      data,
      message: 'STK Push initiated successfully',
    };
  } catch (error) {
    console.error('Error initiating STK Push:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to initiate payment',
    };
  }
};

// Check STK Push status
export const checkSTKPushStatus = async (
  checkoutRequestId: string
): Promise<ApiResponse<any>> => {
  try {
    const accessToken = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = generatePassword();

    const response = await fetch(`${MPESA_CONFIG.baseUrl}/mpesa/stkpushquery/v1/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: MPESA_CONFIG.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to check STK Push status: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
      message: 'STK Push status retrieved successfully',
    };
  } catch (error) {
    console.error('Error checking STK Push status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check payment status',
    };
  }
};

// Process M-Pesa callback
export const processMpesaCallback = (callback: MpesaCallback): {
  success: boolean;
  transactionId?: string;
  phone?: string;
  amount?: number;
  error?: string;
} => {
  try {
    const { stkCallback } = callback.Body;
    
    if (stkCallback.ResultCode === 0) {
      // Payment successful
      const metadata = stkCallback.CallbackMetadata?.Item || [];
      const transactionId = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value as string;
      const phone = metadata.find(item => item.Name === 'PhoneNumber')?.Value as string;
      const amount = metadata.find(item => item.Name === 'Amount')?.Value as number;

      return {
        success: true,
        transactionId,
        phone,
        amount,
      };
    } else {
      // Payment failed
      return {
        success: false,
        error: stkCallback.ResultDesc || 'Payment failed',
      };
    }
  } catch (error) {
    console.error('Error processing M-Pesa callback:', error);
    return {
      success: false,
      error: 'Failed to process payment callback',
    };
  }
};

// Validate phone number format (Kenya)
export const validatePhoneNumber = (phone: string): boolean => {
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it's a valid Kenya phone number
  // Format: 254XXXXXXXXX (11 digits starting with 254)
  if (cleanPhone.length === 11 && cleanPhone.startsWith('254')) {
    return true;
  }
  
  // Format: 07XXXXXXXX (10 digits starting with 07)
  if (cleanPhone.length === 10 && cleanPhone.startsWith('07')) {
    return true;
  }
  
  // Format: 7XXXXXXXX (9 digits starting with 7)
  if (cleanPhone.length === 9 && cleanPhone.startsWith('7')) {
    return true;
  }
  
  return false;
};

// Format phone number to M-Pesa format (254XXXXXXXXX)
export const formatPhoneNumber = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 11 && cleanPhone.startsWith('254')) {
    return cleanPhone;
  }
  
  if (cleanPhone.length === 10 && cleanPhone.startsWith('07')) {
    return `254${cleanPhone.slice(1)}`;
  }
  
  if (cleanPhone.length === 9 && cleanPhone.startsWith('7')) {
    return `254${cleanPhone}`;
  }
  
  throw new Error('Invalid phone number format');
};

// Get M-Pesa transaction details
export const getTransactionDetails = async (
  transactionId: string
): Promise<ApiResponse<any>> => {
  try {
    const accessToken = await getAccessToken();
    
    const response = await fetch(`${MPESA_CONFIG.baseUrl}/mpesa/transactionstatus/v1/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Initiator: MPESA_CONFIG.businessShortCode,
        SecurityCredential: MPESA_CONFIG.passkey,
        CommandID: 'TransactionStatusQuery',
        TransactionID: transactionId,
        PartyA: MPESA_CONFIG.businessShortCode,
        IdentifierType: '4', // Organization
        ResultURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/mpesa/result`,
        QueueTimeOutURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/mpesa/timeout`,
        Remarks: 'Transaction status query',
        Occasion: 'Transaction status query',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get transaction details: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
      message: 'Transaction details retrieved successfully',
    };
  } catch (error) {
    console.error('Error getting transaction details:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get transaction details',
    };
  }
};

// Export configuration for use in other parts of the app
export const mpesaConfig = {
  environment: MPESA_CONFIG.environment,
  businessShortCode: MPESA_CONFIG.businessShortCode,
  isProduction: MPESA_CONFIG.environment === 'production',
};
