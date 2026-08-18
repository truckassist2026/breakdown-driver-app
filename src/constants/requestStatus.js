export const REQUEST_STATUS = {
  CREATED: 'CREATED',
  SEARCHING: 'SEARCHING',
  ASSIGNED: 'ASSIGNED',
  MECHANIC_EN_ROUTE: 'MECHANIC_EN_ROUTE',
  ARRIVED: 'ARRIVED',
  IN_PROGRESS: 'IN_PROGRESS',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export function getRequestStatusLabel(status) {
  switch (status) {
    case REQUEST_STATUS.CREATED:
      return 'Request Created';

    case REQUEST_STATUS.SEARCHING:
      return 'Finding Mechanic';

    case REQUEST_STATUS.ASSIGNED:
      return 'Mechanic Assigned';

    case REQUEST_STATUS.MECHANIC_EN_ROUTE:
      return 'Mechanic On The Way';

    case REQUEST_STATUS.ARRIVED:
      return 'Mechanic Arrived';

    case REQUEST_STATUS.IN_PROGRESS:
      return 'Service In Progress';

    case REQUEST_STATUS.PAYMENT_PENDING:
      return 'Payment Pending';

    case REQUEST_STATUS.COMPLETED:
      return 'Completed';

    case REQUEST_STATUS.CANCELLED:
      return 'Cancelled';

    default:
      return status || 'Unknown';
  }
}