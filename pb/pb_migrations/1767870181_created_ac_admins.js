migrate((db) => {
  const collection = new Collection({
    "id": "xbpnvs3vztt35ug",
    "created": "2026-01-08 11:03:01.316Z",
    "updated": "2026-01-08 11:03:01.316Z",
    "name": "ac_admins",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "eyqwccb3",
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
  const collection = dao.findCollectionByNameOrId("xbpnvs3vztt35ug");

  return dao.deleteCollection(collection);
})
