import { apiRequest } from './api';


// =========================================================
// REQUEST ENDPOINTS
// =========================================================

const REQUEST_ENDPOINTS = {

  create:
    '/api/v1/requests',

  my:
    '/api/v1/requests/my',

  active:
    '/api/v1/requests/active',

  byId: (id) =>
    `/api/v1/requests/${id}`,

  history: (id) =>
    `/api/v1/requests/${id}/history`,

  cancel: (id) =>
    `/api/v1/requests/${id}/cancel`,
};


// =========================================================
// CREATE SERVICE REQUEST
// =========================================================

export async function createServiceRequest(
  payload
) {

  console.log(
    '===================================='
  );

  console.log(
    '[DRIVER REQUEST] Creating service request'
  );

  console.log(
    '[DRIVER REQUEST] Payload:',
    JSON.stringify(
      payload,
      null,
      2
    )
  );

  const response =
    await apiRequest(
      REQUEST_ENDPOINTS.create,
      {
        method: 'POST',
        body: payload,
      }
    );

  console.log(
    '[DRIVER REQUEST] Created:',
    JSON.stringify(
      response,
      null,
      2
    )
  );

  return response;
}


// =========================================================
// GET MY SERVICE REQUESTS
// =========================================================

export async function getMyServiceRequests() {

  console.log(
    '[DRIVER REQUEST] Loading my requests...'
  );

  const response =
    await apiRequest(
      REQUEST_ENDPOINTS.my,
      {
        method: 'GET',
      }
    );

  console.log(
    '[DRIVER REQUEST] My requests:',
    JSON.stringify(
      response,
      null,
      2
    )
  );

  return response;
}


// =========================================================
// GET ACTIVE SERVICE REQUEST
// =========================================================
//
// IMPORTANT:
// This endpoint is used by the Driver Active screen
// after a mechanic accepts the request.
//
// GET:
// /api/v1/requests/active
//
// =========================================================
export async function getActiveServiceRequest() {

  console.log(
    '===================================='
  );

  console.log(
    '[DRIVER ACTIVE] Loading active request...'
  );

  console.log(
    '[DRIVER ACTIVE] Endpoint:',
    REQUEST_ENDPOINTS.active
  );

  try {

    const response =
      await apiRequest(
        REQUEST_ENDPOINTS.active,
        {
          method: 'GET',
        }
      );

    console.log(
      '[DRIVER ACTIVE] API response:',
      JSON.stringify(
        response,
        null,
        2
      )
    );

    console.log(
      '[DRIVER ACTIVE] Request ID:',
      response?.id
    );

    console.log(
      '[DRIVER ACTIVE] Status:',
      response?.status
    );

    console.log(
      '[DRIVER ACTIVE] Driver:',
      response?.driver
    );

    console.log(
      '[DRIVER ACTIVE] Vehicle:',
      response?.vehicle
    );

    console.log(
      '[DRIVER ACTIVE] Mechanic:',
      response?.mechanic
    );

    console.log(
      '[DRIVER ACTIVE] Assigned Mechanic:',
      response?.assignedMechanic
    );

    return response;

  } catch (error) {

    // =====================================================
    // NO ACTIVE REQUEST IS A NORMAL STATE
    // =====================================================

    if (
      error?.status === 404 &&
      (
        error?.data?.error === 'NOT_FOUND' ||
        error?.data?.message ===
          'No active service request'
      )
    ) {

      console.log(
        '[DRIVER ACTIVE] No active service request.'
      );

      return null;
    }

    // =====================================================
    // REAL ERROR
    // =====================================================

    console.error(
      '[DRIVER ACTIVE] Failed to load active request:',
      error
    );

    console.error(
      '[DRIVER ACTIVE] Status:',
      error?.status
    );

    console.error(
      '[DRIVER ACTIVE] Data:',
      error?.data
    );

    throw error;
  }
}



// =========================================================
// GET SERVICE REQUEST BY ID
// =========================================================

export async function getServiceRequestById(
  requestId
) {

  if (!requestId) {

    throw new Error(
      'Request ID is required.'
    );
  }


  console.log(
    '[DRIVER REQUEST] Loading request:',
    requestId
  );


  const response =
    await apiRequest(
      REQUEST_ENDPOINTS.byId(
        requestId
      ),
      {
        method: 'GET',
      }
    );


  console.log(
    '[DRIVER REQUEST] Request details:',
    JSON.stringify(
      response,
      null,
      2
    )
  );


  return response;
}


// =========================================================
// GET REQUEST HISTORY
// =========================================================

export async function getServiceRequestHistory(
  requestId
) {

  if (!requestId) {

    throw new Error(
      'Request ID is required.'
    );
  }


  console.log(
    '[DRIVER REQUEST] Loading history:',
    requestId
  );


  const response =
    await apiRequest(
      REQUEST_ENDPOINTS.history(
        requestId
      ),
      {
        method: 'GET',
      }
    );


  console.log(
    '[DRIVER REQUEST] History:',
    JSON.stringify(
      response,
      null,
      2
    )
  );


  return response;
}


// =========================================================
// CANCEL SERVICE REQUEST
// =========================================================

export async function cancelServiceRequest(
  requestId
) {

  if (!requestId) {

    throw new Error(
      'Request ID is required.'
    );
  }


  console.log(
    '[DRIVER REQUEST] Cancelling request:',
    requestId
  );


  const response =
    await apiRequest(
      REQUEST_ENDPOINTS.cancel(
        requestId
      ),
      {
        method: 'PATCH',
      }
    );


  console.log(
    '[DRIVER REQUEST] Cancel response:',
    JSON.stringify(
      response,
      null,
      2
    )
  );


  return response;
}