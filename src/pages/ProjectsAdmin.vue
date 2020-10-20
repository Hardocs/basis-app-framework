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
            <label class="block text-gray-700 text-sm font-bold mb-2" for="identity">
              Validated Identity
            </label>
            <input v-model="loginIdentity" id="identity" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
              leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="owner-identity">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="owner-name">
              Projects Owner
            </label>
            <input v-model="ownerName" id="owner-name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
              leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="project-owner-name">
          </div>
          <div class="flex items-center justify-between">
            <button @click="initializeHabitat" :style="createStyle" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Initialize Habitat
            </button>
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
              <label class="block text-gray-700 text-sm font-bold mb-2" for="our-owner">
                Ownership
              </label>
              <input v-model="owner" id="our-owner" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
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
              <button v-else @click="createProject" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
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
import { habitatCloud, habitatLocal, habitatDb } from '@hardocs-project/habitat-client'

export default {
  name: "ProjectsAdmin",
  data: function () {
    return {
      // these are the primary information for a project and its data
      loginIdentity: 'not logged in',
      ownerName: null,
      owner: null,
      ownerExists: false,
      project: null,
      projectExists: false,
      projectData: null, // expected connect to Vuex
      dbDisplay: null, // temporary measure, to first view

      // where we can indicate issues to screen
      opsDisplay: null,
      // *todo* REVISE how this works, to a current db, or an _all_dbs, or habitat-request,
      // *todo* also consider how initiate is going to use it...or not...
      // remoteDb: 'localhost:5984',
      remoteDb: 'https://hd.narrationsd.com/hard-api/habitat-projects',
      remoteUrl: 'https://hd.narrationsd.com/hard-api',

      // control of forms
      adminOwnersForm: false,
      adminProjectsForm: false,
      isAgent: false
    }
  },
  mounted () {
    this.preloadDummyProjectInfo()
  },
  computed: {
    createStyle: function () {
      return this.isAgent
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
      console.log ('checkOwner: ' + identity)
      return false // *todo* until habitat can actually do it

      // *todo* this is now looking wrong several ways - ck intent, reformulate to
      // match advancing habitat design.

      // will be promise
      // use to dim/enable button
      // this probably doesn't want to be hit every time as it calls habitat
      // so, when? checkOwner button
      // console.log('checking owner')
      // const result = habitatCloud.doRequest('db-exists/'
      //   + encodeURIComponent(`${identity}`))
      // this.opsDisplay = result.msg
      // return result.isAgent
    },
    adminOwners: function () {
      this.clearPanels()
      this.adminOwnersForm = true
      console.log ('A this.remoteDb: ' + this.remoteDb)
      habitatCloud.assureRemoteLogin(this.remoteDb)
        .then(result => {
          this.opsDisplay = result.msg
        })
        .then (() => {
          console.log ('B this.remoteUrl: ' + this.remoteUrl)
          return  habitatCloud.doRequest('get-login-identity', this.remoteUrl)
        })
        .then (result => {
          console.log('C - identity: ' + JSON.stringify(result))
          this.loginIdentity = result.identity
          this.isAgent = this.checkOwner(this.loginIdentity)
          console.log('id: '  + this.loginIdentity + ', is owner: ' + this.isAgent)
          this.dbDisplay = this.isAgent ? ('Owner: ' + this.owner) : 'not agent yet'
        })
        .catch(err => {
          this.showError('adminOwners', err)
        })
    },
    createOwner: function () {
      this.isAgent = true // *todo*
      if (!this.isAgent) {
        this.opsDisplay = 'Sorry, ' + this.loginIdentity +
          ' isn\'t an agent, thus permitted to create Project Owners...'
        return
      }

      console.log('create owner: ' + this.ownerName + ' via agent: ' + this.loginIdentity)
      habitatCloud.assureRemoteLogin(this.remoteDb)
      .then (() => {
        return habitatCloud.doRequest(
          'create-owner',
          this.remoteUrl,
          { owner: this.ownerName, agent: this.loginIdentity }
        )
      })
      // .then (result => {
      //   // *todo* replicate the initialized db down here??
      // })
      .then(result => {
        if (result.ok) {
          this.ownerExists = true
          this.dbDisplay = 'Owner ' + this.ownerName + ' created'
        }
        this.opsDisplay = result.msg
      })
      .catch(err => {
        this.showError('createOwner', err.msg)
      })
    },
    adminProjects: function () {
      this.clearPanels()
      console.log('admin projects... ')
      this.adminProjectsForm = true
      console.log ('A this.remoteDb: ' + this.remoteDb)
      habitatCloud.assureRemoteLogin(this.remoteDb)
        .then(result => {
          this.opsDisplay = result.msg
        })
        .then (() => {
          console.log ('B this.remoteDb: ' + this.remoteDb)
          return  habitatCloud.getLoginIdentity(this.remoteDb)
        })
        .then (result => {
          this.loginIdentity = result
        })
        .then(() => {
          this.project = 'first-project'
          this.dbDisplay = 'Project: ' + habitatDb.requestHabitat('get-login-identity').identity + ':' + this.project
        })
        .catch(err => {
          this.showError('adminProjects', err)
        })
    },
    createProject: function () {
      if (this.isAgent) {
        // inactive
        return
      }

      console.log('create project: ' + this.loginIdentity)
      habitatCloud.assureRemoteLogin(this.remoteDb)
        .then (() => {
          return habitatCloud.doRequest(
            'create-project',
            this.remoteUrl,
            { owner: this.ownerName, agent: this.loginIdentity }
            )
        })
        // .then (result => {
        //   // *todo* replicate the initialized project down here??
        // })
        // *todo* when implementing, can be not agent, or project already, or? better way needed
        .then(result => {
          if (result.ok) {
            this.isAgent = true
            // *todo* make these reactive, rather soon!
            this.ownerExists = true
            this.dbDisplay = this.isAgent ? ('Owner: ' + this.owner) : 'not agent yet'
          }
          this.opsDisplay = result.msg
        })
        .catch(err => {
          this.showError('createProject', err.msg)
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
      // *todo* this goes out or becomes doRemote as we move into designed cloud
      this.clearPanels()
      habitatCloud.assureRemoteLogin(this.remoteDb)
        .then(() => {
          return habitatDb.listOwnerProjects('hardOwner', this.remoteDb)
        })
        .then(result => {
          console.log('listRemoteProjects: ' + JSON.stringify(result))
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
      habitatCloud.assureRemoteLogin(this.remoteDb)
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
    initializeHabitat: function () {
      this.clearPanels()
      console.log('initializing Habitat...')

      habitatCloud.assureRemoteLogin(this.remoteDb)
        .then(result => {
          this.opsDisplay = result.msg
          return
        })
        .then(() => {
          console.log('headed for initialize')
          const result = habitatCloud.doRequest('initialize-cloud', this.remoteUrl)
          console.log('type of doRequest result: ' + typeof result)
          return result
        })
        .then(result => {
          console.log('back from initializeHabitat: ' + JSON.stringify(result))
          this.dbDisplay = 'Initializing Cloud: '
            + JSON.stringify(result)
          console.log('initializeHabitat', JSON.stringify(result))
        })
        .catch(err => {
          this.showError('initializeHabitat', err)
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
      // an essential, so we don't need to know which form comes
      err = typeof err !== 'string' ? JSON.stringify(err) : err
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
