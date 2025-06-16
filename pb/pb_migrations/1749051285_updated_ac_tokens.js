migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3zhy7frrlc3arq9")

  // remove
  collection.schema.removeField("kszwczzc")

  // add
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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3zhy7frrlc3arq9")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kszwczzc",
    "name": "twitch_id",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // remove
  collection.schema.removeField("tvrbgf9a")

  return dao.saveCollection(collection)
})
