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
import WrapAnsi from 'wrap-ansi'
import Smartwrap from 'smartwrap'

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

    this.db = new PouchDb(dbName, {
      revs_limit: 1.
    })
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
          description: 'A great true film  宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符of Mexico, from accurate lives, in not quite recent times.'
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
        console.log(result)
        // const xresult = 'just one line 宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符 but a long enough one to see if that is really the problem we see this time'
        // const xresult = 'just one line but a long enough one to see if that is really the problem we see this time'
        let data = WrapAnsi(JSON.stringify(result, null, 2),
          80,
          { trim: false, hard: true})
          // data = JSON.stringify(result, null, 2)
          // *todo* wrap ourselves, to suit pre
        // data = Smartwrap(JSON.stringify(result, null, 2), { width: 40,  hard: true })
        // data = this.multiWrap(JSON.stringify(result, null, 2))
        // set width by viewport, will be something like 30 for small phone, to 80 or above laptop
        data = this.responsiveWrap(JSON.stringify(result, null, 2), 30)
        console.log(typeof result)
        console.log (JSON.stringify(result))
        console.log (JSON.stringify(result.docs[0]))


        console.log(data)
        this.pouchData = '<pre>\n' + data + '\n</pre>'
      })
    }).catch(err => {
      console.log('upsert error: ' + JSON.stringify(err))
    })
  },
  methods: {
    responsiveWrap: (text, width) => {
      return WrapAnsi(text, width, { trim: false, hard: true})
    },
    multiWrap: (paragraph) => {
      const lines = paragraph.split('\n')
      console.log ('lines: ' + JSON.stringify(lines))
      const outLines = lines.map (line => {
        return Smartwrap(line, { width: 40, trim: false, hard: true })
      })
      console.log ('outLines: ' + JSON.stringify(outLines))
      return outLines.join('\n')
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
