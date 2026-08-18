import { apiRequest } from './api';


// =====================================================
// VEHICLE ENDPOINTS
// =====================================================

const VEHICLE_ENDPOINTS = {
  my: '/api/v1/vehicles/my',

  byId: (id) =>
    `/api/v1/vehicles/${id}`,

  create: '/api/v1/vehicles',
};


// =====================================================
// GET MY VEHICLES
// =====================================================

export async function getMyVehicles() {

  return apiRequest(
    VEHICLE_ENDPOINTS.my,
    {
      method: 'GET',
    }
  );
}


// =====================================================
// GET VEHICLE BY ID
// =====================================================

export async function getVehicleById(
  vehicleId
) {

  return apiRequest(
    VEHICLE_ENDPOINTS.byId(
      vehicleId
    ),
    {
      method: 'GET',
    }
  );
}


// =====================================================
// CREATE VEHICLE
// =====================================================

export async function createVehicle(
  vehicle
) {

  return apiRequest(
    VEHICLE_ENDPOINTS.create,
    {
      method: 'POST',
      body: vehicle,
    }
  );
}


// =====================================================
// UPDATE VEHICLE
// =====================================================

export async function updateVehicle(
  vehicleId,
  vehicle
) {

  return apiRequest(
    VEHICLE_ENDPOINTS.byId(
      vehicleId
    ),
    {
      method: 'PUT',
      body: vehicle,
    }
  );
}


// =====================================================
// DELETE VEHICLE
// =====================================================

export async function deleteVehicle(
  vehicleId
) {

  return apiRequest(
    VEHICLE_ENDPOINTS.byId(
      vehicleId
    ),
    {
      method: 'DELETE',
    }
  );
}