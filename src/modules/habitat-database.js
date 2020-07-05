// here all database interactions are abstracted, thus decoupled

import PouchDb from 'pouchdb';
import PouchDbFind from 'pouchdb-find';
import PouchDbUpsert from 'pouchdb-upsert';
import { v4 as uuidv4 } from 'uuid'

PouchDb.plugin(PouchDbFind)
PouchDb.plugin(PouchDbUpsert)

const createOrOpenDb = (dbName) => {
  return new PouchDb(dbName, {
    revs_limit: 1 // *todo* easy way; much of interest to actually decide here, affects all
  })
}

const getStatusFromDb = (db) => {
  return db.info() // a promise, be aware, as all db.call()s are in Couch family
}

const createIndexOnDb = (db, index) => {
  return db.createIndex(index)
}

const upsertJsonToDb = (db, key, data) => {

  if (!key) {
    key = uuidv4()
  }

  return db.upsert(key,
    function (doc) {
      Object.assign(doc, data)

      // this count thing isn't needed, but useful from example, and if we
      // should want to keep track of how many updates a data has had. Revs,
      // though, are the thing.
      // *todo* also choices with future interesting things in mind...
      if (!doc.count) {
        doc.count = 0;
      }
      doc.count++;
      console.log('upsert: ' + JSON.stringify(doc))
      return doc;
    })
}

const getJsonFromDb = (db, query) => {
  return db.find(query)
}

const removeJsonFromDb = (db, record) => {
  return db.remove(record)
}

export {
  createOrOpenDb,
  getStatusFromDb,
  createIndexOnDb,
  upsertJsonToDb,
  getJsonFromDb,
  removeJsonFromDb
}

