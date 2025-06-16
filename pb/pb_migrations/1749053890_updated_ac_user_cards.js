migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtpky35cgqdr74e")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "snqfcanv",
    "name": "cards",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "jm29p94osaq8o4a",
      "cascadeDelete": false,
      "minSelect": 1,
      "maxSelect": null,
      "displayFields": [
        "card_id",
        "name"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtpky35cgqdr74e")

  // update
  collection.schema.addField(new SchemaField({
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
        "card_id",
        "name"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
