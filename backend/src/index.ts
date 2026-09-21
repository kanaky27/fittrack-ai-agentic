'use strict';
export default {
  register(/*{ strapi }*/) {},
  async bootstrap({ strapi }: { strapi: any }) {
    try {
      const roleService = strapi.plugin('users-permissions').service('role');
      if (roleService) {
        const roles = await roleService.find();
        const authRole = roles.find((r: any) => r.type === 'authenticated');
        if (authRole) {
          const fullRole = await roleService.findOne(authRole.id);
          if (!fullRole.permissions) fullRole.permissions = {};
          
          fullRole.permissions = {
            ...fullRole.permissions,
            'api::meal': {
              controllers: { meal: { find: { enabled: true }, findOne: { enabled: true }, create: { enabled: true }, update: { enabled: true }, destroy: { enabled: true }, delete: { enabled: true }, analyzeFood: { enabled: true } } }
            },
            'api::activity': {
              controllers: { activity: { find: { enabled: true }, findOne: { enabled: true }, create: { enabled: true }, update: { enabled: true }, destroy: { enabled: true }, delete: { enabled: true } } }
            },
            'api::chat-message': {
              controllers: { 'chat-message': { find: { enabled: true }, create: { enabled: true }, chat: { enabled: true } } }
            },
            'plugin::users-permissions': {
              ...fullRole.permissions['plugin::users-permissions'],
              controllers: {
                ...fullRole.permissions['plugin::users-permissions']?.controllers,
                user: {
                  ...(fullRole.permissions['plugin::users-permissions']?.controllers?.user || {}),
                  find: { enabled: true },
                  findOne: { enabled: true },
                  update: { enabled: true },
                  destroy: { enabled: true }, delete: { enabled: true },
                  me: { enabled: true }
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
