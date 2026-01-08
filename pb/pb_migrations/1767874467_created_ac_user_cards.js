/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "number1131226435",
        "max": null,
        "min": null,
        "name": "twitchId",
        "onlyInt": false,
        "presentable": false,
        "required": true,
        "system": false,
        "type": "number"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "relation771141170",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "streamer",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_3159057647",
        "hidden": false,
        "id": "relation79845629",
        "maxSelect": 999,
        "minSelect": 0,
        "name": "cards",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_2217026785",
    "indexes": [],
    "listRule": "twitchId = @request.auth.twitchId",
    "name": "ac_user_cards",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": "twitchId = @request.auth.twitchId"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2217026785");

  return app.delete(collection);
})
