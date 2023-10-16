const allRoles = {
  user: ['readBlogs', 'viewServices', 'manageUserProfile'],
  beautician: ['readBlogs', 'manageServices', 'manageBeauticianProfile'],
  admin: ['manageBlogs', 'manageServiceTypes'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
