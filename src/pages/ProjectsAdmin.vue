<template>
  <!-- *todo* this just cries for components :) - do we fix test gear?? -->
  <div>
    <div class="w-full bg-title">
    <h2 class="text-json">Buttons With Actions -- try one...</h2>
    </div>
    <hr>
    <ProjectsAdminOpsButtons
      v-on:adminLocale="adminLocale"
      v-on:adminProjects="adminProjects"
      v-on:interactWithProject="interactWithProject"
      v-on:updateProjectToCloud="updateProjectToCloud"
      v-on:listLocalProjects="listLocalProjects"
      v-on:listRemoteProjects="listRemoteProjects"
      v-on:clearLocalProjects="clearLocalProjects"
      v-on:publishProject="publishProject"
      v-on:tryGql="tryGql"
      v-on:logOutRemote="logOutRemote"
    />
    <div v-if="dbDisplay" class="bg-display html-data text-white">
      <span v-html="dbDisplay"></span>
    </div>
    <div v-if="opsDisplay" class="bg-display html-data text-white">
      <span v-html="opsDisplay"></span>
    </div>
    <div v-if="adminLocaleForm">
      <div class="w-full max-w-xs">
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="identity">
              Validated Identity
            </label>
            <input v-model="loginIdentity" id="identity" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
              leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="locale-identity">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="locale-name">
              Projects Locale
            </label>
            <input v-model="locale" id="locale-name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
              leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="project-locale-name">
            <p v-if="!localeExists" class="text-red-500 text-xs italic">Please choose a locale name (can have dashes, no colons).</p>
          </div>
          <div class="flex items-center justify-between">
            <button @click="initializeHabitat" :style="warnOrGreyStyle" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Initialize Habitat
            </button>
            <button @click="createLocale" :style="warnOrGreyStyle" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Create Locale
            </button>
            <button @click="deleteLocale" :style="warnOrGreyStyle" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Delete Locale
            </button>
<!--            <button v-if="true ||localeExists" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Delete Locale
            </button>-->
          </div>
        </form>
      </div>
    </div>
    <div v-if="adminProjectsForm">
      <div class="w-full max-w-xs">
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="admin-locale">
              Locale
            </label>
            <input v-model="locale" id="admin-locale" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
              leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="locale-identity">
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
            <div v-if="projectExists">
              <!-- this is truly where delete goes -->
              <button @click="deleteProject" :style="warnOrGreyStyle" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
                Delete Project
              </button>
            </div>
            <button v-else @click="createProject" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Create Project
            </button>
            <!-- *todo* when we check exists...another Cloud ability tbd...delete moves to note above... -->
            <button @click="deleteProject" :style="warnOrGreyStyle" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Delete Project
            </button>
          </div>
        </form>
      </div>
    </div>
    <div v-if="interactWithProjectForm">
      <div class="flex mb-4 h-full">
        <form class="w-1/2 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div class="flex mb-4 end row">
            <label class="label-spacing block text-gray-700 text-sm font-bold mb-2" for="our-locale">
              Locale:
            </label>
            <input v-model="locale" id="our-locale" class="flex shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
              leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="locale-identity">
          </div>
          <div class="flex mb-6 row">
            <label class="label-spacing block text-gray-700 text-sm font-bold mb-2" for="project">
              Project:
            </label>
            <input v-model="project" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
              leading-tight focus:outline-none focus:shadow-outline" type="text" id="project" placeholder="project-name">
          </div>
          <p class="v-spaced-below">normal operations:</p>
          <div class="flex items-center justify-around">
            <button @click="loadCloudProjectLatest" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Load Latest Cloud Project
            </button>
            <button @click="loadLocalProject" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Load Local Project
            </button>
          </div>
          <div class="flex items-center justify-around v-spaced">
            <button @click="storeProjectLocally" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Store Edited Project Locally
            </button>
            <button @click="updateProjectToCloud" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Update Project to Cloud
            </button>
          </div>
          <p class="v-spaced">resolve validation only:</p>
          <div class="flex items-center justify-around v-spaced">
            <button @click="loadUnresolvedCloudProject" class="xbtn-limit bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Load from Cloud without Resolve
            </button>
          </div>
        </form>
        <div class="w-1/2 bg-gray-500 h-12 px-2 border-l-2 border-gray-600 h-full">
          <!-- we don't need show-btns because v-model accomplishes instant save -->
          <vue-json-editor v-model="projectData"
                           :show-btns="false"
                           :expandedOnStart="true"
          >
          </vue-json-editor>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import ProjectsAdminOpsButtons from '@/components/ProjectsAdminOpsButtons'
