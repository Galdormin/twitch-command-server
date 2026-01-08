migrate((db) => {
  const collection = new Collection({
    "id": "xd9jk5hy0bz48rh",
    "created": "2026-01-08 11:06:37.505Z",
    "updated": "2026-01-08 11:06:37.505Z",
    "name": "ac_tokens",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "rxfpfdur",
        "name": "user",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "khpslxlr",
        "name": "token",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("xd9jk5hy0bz48rh");

  return dao.deleteCollection(collection);
})
