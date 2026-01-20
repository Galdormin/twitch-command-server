/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1499195898")

  // update collection data
  unmarshal({
    "listRule": null,
    "viewRule": null
  }, collection)

  // update field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "[a-zA-Z0-9]{30}",
    "hidden": false,
    "id": "text1597481275",
    "max": 0,
    "min": 0,
    "name": "token",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1499195898")

  // update collection data
  unmarshal({
    "listRule": "",
    "viewRule": ""
  }, collection)

  // update field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "[a-zA-Z0-9]{30}",
    "hidden": true,
    "id": "text1597481275",
    "max": 0,
    "min": 0,
    "name": "token",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
