<template>
  <div class="btns-bg">
    <h2>Actions: </h2>
    <div class="container mx-auto max-w-5xl flex items-center h-full ">
      <div
        :key="item.label"
        v-for="item in items"
        active-class="p-4 mx-2 text-primary-25 hover:text-blue-100"
        class="p-2 hover:bg-primary-25 rounded-md mx-2 text-yellow-100 hover:font-semibold"
      >
        <div v-if="item.type === 'remote'">
          <a :href="item.name" target="_blank">{{ item.label }}</a>
        </div>
        <div v-else>
          <p @click="item.action">{{ item.label }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { getJsonFromFile, putJsonToFile } from '@/modules/habitat-requests'

export default {

  // n.b. Note that this component with ButtonGurka practices a normal no-Vuex way
  // to interact between Vue parent and child

  name: "ButtonsPanel",
  props: {
    jsonData: {
      default: '{ "none": "yet" }',
      type: String
    }
  },
  mounted: function () {
    console.log ('ButtonsPane: jsonData: ' + this.jsonData)
  },
  data: function () {
    return {
      items: [
        {
          name: "/",
          label: "Display Json File",
          type: 'local',
          action: this.openFile
        },
        {
          name: "/",
          label: "Save Json File from Screen",
          type: 'local',
          action: this.saveFile
        },
        // {
        //   name: "/other",
        //   label: "Another Example (not yet)",
        //   type: 'local',
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
          this.fileContent = e.toString()
        })
    },
    saveFile: function () {
      putJsonToFile (this.jsonData)
        .then (result => {
          this.$emit('showFile', result)
        })
        .catch (e => {
          this.fileContent = e.toString()
        })
    },
    noOp: () => {} // but don't do arrows when you want to use this.anything
  },
}
</script>

<style scoped>

.btns-bg {
  background-color: darkslateblue;
}

</style>
