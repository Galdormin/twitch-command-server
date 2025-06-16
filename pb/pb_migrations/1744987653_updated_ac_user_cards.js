migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtpky35cgqdr74e")

  collection.listRule = "twitch_id = @request.auth.twitchId"
  collection.viewRule = "twitch_id = @request.auth.twitchId"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtpky35cgqdr74e")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
