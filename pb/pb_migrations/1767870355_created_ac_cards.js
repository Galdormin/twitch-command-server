migrate((db) => {
  const collection = new Collection({
    "id": "l8pa8wmn28x4jxt",
    "created": "2026-01-08 11:05:55.889Z",
    "updated": "2026-01-08 11:05:55.889Z",
    "name": "ac_cards",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "7a6bokv3",
        "name": "card_id",
        "type": "number",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "cy5wi59f",
        "name": "name",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "hgg8hjxp",
        "name": "family",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "cljjw7sjxls06m0",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "4cqhwlsj",
        "name": "wiki",
        "type": "url",
        "required": false,
        "unique": false,
        "options": {
          "exceptDomains": [],
          "onlyDomains": []
        }
      },
      {
        "system": false,
        "id": "uh8nyvur",
        "name": "image",
        "type": "file",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "maxSize": 5242880,
          "mimeTypes": [
            "image/png",
            "image/jpeg",
            "image/gif",
            "image/webp"
          ],
          "thumbs": [],
          "protected": false
        }
      },
      {
        "system": false,
        "id": "ckeiaah3",
        "name": "credit",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "@request.auth.id != \"\" && @collection.ac_admins.user ?~ @request.auth.id",
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("l8pa8wmn28x4jxt");

  return dao.deleteCollection(collection);
})
