migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtpky35cgqdr74e")

  // remove
  collection.schema.removeField("2orezi9b")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtpky35cgqdr74e")

  // add
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
})
