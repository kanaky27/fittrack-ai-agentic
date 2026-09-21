mkdir -p backend/src/api/activity/content-types/activity
mkdir -p backend/src/api/activity/controllers
mkdir -p backend/src/api/activity/routes
mkdir -p backend/src/api/activity/services

cat << 'JSON' > backend/src/api/activity/content-types/activity/schema.json
{
  "kind": "collectionType",
  "collectionName": "activities",
  "info": {
    "singularName": "activity",
    "pluralName": "activities",
    "displayName": "Activity"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "duration": {
      "type": "integer",
      "required": true
    },
    "calories": {
      "type": "integer",
      "required": true
    },
    "date": {
      "type": "date",
      "required": true
    },
    "user": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    }
  }
}
JSON

cat << 'JS' > backend/src/api/activity/controllers/activity.js
'use strict';
const { createCoreController } = require('@strapi/strapi').factories;
module.exports = createCoreController('api::activity.activity');
JS

cat << 'JS' > backend/src/api/activity/routes/activity.js
'use strict';
const { createCoreRouter } = require('@strapi/strapi').factories;
module.exports = createCoreRouter('api::activity.activity');
JS

cat << 'JS' > backend/src/api/activity/services/activity.js
'use strict';
const { createCoreService } = require('@strapi/strapi').factories;
module.exports = createCoreService('api::activity.activity');
JS

cat << 'JS' > backend/src/index.js
'use strict';
module.exports = {
  register(/*{ strapi }*/) {},
  async bootstrap({ strapi }) {
    try {
      const roleService = strapi.plugin('users-permissions').service('role');
      if (roleService) {
        const roles = await roleService.find();
        const authRole = roles.find(r => r.type === 'authenticated');
        if (authRole) {
          const fullRole = await roleService.findOne(authRole.id);
          if (!fullRole.permissions) fullRole.permissions = {};
          
          fullRole.permissions = {
            ...fullRole.permissions,
            'api::meal': {
              controllers: { meal: { find: { enabled: true }, findOne: { enabled: true }, create: { enabled: true }, update: { enabled: true }, delete: { enabled: true } } }
            },
            'api::activity': {
              controllers: { activity: { find: { enabled: true }, findOne: { enabled: true }, create: { enabled: true }, update: { enabled: true }, delete: { enabled: true } } }
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

echo "Activity API created."
