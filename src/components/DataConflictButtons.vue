<template>
  <div class="bg-btns">
    <div class="container mx-auto max-w-5xl flex xpb-4 items-center h-full ">
      <!-- be sure to use the noOp action when type is remote... -->
      <div
        @click="item.action"
        :key="item.label"
        v-for="item in items"
        active-class="p-4 mx-2 text-primary-25 hover:text-blue-100"
        class="p-2 hover:bg-primary-25 rounded-md mx-2 text-yellow-100 hover:font-semibold"
      >
        <div v-if="item.type === 'remote'">
          <a :href="item.name" target="_blank">{{ item.label }}</a>
        </div>
        <div v-else>
          <p class="cursor-p">{{ item.label }}</p>
        </div>
      </div>
    </div>
    <div v-if="operationResult" class="flex p-4 content-start text-left bg-display">
      <h2 class="px-4 text-white">Result: {{ resultString }}</h2>
    </div>
  </div>
</template>

<script>

import { getJsonFromFile, putJsonToFile } from '@/modules/habitat-requests'

export default {

  // n.b. Note that this component with DataOperations  practices a normal no-Vuex way
  // to interact between Vue parent and child

  name: "DataOpsButtons",
  props: {
    jsonData: {
      // default: () => { none: "yet" },
      type: Object
    },
    operationResult: {
      default: () => { },
      type: Object
    }
  },
  data: function () {
    return {
      items: [
        {
          label: "Create Record",
          action: this.createRecord
        },
        {
          label: "Create Conflicting Record",
          action: this.createConflictingRecord
        },
        {
          label: "Remove Current Record...",
          action: this.removeRecord
        },
        {
          label: "Find Record",
          action: this.findRecords
        },
        {
          label: "Clear Database",
          action: this.clearDatabase
        },
        // {
        //   label: "Another Example (not yet)",
        //   action: this.noOp
        // },
      ]
    }
  },
  computed: {
    resultString: function () {
      return JSON.stringify(this.operationResult)
    }
  },
  methods: {
    openFile: function () {
      getJsonFromFile ()
        .then (result => {
          this.$emit('showFile', result)
        })
        .catch (e => {
          const errResult = {
            path: '(no path)',
            content: '{ "error": ' + e.toString() + ' }'
          }
          this.$emit('showFile', errResult)
        })
    },
    saveFile: function () {
      putJsonToFile (this.jsonData)
        .then (result => {
          const fileResult = {
            path: result.path,
            content: this.jsonData,
          }
          this.$emit('savedFile', fileResult)
        })
        .catch (e => {
          const errResult = {
            path: '(no path)',
            content: '{ "error": ' + e.toString() + ' }'
          }
          this.$emit('savedFile', errResult)
        })
    },
    createRecord: function () {
      // fixed record for initial demo
      // *todo* in future, bother to provide keyValue in form, maybe keyName?
      this.$emit('createJson', {
        title: 'Roma',
        description: 'A great true film  宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽' +
          '字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符 of Mexico, from accurate ' +
          'lives, in not quite recent times.'
      })
    },
    createConflictingRecord: function () {
      console.log('createConflictingRecord')
      // fixed record for initial demo
      // *todo* in future, bother to provide keyValue in form, maybe keyName?
      this.$emit('createConflictingJson', {
        title: 'Roma',
        description: 'A truly great film  宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽' +
          '字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符宽字符 of Mexico, from accurate ' +
          'lives, in not quite recent times.'
      })
    },
    removeRecord: function () {
      // fixed select for initial demo
      // *todo* in future, bother to provide keyValue in form, maybe keyName?
      this.$emit('removeJson', {
        selector: {
          title: 'Roma',
          count: { $gt: true } // n.b. must mention a field in selector, to use it in sort...
        },
        sort: [
          { 'count': 'desc' }
        ],
        limit: 12
      })
    },
    findRecords: function () {
      this.$emit('findJson', {
        selector: {
          title: 'Roma',
          count: { $gt: true }
        },
        sort: [
          { 'count': 'desc' }
        ],
        limit: 1
      })
    },
    clearDatabase: function () {
      this.$emit('clearDatabase')
    },
    noOp: () => {} // but don't do arrows when you want to use this.anything
  },
}
</script>

<style scoped>
.bg-btns {
  background-color: #3d538b;
}
.bg-display {
  background-color: teal;
}
.cursor-p { /* because tailwind cursor-pointer won't take care of it */
  cursor:pointer;
}
</style>
