import crypto from 'crypto';

// İyzico yapılandırması
const IYZICO_API_KEY = process.env.IYZICO_API_KEY || '';
const IYZICO_SECRET_KEY = process.env.IYZICO_SECRET_KEY || '';
const IYZICO_URI = process.env.IYZICO_URI || 'https://sandbox-api.iyzipay.com';

// İyzico request body oluşturma
function createRequestString(data: any): string {
  return JSON.stringify(data);
}

// İyzico signature oluşturma
// Signature = base64(hmac-sha256(randomString + requestString, secretKey))
function createSignature(randomString: string, requestString: string, secretKey: string): string {
  const hash = crypto
    .createHmac('sha256', secretKey)
    .update(randomString + requestString)
    .digest('base64');
  return hash;
}

// İyzico API isteği
async function makeIyzipayRequest(endpoint: string, data: any): Promise<any> {
  const requestString = createRequestString(data);
  const randomString = crypto.randomBytes(16).toString('hex');
  const signature = createSignature(randomString, requestString, IYZICO_SECRET_KEY);
  const authorizationString = `IYZWS ${IYZICO_API_KEY}:${signature}`;

  const response = await fetch(`${IYZICO_URI}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authorizationString,
      'x-iyzi-rnd': randomString,
      'x-iyzi-client-version': 'iyzipay-node-2.0.50',
    },
    body: requestString,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`İyzico API hatası: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

// Ödeme başlatma fonksiyonu
export async function initializePayment(data: {
  price: number;
  paidPrice: number;
  currency: string;
  basketId: string;
  paymentCard: {
    cardHolderName: string;
    cardNumber: string;
    expireMonth: string;
    expireYear: string;
    cvc: string;
    registerCard?: number;
  };
  buyer: {
    id: string;
    name: string;
    surname: string;
    gsmNumber: string;
    email: string;
    identityNumber: string;
    registrationAddress: string;
    city: string;
    country: string;
    zipCode: string;
  };
  shippingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
    zipCode: string;
  };
  billingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
    zipCode: string;
  };
  basketItems: Array<{
    id: string;
    name: string;
    category1: string;
    itemType: string;
    price: number;
  }>;
}) {
  const requestData = {
    locale: 'tr',
    conversationId: data.basketId,
    price: data.price,
    paidPrice: data.paidPrice,
    currency: data.currency,
    basketId: data.basketId,
    paymentCard: data.paymentCard,
    buyer: data.buyer,
    shippingAddress: data.shippingAddress,
    billingAddress: data.billingAddress,
    basketItems: data.basketItems,
  };

  return await makeIyzipayRequest('/payment/auth', requestData);
}

// Ödeme durumu sorgulama
export async function retrievePayment(paymentId: string) {
  const requestData = {
    locale: 'tr',
    paymentId: paymentId,
  };

  return await makeIyzipayRequest('/payment/detail', requestData);
}
