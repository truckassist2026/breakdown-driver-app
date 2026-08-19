import { apiRequest } from './api';

// =====================================================
// SERVICE CATEGORY ENDPOINTS
// =====================================================

const SERVICE_CATEGORY_ENDPOINTS = {
  active: '/api/v1/service-categories',
};

// =====================================================
// GET ACTIVE SERVICE CATEGORIES
// =====================================================

export async function getServiceCategories() {
  return apiRequest(
    SERVICE_CATEGORY_ENDPOINTS.active,
    {
      method: 'GET',
    }
  );
}