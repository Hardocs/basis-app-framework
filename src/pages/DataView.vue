<template>
  <span>
    <h2>Data View</h2>
    <hr>
    <div class="json-data" v-html="pouchData"></div>
<!--    <div><h3>{{ pouchData }}</h3></div>-->
  </span>
</template>

<script>
import PouchDb from 'pouchdb'
import PouchDbFind from 'pouchdb-find'
// import PouchDbUpsert from 'pouchdb-upsert'
import beautify from 'json-beautify'

export default {
  name: "DataView",
  data: function () {
    return {
      pouchData: 'Ready...',
      db: null
    }
  },
  created: function () {
    this.pouchData = 'Searching...'
    PouchDb.plugin(PouchDbFind)
    // PouchDb.plugin(PouchDbUpsert)
    const dbName = 'hard-begin'

    this.db = new PouchDb(dbName)
      // .then(result => console.log(result))
      // .catch(err => console.log(err))
    this.db.info().then(function (info) {
      console.log('info: ' + JSON.stringify(info))
    })
    // this.db.remove({
    //     _id: 'mydoc'
    // })
    //   .then(result => {
    //     console.log(result)
    //   })
    //   .catch(err => {console.log(err)})

    // this way to only update a single, non-time-sequenced element, as we use
    // we've really done an upsert here, so function coming
    this.db.find({
      selector: {
        title: 'Roma'
      }
    }).then(result => {
      const doc = result.docs[0]
      console.log('doc: ' + JSON.stringify(doc))
      this.db.put({
        _id: doc._id,
        _rev: doc._rev,
        title: 'Roma',
        description: 'A great true film of Mexico, from accurate lives, in not quite recent times.'
      }).then(result => {
        console.log('put: ' + JSON.stringify(result))
        return this.db.createIndex({
          index: {fields: ['title']}
        })
      }).then(result => {
        console.log('index: ' + JSON.stringify(result))
      }).catch(function (err) {
        console.log('put err: ' + JSON.stringify(err))
      })
    }).catch(function (err) {
      console.log('get err, so create: ' + JSON.stringify(err))
      // this.db.put({
      //   _id: 'mydo01',
      //   title: 'Roma',
      //   description: 'A great true film of Mexico, from accurate lives, in not quite recent times.'
      // }).then(result => {
      //   console.log('put new: ' + JSON.stringify(result))
      // }).catch(function (err) {
      //   console.log('put new err: ' + JSON.stringify(err))
      // })
    })

    // this.db.createIndex({
    //   index: {fields: ['title']}
    // }).then(result => {
    //   console.log('index: ' + JSON.stringify(result))
    // }).catch(function (err) {
    //   console.log('index new err: ' + JSON.stringify(err))
    // })

      // remember this is a promise, thus call back sets data when ready
      this.db.find ({
        selector: {
          title: 'Roma'
        }
      }).then (result => {
          const data =
            '<pre>\n' +
            // JSON.stringify(result, null, 2)
            beautify(result, null, 2, 80)
            + '\n</pre>'
          console.log(data)
          this.pouchData = data
        })
        .catch(err => {
          console.log('find: ' + JSON.stringify(err))
        })
    // }).catch(err => {
    //   console.log('index err: ' + JSON.stringify(err))
    // }).finally(() =>{
    //   // this.db.destroy(dbName)
    //   //   .then (result => console.log('destroy: ' + JSON.stringify(result)))
    //   //   .catch(err => console.log('destroy: ' + JSON.stringify(err)))
    // })
  }
}
</script>

<style scoped>
.json-data {
  text-align: left;
  margin: 20px;
}
</style>
