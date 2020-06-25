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
// import beautify from 'json-beautify'

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

    this.db = new PouchDb('hard-begin')
      // .then(result => console.log(result))
      // .catch(err => console.log(err))

    this.db.remove({
        _id: 'mydoc'
    })
      .then(result => {
        console.log(result)
      })
      .catch(err => {console.log(err)})

    this.db.put({
      _id: 'mydoc',
      title: 'Roma',
      description: 'A great true film of Mexico, from accurate lives, in not quite recent times.'
    }, function (doc) {
      if (!doc.count) {
        doc.count = 0;
      }
      doc.count++;
      return doc;
    })

    this.db.createIndex({
      index: {fields: ['title']}
    }).catch(function (err) {
      console.log(err);
    })

    // remember this is a promise, thus call back sets data when ready
    this.db.find ({
        selector: {
          title: 'Roma'
        }
    }).then (result => {
      const data =
        '<pre>\n' +
        JSON.stringify(result, null, 2)
        // beautify(result, null, 2, 80)
        + '\n</pre>'
      console.log(data)
      this.pouchData = data
      // return data
    })
    .catch(err => {
      console.log(err)
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
