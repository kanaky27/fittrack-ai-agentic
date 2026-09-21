cat << 'JS' > backend/src/index.js
'use strict';

module.exports = {
  register(/*{ strapi }*/) {},

  async bootstrap({ strapi }) {
    try {
      console.log('Setting up default permissions...');
      const roleService = strapi.plugin('users-permissions').service('role');
      if (roleService) {
        const roles = await roleService.find();
        const authRole = roles.find(r => r.type === 'authenticated');
        if (authRole) {
          const fullRole = await roleService.findOne(authRole.id);
          
          if (!fullRole.permissions) {
             fullRole.permissions = {};
          }
          
          fullRole.permissions = {
            ...fullRole.permissions,
            'api::meal': {
              controllers: {
                meal: {
                  find: { enabled: true },
                  findOne: { enabled: true },
                  create: { enabled: true },
                  update: { enabled: true },
                  delete: { enabled: true }
                }
              }
            }
          };
          
          await roleService.updateRole(authRole.id, fullRole);
          console.log('Permissions updated successfully.');
        }
      }
    } catch (e) {
      console.error('Failed to set permissions:', e);
    }
  },
};
JS
