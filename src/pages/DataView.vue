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
import PouchDbUpsert from 'pouchdb-upsert'
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
    PouchDb.plugin(PouchDbUpsert)
    const dbName = 'hard-begin'

    this.db = new PouchDb(dbName)
    // .then(result => console.log(result))
    // .catch(err => console.log(err))
    this.db.info().then(function (info) {
      console.log('info: ' + JSON.stringify(info))
    })
    // we've really done an upsert of a kind here, it turns out preserving history
    this.db.upsert('wut',
      function (doc) {
        Object.assign(doc, {
          _id: 'wut',
          title: 'Roma',
          description: 'A truly great true film of Mexico, from accurate lives, in not quite recent times.'
        })

        if (!doc.count) {
          doc.count = 0;
        }
        doc.count++;
        console.log('upsert: ' + JSON.stringify(doc))
        return doc;
    }).then(doc => {
      console.log('upsert: ' + JSON.stringify(doc))
      return this.db.createIndex({
        index: {fields: ['title']}
      })
    }).then(result => {
      console.log('index: ' + JSON.stringify(result))
      this.db.find({
        selector: {
          title: 'Roma'
        }
      }).then(result => {
        const data =
          '<pre>\n' +
          // JSON.stringify(result, null, 2)
          beautify(result, null, 2, 80)
          + '\n</pre>'
        console.log(data)
        this.pouchData = data
      })
    }).catch(err => {
      console.log('upsert error: ' + JSON.stringify(err))
    })
  }
}
</script>

<style scoped>
.json-data {
  text-align: left;
  margin: 20px;
}
</style>
