import { apiRequest } from './api';

const DRIVER_ENDPOINTS = {
  me: '/api/v1/drivers/me',
  updateMe: '/api/v1/drivers/me',
  availability: '/api/v1/drivers/me/availability',
};

// =========================================================
// GET CURRENT DRIVER
// =========================================================

export async function getMyDriverProfile() {
  return apiRequest(
    DRIVER_ENDPOINTS.me,
    {
      method: 'GET',
    }
  );
}

// =========================================================
// UPDATE CURRENT DRIVER PROFILE
// =========================================================

export async function updateMyDriverProfile(
  profile
) {
  const body = {
    name:
      profile.name?.trim() || null,

    email:
      profile.email?.trim() || null,

    profileImageUrl:
      profile.profileImageUrl || null,

    licenseNumber:
      profile.licenseNumber?.trim() || null,

    licenseExpiryDate:
      profile.licenseExpiryDate || null,

    emergencyContactName:
      profile.emergencyContactName?.trim() || null,

    emergencyContactPhone:
      profile.emergencyContactPhone?.trim() || null,
  };

  console.log(
    '[Truck Assist] Updating driver profile:',
    JSON.stringify(body, null, 2)
  );

  return apiRequest(
    DRIVER_ENDPOINTS.updateMe,
    {
      method: 'PUT',
      body,
    }
  );
}

// =========================================================
// UPDATE DRIVER AVAILABILITY
// =========================================================

export async function updateDriverAvailability(
  available
) {
  return apiRequest(
    `${DRIVER_ENDPOINTS.availability}?available=${available}`,
    {
      method: 'PATCH',
    }
  );
}