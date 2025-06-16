migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("23v4dwj9be5tm28");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "23v4dwj9be5tm28",
    "created": "2023-08-18 08:12:46.822Z",
    "updated": "2025-02-06 09:24:24.707Z",
    "name": "posts",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "zxoc60oa",
        "name": "title",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "dscxt1p0",
        "name": "content",
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
    "createRule": "",
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
