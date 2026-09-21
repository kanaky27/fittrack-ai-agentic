mkdir -p backend/src/api/meal/content-types/meal
mkdir -p backend/src/api/meal/controllers
mkdir -p backend/src/api/meal/routes
mkdir -p backend/src/api/meal/services

cat << 'JSON' > backend/src/api/meal/content-types/meal/schema.json
{
  "kind": "collectionType",
  "collectionName": "meals",
  "info": {
    "singularName": "meal",
    "pluralName": "meals",
    "displayName": "Meal",
    "description": ""
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
      "target": "plugin::users-permissions.user",
      "inversedBy": "meals"
    },
    "image_url": {
      "type": "text"
    },
    "ai_analysis": {
      "type": "text"
    }
  }
}
JSON

cat << 'JS' > backend/src/api/meal/controllers/meal.js
'use strict';
const { createCoreController } = require('@strapi/strapi').factories;
module.exports = createCoreController('api::meal.meal');
JS

cat << 'JS' > backend/src/api/meal/routes/meal.js
'use strict';
const { createCoreRouter } = require('@strapi/strapi').factories;
module.exports = createCoreRouter('api::meal.meal');
JS

cat << 'JS' > backend/src/api/meal/services/meal.js
'use strict';
const { createCoreService } = require('@strapi/strapi').factories;
module.exports = createCoreService('api::meal.meal');
JS

echo "API created."
