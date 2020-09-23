<template>
  <div>
    <div class="w-full bg-title">
    <h2 class="text-json">Buttons With Actions -- try one...</h2>
    </div>
    <hr>
    <ProjectsAdminOpsButtons
      v-on:createProjects="createProjects"
      v-on:listProjects="listProjects"
      v-on:adminProjects="adminProjects"
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

import ProjectsAdminOpsButtons from '@/components/ProjectsAdminOpsButtons'
import { habitatDb } from '@hardocs-project/habitat-client'
import { habitatLocal } from '@hardocs-project/habitat-client'

export default {
  name: "ProjectsAdmin",
  data: function () {
    return {
      // these are the primary information for a project and its data
      owner: null,
      project: null,
      projectData: null, // expected connect to Vuex
      dbDisplay: null, // temporary measure, to first view

      // where we can indicate issues to screen
      opsDisplay: null,
      remoteDbBase: 'https://hd.narrationsd.com/hard-api',
      remoteDb: 'https://hd.narrationsd.com/hard-api/monkeys'
    }
  },
  mounted () {
    this.preloadDummyProjectInfo()
  },
  methods: {
    checkStatus: function (dbUrl) {
      this.clearPanels()
      console.log ('checking db status')
      // *todd* not yet a business, has to be a promise for others, local
      habitatDb.getStatusOfDb(dbUrl)
        .then (result => {
          console.log('checkStatus: ' + JSON.stringify(result))
          this.opsDisplay = 'Db Status: ' + JSON.stringify(result)
        })
        .catch(err => {
          console.log('checkStatus:error: ' + err)
          this.opsDisplay = 'Check Db Status: error: ' + err
        })
    },
    createProjects: function () {
      this.clearPanels()
      this.logOutClear()
      habitatDb.getStatusOfDb(this.remoteDbd)
        .then (result => {
          console.log('checkStatus: ' + JSON.stringify(result))
          this.opsDisplay = 'Db Status: ' + JSON.stringify(result)
        })
        .catch(err => {
          console.log('logging in because: '+ err)
          habitatLocal.showModalPage(this.remoteDbBase + '/sign_in')
        })

      // console.log ('loading owner: ' + this.owner + ', project: ' + this.project)
      // this.dbDisplay = 'app is loading project owner: ' +
      //   this.owner + ', project: ' + this.project
      //
      // habitatDb.loadFromDatabase()
      //   .then(result => {
      //     console.log('loaded Project: ' + JSON.stringify(result))
      //     this.projectData = result.data
      //     this.dbDisplay = 'From Hardocs Project <' + this.owner + ':' + this.project +
      //       '>, app has loaded: '+ JSON.stringify(this.projectData)
      //   })
      //   .catch(err => {
      //     this.opsDisplay = JSON.stringify(err)
      //     this.opsDisplay = 'load project: error: ' + err
      //   })
    },
    listProjects: function () {
      this.clearPanels()
      // console.log('original cookies: ' + this.cookies)
      // try {
      //   deleteNodeCookies(this.cookies)
      // }
      // catch (e) {
      //   console.log('deleteCookies: ' + e)
      // }

      // listOwnerProjects('hardOwner')
      habitatDb.listOwnerProjects('hardOwner', this.remoteDbUrl)
        .then(result => {
          this.dbDisplay = JSON.stringify(result)
          this.opsDisplay = 'this is not real yet - just listing any records owner can reach - monkeys db'
        })
        .catch(err => {
          this.opsDisplay = err
        })
    },
    adminProjects: function () {
      this.clearPanels()
      console.log ('clearing database... ')

      habitatDb.clearDatabase()
        .then(result => {
          console.log('adminProjects: result: ' + JSON.stringify(result))
          this.opsDisplay = 'Cleared Entire Hardocs database (we won\'t have this ' +
            'in real Hardocs!): ' + JSON.stringify(result)
        })
        .catch(err => {
          console.log('adminProjects:error: ' + err)
          this.opsDisplay = 'clear database: ' + err
        })
    },
    logOutClear: function () {
      habitatLocal.getNodeCookies()
        .then (result => {
          this.cookies = result
          this.opsDisplay = 'Node Cookies: ' + JSON.stringify(result)
          return result
        })
        .then (result => {
          habitatLocal.deleteNodeCookies(result)
        })
        .catch(err => {
          const msg = 'logOutClear:error: ' + err
          this.opsDisplay = msg
          console.log(msg)
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
    ProjectsAdminOpsButtons,
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
