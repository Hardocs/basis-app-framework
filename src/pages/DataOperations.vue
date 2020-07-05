<template>
  <span>
    <DataOpsButtons
      :json-data="currentData"
      :operation-result="operationResult"
      v-on:removeJson="removeCurrentJson"
    />
    <div class="bg-title">
      <h2>Data View</h2>
    </div>
    <div class="json-data" v-html="screenText"></div>
    <!--    <div><h3>{{ screenText }}</h3></div>-->
  </span>
</template>

<script>

import WrapAnsi from 'wrap-ansi'
import DataOpsButtons from '../components/DataOpsButtons'
import {
  createOrOpenDatabase,
  getStatusOfDatabase,
  getJsonFromDatabase,
  upsertJsonToDatabase,
  createIndexOnDatabase,
  removeJsonFromDatabase
} from '@/modules/habitat-requests'

export default {
  name: "DataView",
  data: function () {
    return {
      currentData: null,
      screenText: 'Ready...',
      operationResult: '',
      db: null
    }
  },
  created: function () {
    this.screenText = 'Searching...'
    const dbName = 'hard-begin'

    this.db = createOrOpenDatabase(dbName)

    // no promise, so we'll check the status here
    getStatusOfDatabase(this.db).then(function (info) {
      console.log('info: ' + JSON.stringify(info))
    })

    // *todo* after working out some special matters about _id, there's a change
    // in how this upsert api is intended to be used, but you can use this example
    // until we get to that - just give a unique key in the second argument,
    // e.g. 'wut' here, for each record you want to try out.
    //
    // There'll soon be a more elaborate DataView component replacing this initial
    // one, which will demonstrate exactly how we'll actually do this.
    //
    // The basis point is that in a real situation, we'll always look up the record
    // of interest with a query on one or more information properties, before
    // updating it -- or discovering it doesn't exist, thus writing it for the first time.

    // At the level of interaction that document databases interact, it makes entire
    // sense to do that ourselves. Examples forthcoming...
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
        // *todo* later, hook up the wrap width to screen viewport width, for full effect
      this.currentData = result
      this.screenText = this.screenFormatJson(result)
    }).catch(err => {
      const msg = 'DataView: ' + err
      console.log(msg)
      this.screenText = msg
    })
  },
  methods: {
    removeCurrentJson (query) {
      this.operationResult = ''
      getJsonFromDatabase(this.db, query)
      .then(result => {
        const records = result.docs
        console.log('removeCurrentJson:records: ' + JSON.stringify(records))
        // *todo* this is a beginning on where it gets tricky, and in dimensions: explain!
        // and thus why we use the remove name, to remind considerations...
        return removeJsonFromDatabase (this.db, records[0])
      })
      .then(result => {
        this.operationResult = JSON.stringify(result)
        console.log('Instructive: removal: ' + this.operationResult)

        return getJsonFromDatabase(this.db, {
          selector: {
            title: 'Roma'
          }
        })
      })
      .then(result => {
        this.currentData = result
        this.screenText = this.screenFormatJson(result)
      })
      .catch (err => {
        const msg = 'Remove Json: ' + err
        console.log(msg)
        this.operationResult = msg
      })
    },
    responsiveWrap: (text, width) => {
      return WrapAnsi(text, width, { trim: false, hard: true})
    },
    screenFormatJson: function (text, width = 80) {
      // this form of stringify gives nice indented lines,
      // but we still have to wrap the long ones, since
      // we're presenting in <pre>
      const data = this.responsiveWrap(
        JSON.stringify(text, null, 2),
        width)
      return '<pre>\n' + data + '\n</pre>'
    }
  },
  components: {
    DataOpsButtons
  }
}
</script>

<style scoped>
.bg-title {
  background-color: #d6b668;
}

.json-data {
  text-align: left;
  white-space: normal;
  margin: 20px;
}
</style>