import { habitatCloud, habitatLocal, habitatDb } from '@hardocs-project/habitat-client'
import prettyJson from 'prettyprintjs'
import VueJsonEditor from 'vue-json-editor'

export default {
  name: "ProjectsAdmin",
  data: function () {
    return {
      // these are the primary information for a project and its data
      loginIdentity: 'not logged in',
      locale: null,
      localeExists: false,
      project: null,
      projectMember: null,
      projectExists: false,
      projectData: null, // expected connect to Vuex
      dbDisplay: null, // temporary measure, to first view
      jsonEditor: null, // for project update exercise

      // where we can indicate issues to screen
      opsDisplay: null,
      // *todo* REVISE how this works, to a current db, or an _all_dbs, or habitat-request,
      // *todo* also consider how initiate is going to use it...or not...
      cloudDb: 'https://hd.narrationsd.com/hard-api/habitat-projects',
      remoteUrl: 'https://hd.narrationsd.com/hard-api',
      localDb: 'habitat-projects',

      // control of forms
      adminLocaleForm: false,
      adminProjectsForm: false,
      interactWithProjectForm: false,
      isAgent: false,

      // testing
      testCount: 0,
    }
  },
  mounted () {
    this.preloadDummyProjectInfo()
  },
  computed: {
    warnOrGreyStyle: function () {
    // *todo* this depends on what we decide about informing on the client, tbd
    // *todo* very probably a direct r-u-permitted on the action cloud returned
    // *todo* though actually hard-coded style may do it. But we have the ability...
      return this.isAgent
        ? {
          color: 'red !important',
        }
        : {
          color: 'yellow !important',
          opacity: '50%'
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
          this.showCmdError('Check Db Status', err)
        })
    },
    checkRole: function (role) {
      return habitatCloud.doRequest('checkRoles', this.remoteUrl)
        .then (result => {
          console.log ('checkRole returns: ' + JSON.stringify(result) + ', for check: ' + role)
          return result.msg === role
        })
        .catch(err => {
          this.showCmdError('Check Db Status', err)
        })
    },
    checkLocale: function (identity) {
      console.log ('checkLocale: ' + identity)
      return false // *todo* until habitat can actually do it

      // *todo* this is now looking wrong several ways - ck intent, reformulate to
      // match advancing habitat design.

      // will be promise
      // use to dim/enable button
      // this probably doesn't want to be hit every time as it calls habitat
      // so, when? checkLocale button
      // console.log('checking locale')
      // const result = habitatCloud.doRequest('dbExists/'
      //   + encodeURIComponent(`${identity}`))
      // this.opsDisplay = result.msg
      // return result.isAgent
    },
    adminLocale: function () {
      this.clearPanels()
      this.adminLocaleForm = true
      this.setUpForCloudActions()
    },
    createLocale: function () {
      this.clearDisplays()
      if (!this.isAgent) {
        this.opsDisplay = 'Sorry, ' + this.loginIdentity +
          ' isn\'t an agent, thus isn\'t permitted to create Locales...'
        return
      }

      console.log('create locale: ' + this.locale + ' via identity: ' + this.loginIdentity)
      habitatCloud.assureRemoteLogin()
        .then (() => {
          return habitatCloud.doRequest(
            'createLocale',
            this.remoteUrl,
            { locale: this.locale } // identity check is properly in cloud
          )
        })
        .then(result => {
          if (result.ok) {
            this.localeExists = true
            this.dbDisplay = 'Locale ' + this.locale + ' created'
          }
          this.opsDisplay = result.msg
        })
        .catch(err => {
          this.showCmdError('createLocale', err.msg)
        })
    },
    deleteLocale: function () {
      this.clearDisplays()
      // *todo* better this is isPermitted of some kind, for example of  this
      //  *todo* case may be superAgent. isPermitted could query the cloud auth now...
      if (!this.isAgent) {
        this.opsDisplay = 'Sorry, ' + this.loginIdentity +
          ' isn\'t an agent, thus isn\'t permitted to delete Locales...'
        return
      }

      // *todo* !!! BE SURE to hold this off with an are-you-sure modal!!!
      console.log('delete locale: ' + this.locale + ' via identity: ' + this.loginIdentity)
      habitatCloud.assureRemoteLogin()
        .then (() => {
          return habitatCloud.doRequest(
            'deleteLocale',
            this.remoteUrl,
            { locale: this.locale } // identity check is properly in cloud
          )
        })
        .then(result => {
          if (result.ok) {
            this.localeExists = true
            this.dbDisplay = 'Locale ' + this.locale + ' deleted'
          }
          this.opsDisplay = result.msg
        })
        .catch(err => {
          this.showCmdError('deleteLocale', err.msg)
        })
    },
    setUpForCloudActions: function () {
      habitatCloud.assureRemoteLogin()
        .then(() => {
          // .then(result => {
          // *todo* see plan related
          this.opsDisplay = 'Logged in to Habitat Cloud'  // result.msg
        })
        .then(() => {
          return habitatCloud.doRequest('getLoginIdentity', this.remoteUrl)
        })
        .then(result => {
          // *todo* this is all wrong at present: we determine authorization only
          // *todo* on the server, and will tell it from there. Identity is available
          // *todo* in future call for use here, but is hard-determined on server
          // *todo* for ids and commands, so that no forgery is possible. No matter
          // *todo* what is tried, your db-affecting data like keys will always be you.
          console.log('identity: ' + JSON.stringify(result))
          this.loginIdentity = result.identity
          this.isAgent = this.checkRole('agent')
          console.log('id: ' + this.loginIdentity + ', is agent: ' + this.isAgent)
          this.dbDisplay = this.isAgent ? ('Locale: ' + this.locale) : 'not agent yet'
          return result.identity
        })
        .then(result => {
          this.project = 'your-project'
          this.dbDisplay = 'Actions identity: ' + result
        })
        .catch(err => {
          this.showCmdError('adminProjects', err)
        })
    },
    adminProjects: function () {
      this.clearPanels()
      console.log('adminProjects:remoteDb: ' +  this.cloudDb)
      this.adminProjectsForm = true
      this.setUpForCloudActions()
   },
    interactWithProject: function () {
      this.clearPanels()
      this.interactWithProjectForm = true
      this.projectData = { projectName: 'dummy', projectMeta: 'some meta'}
      this.setUpForCloudActions()
    },
    loadLocalProject: function () {
      this.clearDisplays()
      console.log('loadLocalProject from: ' + this.locale + ':' + this.project)

      habitatDb.loadProjectObject(this.locale, this.project, this.loginIdentity)
        .then (result => {
          console.log('loadLocalProject:result: ' + JSON.stringify(result))
          this.projectData = result.data // error will throw for catch
          this.dbDisplay = 'OK - ' + result.msg + ' locally, '
          this.opsDisplay = 'for: ' + result.data._id
        })
        .catch(err => {
          this.showCmdError('loadLocalProject', err)
        })
    },
    loadCloudProjectLatest: function () {
      this.clearDisplays()
      console.log('cloud loadProjectLatest from: ' + this.locale + ':' + this.project)

      habitatCloud.assureRemoteLogin()
        .then(() => {
          return  habitatCloud.doRequest('loadProjectResolve', this.remoteUrl,
            {
              locale: this.locale,
              project: this.project,
              identity: this.identity,
              options: { resolveMode: 'latestWins' }
            }
          )
        })
        .then (result => {
          console.log('loadProjectLatest:result: ' + JSON.stringify(result))
          this.projectData = result.data
          const msg = 'Ok - ' + result.msg + ', for : ' + this.projectData._id
          this.dbDisplay = msg

          // always store project to local db -- it's the completion of request,
          // keeping all current, using a call which does _not_ update the rev, thus
          // the pattern of our CouchDB-compatible, necessarily sans-replication design

          return habitatDb.storeProjectObjectSameRev(this.projectData, this.localDb)
        })
        .then (result => {
          this.opsDisplay = result.msg + ' locally '
        })
        .catch(err => {
          this.showCmdError('loadProjectLatest', err)
        })
    },
    loadUnresolvedCloudProject: function () {
      this.clearDisplays()
      console.log('cloud loadUnresolvedCloudProject from: ' + this.locale + ':' + this.project)

      habitatCloud.assureRemoteLogin()
        .then(() => {
          return  habitatCloud.doRequest('loadProjectUnresolved', this.remoteUrl,
            {
              locale: this.locale,
              project: this.project,
              identity: 'no identities now',
              options: { conflicts: true }
            }
          )
        })
        .then (result => {
          console.log (result.msg)
          this.projectData = result.data
          const msg = 'Ok - ' + result.msg + ', from Habitat Cloud for : ' + this.projectData._id
          this.dbDisplay = msg
          return this.projectData
        })
        .then (projectData => {
          // we need to save the result to the local db, *without* changing the rev.
          // this is to make visible why we do the other half of our conflict-reaolving
          // pattern, instead of replication, for both activity and security reasons
          return habitatDb.storeProjectObjectSameRev(projectData, this.localDb)
        })
        .then (result => {
          this.opsDisplay = result.msg + ' locally'
        })
        .catch(err => {
          this.projectData = { no: 'data' }
          this.showCmdError('loadProjectLatest', err)
        })
    },
    storeProjectLocally: function () {
      this.clearDisplays()
      console.log('storeProjectLocally in local db to: ' + this.locale + ':' + this.project)

      // you MUST have this local method and use it in the call,
      // in the updateProject.bind(this) form, as the example shows

      function updateProject (result) {
        // these two assigns are CRUCIAL: we need the rev _and_ the timestamp
        // updated to the in-memory projectData after the save, to make
        // conflict resolution operable, for any stage of its possibilities

        this.projectData._rev = result.rev // critical
        this.projectData.timestamp = result.timestamp // critical also

        // n.b. the result at this point uses id and rev, not _id and _rev
      }

      habitatDb.storeProjectObject (
        this.projectData,
          updateProject.bind(this),  // always with the .bind(this)
          this.localDb)
        .then (result => {
          console.log('storeProjectLocally:result: ' + JSON.stringify(result))
          this.dbDisplay = 'Ok - ' + result.msg + ', for id: ' +
            result.data.id + ', '
          this.opsDisplay = 'with new rev: ' + result.data.rev
        })
        .catch(err => {
          this.showCmdError('storeProjectLocally', err)
        })
    },
    updateProjectToCloud: function () {
      this.clearDisplays()
      let step = 'begin updateProjectToCloud'
      console.log('updateProjectToCloud locale: ' + this.locale + ':' + this.project)

      habitatCloud.assureRemoteLogin()
        .then(() => {
          this.opsDisplay = 'Logged in to Habitat Cloud'  // result.msg
        })
        .then (() => {
          if(!this.projectData.details) {
            throw new Error ('Local Hardocs Project not present yet to update from!')
          }
          step = 'update HabitatProject to: ' + this.cloudDb
          return habitatCloud.doRequest('updateProject',
            this.remoteUrl,
            {
              locale: this.locale,
              project: this.project,
              projectData: this.projectData,
              options: {} // cloud will handle the primary itself
            }
          )
        })
      .then (result => {
          console.log('updateProjectToCloud:result: ' + JSON.stringify(result))
          this.dbDisplay = 'Ok - ' + result.msg + ','
            this.opsDisplay = 'for : ' + this.projectData._id
        })
        .catch(err => {
          this.showCmdError('updateProjectToCloud:' + step, err)
        })
    },
    createProject: function () {
      this.clearDisplays()
      if (!this.isAgent) {
        this.opsDisplay = 'Sorry, ' + this.loginIdentity +
          ' isn\'t an agent, thus isn\'t permitted to create Project...'
        return
      }
      console.log('app:create project: ' + this.project +
        ', locale: ' + this.locale + ', identity: ' + this.loginIdentity)
      habitatCloud.assureRemoteLogin()
        .then (() => {
          return habitatCloud.doRequest(
            'createProject',
            this.remoteUrl,
            {  // actual securely validated identity required, and properly done in cloud
              locale: this.locale,
              project: this.project,
            }
          )
        })
        .then(result => {
          // *todo* another .then to download the initialized project to local here??
          // *todo* if implementing, can be not agent, or project already, or? better way needed
          if (result.ok) {
            this.isAgent = true
            // *todo* any reactivity question, either of these here?
            this.localeExists = true
          }
          this.opsDisplay = result.msg
        })
        .catch(err => {
          this.showCmdError('createProject', err.msg)
        })
    },
    deleteProject: function () {
      this.clearDisplays()
      // *todo* cloud will just indicate not implemented for now...
      if (!this.isAgent) {
        this.opsDisplay = 'Sorry, ' + this.loginIdentity +
          ' isn\'t an agent, thus isn\'t permitted to delete Project...'
        return
      }

      // *todo* !!! BE SURE to hold this off with an are-you-sure modal!!!

      console.log('app:delete project: ' + this.project +
        ', locale: ' + this.locale + ', identity: ' + this.loginIdentity)
      habitatCloud.assureRemoteLogin()
        .then (() => {
          return habitatCloud.doRequest(
            'deleteProject',
            this.remoteUrl,
            {  // identity check is properly in cloud
              locale: this.locale,
              project: this.project,
            }
          )
        })
        // .then (result => {
        //   // *todo* delete the initialized project down here also...all identities
        //   // *todo* this will be via habitatDb, so a separate call you must make
        // })
        // *todo* when implementing, can be not agent, or project already, or? better way needed
        .then(result => {
          if (result.ok) {
            this.isAgent = true
            // *todo* make these reactive, rather soon!
            this.localeExists = true
          }
          this.opsDisplay = result.msg
        })
        .catch(err => {
          this.showCmdError('deleteProject', err.msg)
        })
    },
    listLocalProjects: function () {
      this.clearPanels()
      habitatDb.listLocaleProjects('hardLocale', this.localDb)
        .then(result => {
          console.log('listLocalProjects: ' + JSON.stringify(result))
          this.dbDisplay = this.$htmlJson(result)
          this.opsDisplay = 'this is not real yet - just listing any records ' +
            'locale can reach - ' + this.localDb + ' db'
        })
        .catch(err => {
          this.showCmdError('listLocalProjects', err)
        })
    },
    clearLocalProjects: function () {
      this.clearPanels()
      console.log('clearing local database... ')

      habitatDb.clearDatabase(this.localDb)
        .then(result => {
          console.log('adminProjects: result: ' + JSON.stringify(result))
          this.opsDisplay = 'Cleared Entire Hardocs database (we won\'t have this ' +
            'in real Hardocs!): ' + JSON.stringify(result)
        })
        .catch(err => {
          this.showCmdError('clearLocalProjects', err)
        })
    },
    listRemoteProjects: function () {
      // *todo* this goes out or becomes doRemote as we move into designed cloud
      this.clearPanels()
      habitatCloud.assureRemoteLogin()
        .then(() => {
          return habitatDb.listLocaleProjects('hardLocale',  this.cloudDb)
        })
        .then(result => {
          console.log('listRemoteProjects: ' + JSON.stringify(result))
          this.dbDisplay = this.$htmlJson(result)
          this.opsDisplay = 'this is not available at present - revising for indirect api: ' + this.cloudDb + ' db'
        })
        .catch(err => {
          this.showCmdError('listRemoteProjects', err)
        })
    },
    initializeHabitat: function () {
      this.clearDisplays()
      console.log('initializing Habitat...')

      habitatCloud.assureRemoteLogin()
        .then(result => {
          this.opsDisplay = result.msg
          console.log('headed for initialize')
          return habitatCloud.doRequest('initializeCloud', this.remoteUrl)
        })
        .then(result => {
          this.dbDisplay = 'Initializing Cloud: ' + JSON.stringify(result)
        })
        .catch(err => {
          this.showCmdError('initializeHabitat', err)
        })
    },
    publishProject: function () {
      // *todo* cloud will just indicate not implemented for now...
      this.clearDisplays()
      const requestedStatus = false
      const locale = 'dummy Locale'
      const project = 'dummy Project'
      this.dbDisplay = 'publishProject state requested: ' + requestedStatus

      habitatCloud.assureRemoteLogin()
        .then(result => {
          this.opsDisplay = result.msg
          return habitatCloud.doRequest(
            'publishProject',
            this.remoteUrl,
            {
              status: requestedStatus,
              locale: locale,
              project: project
            }
          )
        })
        .then (result => {
          this.opsDisplay += 'Publish project result: ' + JSON.stringify(result)
        })
        .catch(err => {
          this.showCmdError('publishProject', JSON.stringify(err))
        })
    },
    tryGql: function () {
      this.clearPanels()
      // *todo* test alternates
      // const query = 'query { all { locale project description metadata docs { title content } } }'
      // const query = 'query { item(id: 1) { locale project description metadata docs { title content } } }'
      // const query = 'query { projects(locale: "NSD") { locale project description metadata docs { title content } } }'
      // const query = 'query { project(locale: "NSD", project: "Habitat HD Client") { locale project description metadata docs { title content } } }'
      const query = 'query { projects(locale: "NSD") { locale project description metadata docs { title content } } }'
      // queries below tests for actual db with test project
      // const query = 'query { projects(locale: "delft-lab01") { locale project description metadata docs { title content } } }'
      // const query = 'query { project(locale: "delft-lab01", project: "your-project") { locale project description } }'
      // const query = 'query { project(locale: "delft-lab01", project: "your-project") { _id keys { locale name identity }  locale project description } }'
      // const query = 'query { projects(locale: "delft-lab01") { _id keys { locale name identity }  locale project description } }'
      // const query = 'query { project(locale: "delft-lab01", project: "your-project") { _id keys { locale name } } }'
      // const query = 'query { project(locale: "delft-lab01", project: "your-project") { _id } }'
      this.dbDisplay = 'Gql query: ' + query

      habitatCloud.assureRemoteLogin()
        .then(() => {
          return habitatCloud.doRequest(
            'tryGql',
            this.remoteUrl,
            {query: query})
        })
        .then (result => {
          // with gql, results contain data or its own errors
          // thus, ok is critical to handling, and result is json either waay
          this.opsDisplay = 'Gql result: ' + this.jsonResult(result);
        })
        .catch(err => {
          // our library errors are strings, simple
          this.showCmdError('tryGql', err)
        })
    },
    logOutRemote: function () {
      this.clearPanels()
      habitatLocal.getNodeCookies()
        .then(result => {
          this.cookies = result
          this.opsDisplay = 'Now logged out...'
          return result
        })
        .then(result => {
          habitatLocal.deleteNodeCookies(result)
        })
        .catch(err => {
          this.showCmdError('logOutRemote', err)
        })
    },
    jsonResult: function (result) {
      let screenText
      // *todo* look into this, may be actual format problem
      // if (result.ok) {
        let json = 'no json string'
        json = result.msg
        try {
          json = JSON.parse(result.msg)
        } catch (e) {
          json = e
        }
        screenText = ': (ok: ' + result.ok + '):<br>' +
          prettyJson(json, 4, 'html')
      // } else {
      //   screenText = result.msg
      // }
      return screenText
    },
    onJsonChange (value) {
      console.log('value:', value)
    },
    showCmdError: function (action, err) {
      // an essential, so we don't need to know which form comes
      // if it's not an Error, it's string or JSON
      // we ourselves always throe Errors, but libraries...
      const error = err instanceof Error ? err.stack : JSON.stringify(err)
      const msg = `Error:  ${action}: ` + error
      this.opsDisplay = msg
      console.log(msg)
    },
    clearDisplays: function () {
      console.log ('clearDisplays')
      this.opsDisplay = ''
      this.dbDisplay = ''
    },
    clearPanels: function () {
      console.log ('clearPanels')
      this.adminLocaleForm = false
      this.adminProjectsForm = false
      this.interactWithProjectForm = false
      this.clearDisplays()
    },
    preloadDummyProjectInfo: function (marker) {
      // *todo* for the moment, this is dummy data. Soon we'll add it normally, then find with view
      this.locale = 'delft-lab01'
      this.project = 'your-project'
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
    VueJsonEditor
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

.btn-limit {
  max-width: 220px;
}

.v-spaced {
  margin-top: 1em;
}

.v-spaced-below {
  margin-bottom: 1em;
}

.rule-spacing {
  margin-top: 24px;
}

.label-spacing {
  margin: 10px;
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
  padding: 0 5%;
}
</style>
