<template>
  <div>
    <div class="w-full bg-title">
    <h2 class="text-json">Buttons With Actions -- try one...</h2>
    </div>
    <hr>
    <ProjectsAdminOpsButtons
      v-on:adminOwners="adminOwners"
      v-on:listLocalProjects="listLocalProjects"
      v-on:listRemoteProjects="listRemoteProjects"
      v-on:replicateDb="replicateDb"
      v-on:adminProjects="adminProjects"
      v-on:clearLocalProjects="clearLocalProjects"
      v-on:logOutRemote="logOutRemote"
    />
    <div v-if="dbDisplay" class="bg-display text-white">
      {{ dbDisplay }}
    </div>
    <div v-if="opsDisplay" class="bg-display text-white">
      {{ opsDisplay }}
    </div>
    <div v-if="adminOwnersForm">
      <div class="w-full max-w-xs">
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
              Owner
            </label>
            <input v-model="owner" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
              leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="owner-identity">
          </div>
          <div class="flex items-center justify-between">
            <button @click="createOwner" :style="createStyle" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Create Owner
            </button>
            <button v-if="ownerExists" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Delete Owner
            </button>
          </div>
        </form>
      </div>
    </div>
    <div v-if="adminProjectsForm">
        <div class="w-full max-w-xs">
          <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                Ownership
              </label>
              <input v-model="owner" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
              leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="owner-identity">
            </div>
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="project">
                Project
              </label>
              <input v-model="project" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
              leading-tight focus:outline-none focus:shadow-outline" type="text" id="project" placeholder="project-name">
              <p v-if="!projectExists" class="text-red-500 text-xs italic">Please choose a project name (can have dashes, no colons).</p>
            </div>
            <div class="flex items-center justify-between">
              <button v-if="projectExists" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
                Load Project
              </button>
              <button v-else class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
                Create Project
              </button>
              <button v-if="projectExists" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
                Delete Project
              </button>
            </div>
          </form>
        </div>
    </div>
  </div>
</template>

<script>

import ProjectsAdminOpsButtons from '@/components/ProjectsAdminOpsButtons'
import { habitat, habitatLocal, habitatDb } from '@hardocs-project/habitat-client'

