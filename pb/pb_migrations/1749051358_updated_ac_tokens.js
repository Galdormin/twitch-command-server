migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3zhy7frrlc3arq9")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tvrbgf9a",
    "name": "user",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "twitchName"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3zhy7frrlc3arq9")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tvrbgf9a",
    "name": "field",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "twitchName"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
