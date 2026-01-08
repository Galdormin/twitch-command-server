migrate((db) => {
  const collection = new Collection({
    "id": "c8qevafxq5btf5r",
    "created": "2026-01-08 11:07:49.178Z",
    "updated": "2026-01-08 11:07:49.178Z",
    "name": "ac_user_cards",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "al4l6zb5",
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
        "id": "hysswb1c",
        "name": "streamer",
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
        "id": "jljqzisl",
        "name": "cards",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "l8pa8wmn28x4jxt",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": [
            "card_id",
            "name"
          ]
        }
      }
    ],
    "indexes": [],
    "listRule": "twitch_id = @request.auth.twitchId",
    "viewRule": "twitch_id = @request.auth.twitchId",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("c8qevafxq5btf5r");

  return dao.deleteCollection(collection);
})
