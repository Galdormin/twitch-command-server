migrate((db) => {
  const collection = new Collection({
    "id": "rtpky35cgqdr74e",
    "created": "2025-04-18 14:44:39.519Z",
    "updated": "2025-04-18 14:44:39.519Z",
    "name": "ac_user_cards",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "dreqg02o",
        "name": "twitch_id",
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
        "id": "2orezi9b",
        "name": "stream_id",
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
        "id": "snqfcanv",
        "name": "card",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "jm29p94osaq8o4a",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": null,
          "displayFields": [
            "card_id"
          ]
        }
      },
      {
        "system": false,
        "id": "wnhjppew",
        "name": "date",
        "type": "date",
        "required": true,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
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
  const collection = dao.findCollectionByNameOrId("rtpky35cgqdr74e");

  return dao.deleteCollection(collection);
})
