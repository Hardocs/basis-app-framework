<template>
  <div>
    <div class="w-full bg-title">
    <h2 class="text-json">Buttons With Actions -- try one...</h2>
    </div>
    <hr>
    <HardocsDbOpsButtons
      v-on:loadProject="loadProject"
      v-on:saveProject="saveProject"
      v-on:clearDatabase="clearDatabase"
    />
    <div v-if="dbDisplay" class="bg-display text-white">
      {{ dbDisplay }}
    </div>
    <div v-if="opsDisplay" class="bg-display text-white">
      {{ opsDisplay }}
    </div>
  </div>
</template>

<script>

import HardocsDbOpsButtons from '@/components/HardocsDbOpsButtons'
import {
  storeToDatabase,
  loadFromDatabase,
  clearDatabase
} from '@/modules/habitat-database'

export default {
  name: "HardocsDb",
  data: function () {
    return {
      // these are the primary information for a project and its data
      owner: null,
      project: null,
      projectData: null, // expected connect to Vuex
      dbDisplay: null, // temporary measure, to first view

      // where we can indicate issues to screen
      opsDisplay: null
    }
  },
  mounted () {
    this.preloadDummyProjectInfo()
  },
  methods: {
    loadProject: function () {
      this.clearPanels()
      console.log ('loading owner: ' + this.owner + ', project: ' + this.project)
      this.dbDisplay = 'app is loading project owner: ' +
        this.owner + ', project: ' + this.project

      loadFromDatabase()
        .then(result => {
          console.log('loaded Project: ' + JSON.stringify(result))
          this.projectData = result.data
          this.dbDisplay = 'From Hardocs Project <' + this.owner + ':' + this.project +
            '>, app has loaded: '+ JSON.stringify(this.projectData)
        })
        .catch(err => {
          this.opsDisplay = JSON.stringify(err)
          this.opsDisplay = 'load project: error: ' + err
        })
    },
    saveProject: function () {
      this.clearPanels()
      console.log ('saving owner: ' + this.owner + ', project: ' + this.project)

      // first make a change that we can see, in this level of demo
      this.projectData.countMarker += 1

      storeToDatabase(this.owner, this.project, this.projectData)
        .then(result => {
          console.log('saveProject: result: ' + JSON.stringify(result))
          this.opsDisplay = result
          this.dbDisplay = 'For Hardocs Project <' + this.owner + ':' + this.project +
            '>, app has saved: '+ JSON.stringify(this.projectData)
        })
        .catch(err => {
          console.log('saveProject:error: ' + err)
          this.opsDisplay = 'save project: error: ' + err
        })
    },
    clearDatabase: function () {
      this.clearPanels()
      console.log ('clearing database... ')

      clearDatabase()
        .then(result => {
          console.log('clearDatabase: result: ' + JSON.stringify(result))
          this.opsDisplay = 'Cleared Entire Hardocs database (we won\'t have this ' +
            'in real Hardocs!): ' + JSON.stringify(result)
        })
        .catch(err => {
          console.log('clearDatabase:error: ' + err)
          this.opsDisplay = 'clear database: ' + err
        })
    },
    clearPanels: function () {
      this.opsDisplay = null
      this.dbDisplay = null
    },
    preloadDummyProjectInfo: function () {
      // *todo* for the moment, this is dummy data. Soon we'll add it normally, then find with view
      this.owner = 'hardOwner'
      this.project = 'firstProject'
      this.projectData = {
        docs: [
          { doc1: 'doc1 text we will see' },
          { doc2: 'doc2 text we will also see' },
        ],
        metadata: {
          meta1: 'meta1 data',
          meta2: 'meta2 data'
        },
        imgs: [
          { name: 'img1', data: 'image1data', type: 'jpg' },
          { name: 'img2', data: 'image2data', type: 'jpg' },
        ],
        countMarker: 0 // this is for keeping track of updates
      }
    }
  },
  components: {
    HardocsDbOpsButtons,
  }
}
</script>

<style>

h1 {
  font-size: larger;
  font-weight: bold;
  margin-bottom: 1.5em;
}

h2 {
  font-size: large;
  font-weight: bold;
  margin-bottom: 1em;
}

body {
  height: 100vh;
}

.master-item {
  cursor: pointer;
}

</style>
<style scoped>

.left-colx {
  width: 44%;
  padding: 0 2%;
}

.right-colx {
  width: 50%;
  padding: 0 2%;

}

.bg-title {
  background-color: #d6b668;
}

.bg-display {
  background-color: teal;
}

.text-json {
  color: #1d3557;
}

.html-data {
  text-align: left;
  white-space: normal;
  margin: 20px;
}
</style>
