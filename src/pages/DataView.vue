<template>
  <span>
    <h2>Data View</h2>
    <hr>
    <div class="json-data" v-html="pouchData"></div>
    <!--    <div><h3>{{ pouchData }}</h3></div>-->
  </span>
</template>

<script>
// import PouchDb from 'pouchdb'
// import PouchDbFind from 'pouchdb-find'
// import PouchDbUpsert from 'pouchdb-upsert'
import WrapAnsi from 'wrap-ansi'
import {
  createOrOpenDatabase,
  getStatusOfDatabase,
  getJsonFromDatabase,
  upsertJsonToDatabase,
  createIndexOnDatabase
} from '@/modules/habitat-requests'

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
    // PouchDb.plugin(PouchDbFind)
    // PouchDb.plugin(PouchDbUpsert)
    const dbName = 'hard-begin'

    // this.db = new PouchDb(dbName, {
    //   revs_limit: 1.
    // })
    this.db = createOrOpenDatabase(dbName)

    // no promise, so we'll check the status here
    // this.db.info().then(function (info) {
    //   console.log('info: ' + JSON.stringify(info))
    // })
    getStatusOfDatabase(this.db).then(function (info) {
      console.log('info: ' + JSON.stringify(info))
    })

    // we've really done an upsert of a kind here, it turns out preserving history
    // this.db.upsert('wut',
    //   function (doc) {
    //     Object.assign(doc, {
    //       _id: 'wut',
    //       title: 'Roma',
    //       description: 'A great true film  宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽' +
    //         '字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符 of Mexico, from accurate ' +
    //         'lives, in not quite recent times.'
    //     })
    //
    //     // this count thing isn't needed, but useful from example, and if we
    //     // should want to keep track of how many updates a data has had. Reve,
    //     // though, are the thing.
    //     if (!doc.count) {
    //       doc.count = 0;
    //     }
    //     doc.count++;
    //     console.log('upsert: ' + JSON.stringify(doc))
    //     return doc;
    upsertJsonToDatabase(this.db, 'wut', {
      _id: 'wut',
      title: 'Roma',
      description: 'A great true film  宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽' +
        '字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符 of Mexico, from accurate ' +
        'lives, in not quite recent times.'
    })
    .then (doc => {
      console.log('upsert: ' + JSON.stringify(doc))
      // return this.db.createIndex({
      //   index: {fields: ['title']}
      // })
      return createIndexOnDatabase(this.db, {
        index: {fields: ['title']}
      })
    }).then(result => {
      console.log('index: ' + JSON.stringify(result))
      // this.db.find({
      //   selector: {
      //     title: 'Roma'
      //   }
      return getJsonFromDatabase(this.db, {
        selector: {
          title: 'Roma'
        }
      })
    }).then(result => {

        // this form of stringify gives nice indented lines,
        // but we still have to wrap the long ones, since
        // we're presenting in <pre>
        // *todo* later, hook up the wrap width to screen viewport
        //  width, for the full effect.
        const data = this.responsiveWrap(
            JSON.stringify(result, null, 2),
          80)
        this.pouchData = '<pre>\n' + data + '\n</pre>'

    }).catch(err => {
      const msg = 'DataView: ' + err
      console.log(msg)
      this.pouchData = msg
    })
  },
  methods: {
    responsiveWrap: (text, width) => {
      return WrapAnsi(text, width, { trim: false, hard: true})
    }
  }
}
</script>

<style scoped>
.json-data {
  text-align: left;
  white-space: normal;
  margin: 20px;
}
</style>
