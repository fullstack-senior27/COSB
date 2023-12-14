const allRoles = {
  user: [
    'readBlogs',
    'viewServices',
    'manageUserProfile',
    'makeAppointments',
    'manageAppointments',
    'manageProfile',
    'createReviews',
    'makePayments'
  ],
  beautician: [
    'readBlogs',
    'manageServices',
    'manageBeauticianProfile',
    'manageAppointments',
    'manageProducts',
    'manageClients',
    'manageConnectAccount',
    'managePromotions'
  ],
  admin: ['manageBlogs', 'manageServiceTypes', 'managePages'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
