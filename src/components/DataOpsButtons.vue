<template>
  <div class="btns-bg">
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
          label: "Find Record",
          action: this.findRecord
        },
        {
          label: "Remove Current Record...",
          action: this.removeRecord
        },
        // {
        //   label: "Another Example (not yet)",
        //   action: this.noOp
        // },
      ]
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

    },
    findRecord: function () {

    },
    removeRecord: function () {
      // fixed select for demo
      // *todo* in future, bother to provide keyValue in form, maybe keyName?
      this.$emit('removeJson', {
        selector: {
          title: 'Roma'
        }
      })
    },
    noOp: () => {} // but don't do arrows when you want to use this.anything
  },
}
</script>

<style scoped>
.btns-bg {
  background-color: #3d538b;
}
.cursor-p { /* because tailwind cursor-pointer won't take care of it */
  cursor:pointer;
}
</style>
