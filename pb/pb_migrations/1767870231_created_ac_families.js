migrate((db) => {
  const collection = new Collection({
    "id": "cljjw7sjxls06m0",
    "created": "2026-01-08 11:03:51.922Z",
    "updated": "2026-01-08 11:03:51.922Z",
    "name": "ac_families",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "82ygzfzl",
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
        "id": "4wzwlnow",
        "name": "wiki",
        "type": "url",
        "required": false,
        "unique": false,
        "options": {
          "exceptDomains": null,
          "onlyDomains": null
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("cljjw7sjxls06m0");

  return dao.deleteCollection(collection);
})
