import { apiRequest } from './api';

const REQUEST_ENDPOINTS = {
  my: '/api/v1/requests/my',
  active: '/api/v1/requests/active',
  byId: (id) => `/api/v1/requests/${id}`,
  history: (id) => `/api/v1/requests/${id}/history`,
  cancel: (id) => `/api/v1/requests/${id}/cancel`,
};

// =====================================================
// GET MY SERVICE REQUESTS
// =====================================================

export async function getMyServiceRequests() {
  return apiRequest(
    REQUEST_ENDPOINTS.my,
    {
      method: 'GET',
    }
  );
}

// =====================================================
// GET ACTIVE SERVICE REQUEST
// =====================================================

export async function getActiveServiceRequest() {
  return apiRequest(
    REQUEST_ENDPOINTS.active,
    {
      method: 'GET',
    }
  );
}

// =====================================================
// GET SERVICE REQUEST BY ID
// =====================================================

export async function getServiceRequestById(
  requestId
) {
  return apiRequest(
    REQUEST_ENDPOINTS.byId(requestId),
    {
      method: 'GET',
    }
  );
}

// =====================================================
// GET REQUEST HISTORY
// =====================================================

export async function getServiceRequestHistory(
  requestId
) {
  return apiRequest(
    REQUEST_ENDPOINTS.history(requestId),
    {
      method: 'GET',
    }
  );
}

// =====================================================
// CANCEL SERVICE REQUEST
// =====================================================

export async function cancelServiceRequest(
  requestId
) {
  return apiRequest(
    REQUEST_ENDPOINTS.cancel(requestId),
    {
      method: 'PATCH',
    }
  );
}