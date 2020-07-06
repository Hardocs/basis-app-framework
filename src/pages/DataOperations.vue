<template>
  <span>
    <DataOpsButtons
      :json-data="currentData"
      :operation-result="operationResult"
      v-on:createJson="createJsonRecord"
      v-on:removeJson="removeCurrentJson"
      v-on:findJson="findJsonRecords"
      v-on:clearDatabase="clearDatabase"
    />
    <div class="bg-title">
      <h2>Data View</h2>
    </div>
    <div class="json-data" v-html="screenText"></div>
  </span>
</template>

<script>

import WrapAnsi from 'wrap-ansi'
// import Atomics from 'Atomics'
import DataOpsButtons from '../components/DataOpsButtons'
import {
  createOrOpenDatabase,
  getStatusOfDatabase,
  createIndexOnDatabase,
  putJsonToDatabase,
  explainJsonFromDatabase,
  findJsonFromDatabase,
  removeJsonFromDatabase
} from '@/modules/habitat-requests'

export default {
  name: "DataOperations",
  data: function () {
    return {
      dbName: 'hard-begin',
      currentData: null,
      recordCount: 0,
      screenText: 'Ready...',
      operationResult: {},
      db: null
    }
  },
  created: function () {
    console.log('atomics: ' + typeof Atomics)
    this.prepareDatabase()
  },
  methods: {
    createJsonRecord (record) {
      this.operationResult = {}
      record = Object.assign (record, {
        // n.b. this is just for our demo's sorting convenience
        count: this.recordCount++
      })
      putJsonToDatabase(this.db, record)
        .then(result => {
          this.operationResult = result
        })
        .then(() => {
          return explainJsonFromDatabase(this.db, {
            selector: {
              title: 'Roma',
              count: { $gt: true }
            },
            sort: [
              { 'count': 'desc' }
            ],
            limit: 12
          })
        })
        .then((result) => {
          console.log('explain: ' + JSON.stringify(result))
          return findJsonFromDatabase(this.db, {
            selector: {
              title: 'Roma',
              count: { $gt: true } // n.b. must mention field in selector, to use in sort...
            },
            sort: [
              { 'count': 'desc' }
            ],
            limit: 12
          })
        })
        .then(result => {
          this.currentData = result
          this.screenText = this.screenFormatJson(result)
        })
        .catch(err => {
          const msg = 'Create Json: ' + err
          console.log(msg)
          this.operationResult = { error: msg }
        })
    },
    removeCurrentJson (query) {
      this.operationResult = {}
      findJsonFromDatabase(this.db, query)
      .then(result => {
        const records = result.docs
        // *todo* this is a beginning on where it gets tricky, and in dimensions: explain!
        // and thus why we use the remove name, to remind considerations...
        const status = removeJsonFromDatabase (this.db, records[0])  // top one for 'current'
        this.recordCount = this.recordCount > 0 // a little safety for dev mishaps
          ? this.recordCount - 1
          : 0
        return status
      })
      .then(result => {
        this.operationResult = result
        console.log('Instructive: removal: ' + JSON.stringify(this.operationResult))

        return findJsonFromDatabase(this.db, {
          selector: {
            title: 'Roma',
            count: { $gt: true } // n.b. must mention a field in selector, to use it in sort...
          },
          sort: [
            { 'count': 'desc' }
          ],
          limit: 12
        })
      })
      .then(result => {
        this.currentData = result
        this.screenText = this.screenFormatJson(result)
      })
      .catch (err => {
        const msg = 'Remove Json: ' + err
        console.log(msg)
        this.operationResult = { error: msg }
      })
    },
    findJsonRecords: function (query) {
      findJsonFromDatabase(this.db, query)
        .then(result => {
          this.currentData = result
          this.screenText = this.screenFormatJson(result)
        })
        .catch(err => {
          const msg = 'DataOperations:findJsonRecords ' + err
          console.log(msg)
          this.screenText = msg
        })
    },
    clearDatabase: function () {
      this.screenText = '<p>Clearing the database turns out to be tricky, and ' +
        'is not something we\'d normally do.</p><br>' +
        '<p>For development then, just open the Application menu of the app\'s ' +
        'Chrome Development tools (far to the right of Console, but you can pull ' +
        'it over so it will be visible the next time),' +
        'and use the \'Clear site data\' button.</p><br>' +
        '<p>Then Refresh (Ctrl-R), and you\'ll have a brand new empty database.</p>'
    },
    prepareDatabase: function () {

      this.operationResult = null
      this.db = createOrOpenDatabase(this.dbName)

      // no promise, so we'll just check the status here in between
      getStatusOfDatabase(this.db)
        .then(function (info) {
          console.log('db info: ' + JSON.stringify(info))
        })

      // indexes, relation to query and sort capabilities, a complex subject
      // as ever, so we've provided and use explain. At the least, our practices should
      // include use of explain in all development of queries on apps!
      createIndexOnDatabase(this.db, {
        index: {fields: ['title']}
      }).then (doc => {
        console.log('index title: ' + JSON.stringify(doc))
        return createIndexOnDatabase(this.db, {
          index: {fields: ['count']}
        })
      }).then(result => {
        console.log('index count: ' + JSON.stringify(result))
        return findJsonFromDatabase(this.db, {
          selector: {
            title: 'Roma',
            count: { $gt: true }
          },
          sort: [
            { 'count': 'desc' }
          ],
          limit: 12
        })
      }).then(result => {
        console.log('find: ' + JSON.stringify(result))
        // *todo* later, hook up the wrap width to screen viewport width, for full effect
        this.currentData = result
        this.screenText = this.screenFormatJson(result)
      }).catch(err => {
        const msg = 'DataOperations:prepareDatabase ' + err
        console.log(msg)
        this.screenText = msg
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
    },
    log: (status, id, item) => {
      let msg = typeof item === 'object'
        ? JSON.stringify(item)
        : item
      let report = {}
      msg = id + ': ' + msg
      console.log (msg)
      report[status] = msg
      return report
    },
    sleep: (milliseconds) => {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
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
