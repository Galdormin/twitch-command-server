migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3zhy7frrlc3arq9")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "1pesv8eu",
    "name": "token",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3zhy7frrlc3arq9")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "1pesv8eu",
    "name": "token",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
