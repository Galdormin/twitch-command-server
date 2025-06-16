migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtpky35cgqdr74e")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ugqifsfx",
    "name": "streamer",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
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
  const collection = dao.findCollectionByNameOrId("rtpky35cgqdr74e")

  // remove
  collection.schema.removeField("ugqifsfx")

  return dao.saveCollection(collection)
})
