<template>
  <div>
    <div class="w-full bg-title">
    <h2 class="text-json">Buttons With Actions -- try one...</h2>
    </div>
    <hr>
    <HardocsDbOpsButtons
      v-on:loadProjectFromDb="loadProjectFromDb"
      v-on:saveProjectToDb="saveProjectToDb"
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
import {habitatCloud, habitatDb} from '@hardocs-project/habitat-client'

export default {
  name: "HardocsDb",
  data: function () {
    return {
      countMarker: 0,

      // these are the primary information for a project and its data
      owner: null,
      projectBase: 'framework-project',
      project: null,
      projectData: null, // expected connect to Vuex
      dbDisplay: null, // temporary measure, to first view

      // where we can indicate issues to screen
      opsDisplay: null
    }
  },
  mounted () {
    // this.preloadsetDummyProjectInfo()
  },
  methods: {
    // *todo* get in the logged-in check everywhere, and update to suit the
    // database organization we're actually going to use.
    loadProjectFromDb: function (dbLocation) {
      this.clearPanels()
      console.log('loadProjectFromDb string: ' + dbLocation)
      habitatCloud.assureRemoteLogin(dbLocation)
        .then(() => {

          const owner = this.owner
          for (let count = 0; count <= this.countMarker; ++count) {
            const project = this.projectBase + count
            console.log('loading owner: ' + owner + ', project: ' + project)

            habitatDb.loadHabitatObject(owner, project, dbLocation)
              .then(result => {
                console.log('loaded Project: ' + JSON.stringify(result))
                this.projectData = result.data
                this.dbDisplay += (count > 0 ? ', ' : '') +
                  '<' + owner + ':' + project +
                  '> loaded: ' + JSON.stringify(this.projectData)
              })
              .catch(err => {
                this.opsDisplay = JSON.stringify(err)
                this.opsDisplay = 'load project: ' + project + ' error: ' + JSON.stringify(err)
              })
          }
        })
        .catch(err => {
          this.showError('listRemoteProjects', err)
        })
    },
    saveProjectToDb: function (dbLocation) {
      this.clearPanels()
      const owner = this.owner
      const project = this.projectBase + this.countMarker
      this.setDummyProjectInfo()

      console.log ('saving owner: ' + owner + ': ' + project)
      habitatCloud.assureRemoteLogin(dbLocation)
        .then(() => {

          // *todo* signature all wrong, and the function too..
          habitatDb.clearSaveHabitatObject(owner, project, this.projectData, dbLocation)
            .then(result => {
              console.log('saveProjectToDb: result: ' + JSON.stringify(result))
              this.opsDisplay = result
              this.dbDisplay = 'For Hardocs Project <' + this.owner + ':' + this.project +
                '>, app has saved: '+ JSON.stringify(this.projectData)
            })
            .catch(err => {
              console.log('saveProjectToDb:error: ' + JSON.stringify(err))
              this.opsDisplay = 'save project: error: ' + JSON.stringify(err)
            })
        })
        .catch(err => {
          this.showError('listRemoteProjects', err)
        })

      ++this.countMarker // for next time
    },
    showError: function (action, err) {
      // an essential, so we don't need to know which form comes
      err = typeof err !== 'string' ? JSON.stringify(err) : err
      const msg = `${action}:error: ` + err
      this.opsDisplay = msg
      console.log(msg)
    },
    clearDatabase: function () {
      this.clearPanels()
      console.log ('clearing database... ')
      this.countMarker = 0 // reset for next time

      habitatDb.clearDatabase()
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
      this.opsDisplay = ''
      this.dbDisplay = ''
    },
    setDummyProjectInfo: function () {
      // *todo* for the moment, this is dummy data. Soon we'll add it normally, then find with view
      this.owner = 'hardocs-projects'
      this.project = 'framework-project' + this.countMarker
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
        countMarker: this.countMarker // this is for keeping track of updates
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
