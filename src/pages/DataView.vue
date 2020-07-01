<template>
  <span>
    <h2>Data View</h2>
    <hr>
    <div class="json-data" v-html="pouchData"></div>
    <!--    <div><h3>{{ pouchData }}</h3></div>-->
  </span>
</template>

<script>

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
    const dbName = 'hard-begin'

    this.db = createOrOpenDatabase(dbName)

    // no promise, so we'll check the status here
    getStatusOfDatabase(this.db).then(function (info) {
      console.log('info: ' + JSON.stringify(info))
    })

    // *todo* after discerning special matters about _id, we'll be changing this upsert api
    // but you can use this version until we do - just give a  unique key for each
    // record, in the second argument, i.e. 'wut' here...and keep in mind that the
    // basis key here, the _id, is not what we will look up records by. That will be a
    // normal field or files of your data, after such an index is created - see next step.
    upsertJsonToDatabase(this.db, 'wut', {
      title: 'Roma',
      description: 'A great true film  宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽' +
        '字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符 of Mexico, from accurate ' +
        'lives, in not quite recent times.'
    })
    .then (doc => {
      console.log('upsert: ' + JSON.stringify(doc))
      return createIndexOnDatabase(this.db, {
        index: {fields: ['title']}
      })
    }).then(result => {
      console.log('index: ' + JSON.stringify(result))
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
