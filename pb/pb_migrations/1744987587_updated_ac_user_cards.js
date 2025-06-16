migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtpky35cgqdr74e")

  // remove
  collection.schema.removeField("wnhjppew")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtpky35cgqdr74e")

  // add
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
})