export default {
  name: "ProjectsAdmin",
  data: function () {
    return {
      // these are the primary information for a project and its data
      loginIdentity: 'not logged in',
      owner: null,
      ownerExists: false,
      project: null,
      projectExists: true,
      projectData: null, // expected connect to Vuex
      dbDisplay: null, // temporary measure, to first view

      // where we can indicate issues to screen
      opsDisplay: null,
      // remoteDb: 'localhost:5984',
      remoteDb: 'https://hd.narrationsd.com/hard-api/hardocs-projects',

      // control of forms
      adminOwnersForm: false,
      adminProjectsForm: false,
      isOwner: false
    }
  },
  mounted () {
    this.preloadDummyProjectInfo()
  },
  computed: {
    createStyle: function () {
      return this.isOwner
        ? {
          color: 'red !important',
          opacity: '50%'
        }
        : {
          color: 'yellow !important'
        }
    }
  },
  methods: {
    checkStatus: function (dbUrl) {
      this.clearPanels()
      console.log('checking db status')
      // *todd* not yet a business, has to be a promise for others, local
      habitatDb.getStatusOfDb(dbUrl)
        .then(result => {
          console.log('checkStatus: ' + JSON.stringify(result))
          this.opsDisplay = 'Db Status: ' + JSON.stringify(result)
        })
        .catch(err => {
          this.showError('Check Db Status', err)
        })
    },
    checkOwner: function (identity) {
      // will be promise
      // use to dim/enable button
      // this probably doesn't want to be hit every time as it calls habitat
      // so, when? checkOwner button
      console.log('checking owner')
      const result = habitat.doRequest('db-exists/'
        + encodeURIComponent(`${identity}`))
      this.opsDisplay = result.msg
      return result.isOwner
    },
    adminOwners: function () {
      this.clearPanels()
      this.adminOwnersForm = true
      habitat.assureRemoteLogin(this.remoteDb)
        .then(result => {
          this.opsDisplay = result.msg
        })
        .then(() => {
          // will be promise habitat.cloudRequest
          this.loginIdentity = habitatDb.doRequest('get-login-identity').identity
          this.owner = this.loginIdentity
          this.isOwner = this.checkOwner(this.loginIdentity)
          console.log('id: '  + this.loginIdentity + ', is owner: ' + this.isOwner)
          this.dbDisplay = this.isOwner ? ('Owner: ' + this.owner) : 'not owner yet'
        })
        .catch(err => {
          this.showError('adminOwners', err)
        })
    },
    createOwner: function () {
      console.log('create owner: ' + this.loginIdentity)
      // it will, however, be a promise
      const result = habitat.doRequest('create-owner/'
        + encodeURIComponent(`${this.loginIdentity}`))
      this.opsDisplay = result.msg
    },
    adminProjects: function () {
      this.clearPanels()
      console.log('admin projects... ')
      this.adminProjectsForm = true
      habitat.assureRemoteLogin(this.remoteDb)
        .then(result => {
          this.opsDisplay = result.msg
        })
        .then(() => {
          this.project = 'first-project'
          this.dbDisplay = 'Project: ' + habitatDb.requestHabitat('get-login-identity').identity + ':' + this.project
        })
        .catch(err => {
          this.showError('adminProjects', err)
        })
    },
    listLocalProjects: function () {
      this.clearPanels()
      const localDb = 'hardocs-projects'
      habitatDb.listOwnerProjects('hardOwner', localDb)
        .then(result => {
          console.log('listLocalProjects: ' + JSON.stringify(result))
          this.dbDisplay = JSON.stringify(result)
          this.opsDisplay = 'this is not real yet - just listing any records ' +
            'owner can reach - ' + localDb + ' db'
        })
        .catch(err => {
          this.showError('listLocalProjects', err)
        })
    },
    clearLocalProjects: function () {
      this.clearPanels()
      console.log('clearing local database... ')

      habitatDb.clearDatabase()
        .then(result => {
          console.log('adminProjects: result: ' + JSON.stringify(result))
          this.opsDisplay = 'Cleared Entire Hardocs database (we won\'t have this ' +
            'in real Hardocs!): ' + JSON.stringify(result)
        })
        .catch(err => {
          this.showError('clearLocalProjects', err)
        })
    },
    listRemoteProjects: function () {
      this.clearPanels()
      habitat.assureRemoteLogin(this.remoteDb)
        .then(() => {
          return habitatDb.listOwnerProjects('hardOwner', this.remoteDb)
        })
        .then(result => {
          console.log('listLocalProjects: ' + JSON.stringify(result))
          this.dbDisplay = JSON.stringify(result)
          this.opsDisplay = 'this is not real yet - just listing any records ' +
            'owner can reach - ' + this.remoteDb + ' db'
        })
        .catch(err => {
          this.showError('listRemoteProjects', err)
        })
    },
    replicateDb: function () {
      this.clearPanels()
      const cloudDb = this.remoteDb
      const localDb = 'hardocs-projects'
      console.log('replicateDb projects from ' + cloudDb + ' to ' + localDb + '... ')
      // *todo* look very carefully into consequences of both checkpoint settings below,
      // but also the thing they save from, the odd nature of the 404 setting off CORS
      habitat.assureRemoteLogin(this.remoteDb)
        .then(() => {
          return habitatDb.replicateDatabase(cloudDb, localDb)
        })
        .then(result => {
          console.log('replicateDb:down:result: ' + JSON.stringify(result))
          this.dbDisplay = 'down: ' + JSON.stringify(result)
        })
        .then(() => {
          return habitatDb.replicateDatabase(localDb, cloudDb)
        })
        .then(result => {
          console.log('replicateDb:up:result: ' + JSON.stringify(result))
          this.dbDisplay += ', up: ' + JSON.stringify(result)
          this.opsDisplay = 'this is not real yet - just listing any records ' +
            'owner can reach - ' + cloudDb + ' db'
        })
        .catch(err => {
          this.showError('replicateDb from ' +
            cloudDb + ' to ' + localDb, err)
        })

    },
    logOutRemote: function () {
      this.clearPanels()
      habitatLocal.getNodeCookies()
        .then(result => {
          this.cookies = result
          this.opsDisplay = 'Node Cookies: ' + JSON.stringify(result)
          return result
        })
        .then(result => {
          habitatLocal.deleteNodeCookies(result)
        })
        .catch(err => {
          this.showError('logOutRemote', err)
        })
    },
    showError: function (action, err) {
      const msg = `${action}:error: ` + err
      this.opsDisplay = msg
      console.log(msg)
    },
    clearPanels: function () {
      this.opsDisplay = ''
      this.dbDisplay = ''
      this.adminOwnersForm = false
      this.adminProjectsForm = false
    },
    preloadDummyProjectInfo: function (marker) {
      // *todo* for the moment, this is dummy data. Soon we'll add it normally, then find with view
      this.owner = 'hardOwner'
      this.project = 'firstProject'
      this.projectData = {
        docs: [
          {doc1: 'doc1 text we will see'},
          {doc2: 'doc2 text we will also see'},
        ],
        metadata: {
          meta1: 'meta1 data',
          meta2: 'meta2 data',
          marker: marker
        },
        imgs: [
          {name: 'img1', data: 'image1data', type: 'jpg'},
          {name: 'img2', data: 'image2data', type: 'jpg'},
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
