const allRoles = {
  user: [
    'readBlogs',
    'viewServices',
    'manageUserProfile',
    'makeAppointments',
    'manageAppointments',
    'manageProfile',
    'createReviews'
  ],
  beautician: [
    'readBlogs',
    'manageServices',
    'manageBeauticianProfile',
    'manageAppointments',
    'manageProducts',
    'manageClients'
  ],
  admin: ['manageBlogs', 'manageServiceTypes', 'managePages'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
