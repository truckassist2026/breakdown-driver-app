import { apiRequest } from './api';

/**
 * =========================================================
 * DRIVER PAYMENT SERVICE
 * =========================================================
 *
 * All payment-related backend calls for the Driver app
 * should be kept here.
 *
 * The payment screen must NEVER contain hardcoded amounts.
 */

/**
 * Get the payment/bill generated for a service request.
 *
 * Expected backend response can be either:
 *
 * {
 *   id,
 *   requestId,
 *   serviceCharge,
 *   travelCharge,
 *   totalAmount,
 *   status
 * }
 *
 * OR:
 *
 * {
 *   payment: {
 *     ...
 *   }
 * }
 */
export async function getPaymentByRequestId(requestId) {
  if (!requestId) {
    throw new Error('Request ID is required.');
  }

  return apiRequest(
    `/api/v1/payments/requests/${encodeURIComponent(
      String(requestId)
    )}`,
    {
      method: 'GET',
    }
  );
}

/**
 * Pay the bill for a service request.
 *
 * paymentMethod:
 *   UPI
 *   CASH
 */
export async function payServiceRequest(
  requestId,
  paymentMethod
) {
  if (!requestId) {
    throw new Error('Request ID is required.');
  }

  if (!paymentMethod) {
    throw new Error('Payment method is required.');
  }

  return apiRequest(
    `/api/v1/payments/requests/${encodeURIComponent(
      String(requestId)
    )}/pay`,
    {
      method: 'POST',
      body: JSON.stringify({
        paymentMethod,
      }),
    }
  );
}