<template>
  <div>
    <div class="w-full bg-title">
    <h2 class="text-json">Buttons With Actions -- try one...</h2>
    </div>
    <hr>
    <ProjectsAdminOpsButtons
      v-on:adminLocale="adminLocale"
      v-on:adminProjects="adminProjects"
      v-on:interactWithProject="interactWithProject"
      v-on:updateProject="updateProject"
      v-on:listLocalProjects="listLocalProjects"
      v-on:listRemoteProjects="listRemoteProjects"
      v-on:replicateDb="replicateDb"
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
          </div>
          <div class="flex items-center justify-between">
            <button @click="initializeHabitat" :style="createStyle" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Initialize Habitat
            </button>
            <button @click="createLocale" :style="createStyle" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Create Locale
            </button>
            <button v-if="localeExists" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Delete Locale
            </button>
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
              <button @click="loadProject" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
                Load Project
              </button>
              <button @click="addProjectMember" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
                Add Member
              </button>
            </div>
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
    <div v-if="interactWithProjectForm">
      <div class="flex mb-4 h-full">
<!--        <div class="w-full max-w-xs">-->
        <form class="w-1/2 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="our-locale">
              Locale
            </label>
            <input v-model="locale" id="our-locale" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
              leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="locale-identity">
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="project">
              Project
            </label>
            <input v-model="project" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
              leading-tight focus:outline-none focus:shadow-outline" type="text" id="project" placeholder="project-name">
          </div>
          <div class="flex items-center justify-between">
            <button @click="loadProject" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Load Project
            </button>
            <button @click="saveProject" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Save Project
            </button>
            <button @click="updateProject" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Update Project
            </button>
<!--            <button @click="replicateTestLocale" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-->
<!--              focus:outline-none focus:shadow-outline" type="button">-->
<!--              Replicate Test Locale-->
<!--            </button>-->
          </div>
        </form>
        <div class="w-1/2 bg-gray-500 h-12 px-2 border-l-2 border-gray-600 h-full">
          <vue-json-editor v-model="projectData"
                           :show-btns="true"
                           :expandedOnStart="true"
          >
          </vue-json-editor>
          <!--        @json-change="onJsonChange"-->
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
    checkRole: function (role) {
      return habitatCloud.doRequest('checkRoles', this.remoteUrl)
        .then (result => {
          console.log ('checkRole returns: ' + JSON.stringify(result) + ', for check: ' + role)
          return result.msg === role
        })
        .catch(err => {
          this.showError('Check Db Status', err)
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
      habitatCloud.assureRemoteLogin()
        .then(result => {
          this.opsDisplay = result.msg
        })
        .then (() => {
         return  habitatCloud.doRequest('getLoginIdentity', this.remoteUrl)
        })
        .then (result => {
          console.log('C - identity: ' + JSON.stringify(result))
          this.loginIdentity = result.identity
          // *todo* my, my -- this has all moved on, upgrade to superAdmin...
          this.isAgent = this.checkRole('_admin') // *todo* this is just for informing, soon
          console.log('id: '  + this.loginIdentity + ', is locale: ' + this.isAgent)
          this.dbDisplay = this.isAgent ? ('Locale: ' + this.locale) : 'not superadmin yet'
        })
        .catch(err => {
          this.showError('adminLocale', err)
        })
    },
    createLocale: function () {
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
      // .then (result => {
      //   // *todo* replicateDb the initialized db down here??
      // })
      .then(result => {
        if (result.ok) {
          this.localeExists = true
          this.dbDisplay = 'Locale ' + this.locale + ' created'
        }
        this.opsDisplay = result.msg
      })
      .catch(err => {
        this.showError('createLocale', err.msg)
      })
    },
    adminProjects: function () {
      this.clearPanels()
      console.log('adminProjects:remoteDb: ' +  this.cloudDb)
      this.adminProjectsForm = true
      habitatCloud.assureRemoteLogin()
        .then(() => {
          // .then(result => {
          // *todo* see plan related
          this.opsDisplay = 'Logged in to Habitat Cloud'  // result.msg
        })
        .then (() => {
          return  habitatCloud.doRequest('getLoginIdentity', this.remoteUrl)
        })
        .then (result => {
          console.log('C - identity: ' + JSON.stringify(result))
          this.loginIdentity = result.identity
          this.isAgent = this.checkRole('agent')
          console.log('id: '  + this.loginIdentity + ', is agent: ' + this.isAgent)
          this.dbDisplay = this.isAgent ? ('Locale: ' + this.locale) : 'not agent yet'
          return result.identity
        })
        .then(result => {
          this.project = 'your-project'
          this.dbDisplay = 'Project creation identity: ' + result
        })
        .catch(err => {
          this.showError('adminProjects', err)
        })
    },
    interactWithProject: function () {
      this.clearPanels()
      this.interactWithProjectForm = true
      this.projectData = { projectName: 'dummy', projectMeta: 'some meta'}
      console.log('Interact With Projects - initialized')
    },
    addProjectMember: function () { // *todo* think this goes out
      this.clearPanels()
      console.log('add project member - on the way')
      habitatCloud.assureRemoteLogin()
        .then(() => {
            // .then(result => {
            // *todo* see plan related
            this.opsDisplay = 'Logged in to Habitat Cloud'  // result.msg
        })
        .then (() => {
          return  habitatCloud.doRequest('addProjectMember', this.remoteUrl,
            {
              locale: this.locale,
              project: this.project,
              member: this.projectMember
            }
          )
        })
        // habitatCloud.doRequest('getLoginIdentity, this.remoteUrl)
        .then (result => {
          this.loginIdentity = result.identity
          return result.identity
        })
        .then(result => {
          this.project = 'your-project'
          this.dbDisplay = 'Project creation identity: ' + result
        })
        .catch(err => {
          this.showError('adminProjects', err)
        })
    },
    testSaveLocalProjects: function () {
      this.clearPanels()
      console.log('testSaveLocalProjects:remoteDb: ' +  this.cloudDb)
      this.testSaveProjectsForm = true
      habitatCloud.assureRemoteLogin()
        .then(() => {
            // .then(result => {
            // *todo* see plan related
            this.opsDisplay = 'Logged in to Habitat Cloud'  // result.msg
        })
        .then (() => {
          return  habitatCloud.doRequest('getLoginIdentity', this.remoteUrl)
        })
        // habitatCloud.doRequest('getLoginIdentity, this.remoteUrl)
        .then (result => {
          this.loginIdentity = result.identity
          return result.identity
        })
        .then(result => {
          this.project = 'your-project'
          this.dbDisplay = 'Project creation identity: ' + result
        })
        .catch(err => {
          this.showError('adminProjects', err)
        })
    },
    loadProject: function () {
       console.log('loadProject from: ' + this.locale + ':' + this.project)

      habitatCloud.assureRemoteLogin()
        .then(() => {
          this.opsDisplay = 'Logged in to Habitat Cloud'  // result.msg
        })
        .then (() => {
          return  habitatCloud.doRequest('loadProject', this.remoteUrl,
            {
              locale: this.locale,
              project: this.project,
              identity: 'no identities now'
            }
          )
        })
        .then (result => {
          console.log('loadProject:result: ' + JSON.stringify(result))
          let jsonData
          if (result.ok) {
            jsonData = JSON.parse (result.msg) // error will throw for catch
            console.log ('jsonData: ' + JSON.stringify(jsonData))
            this.projectData = jsonData
            console.log ('projectData: ' + JSON.stringify(this.projectData))
            const msg = 'Project dataObject ok for : ' + this.projectData.keys.name
            console.log(msg)
            this.dbDisplay = msg
          } else {
            this.projectData = {}
            throw new Error (result.msg)
          }
          return jsonData
        })
        .then (jsonData => {
          // *todo* later no localDb, use default habitat-projectts to match cloud
          return habitatDb.saveHabitatObject(jsonData, true, this.localDb)
        })
        .then (result => {
          this.dbDisplay += ', saved: ' + result.ok
        })
        .catch(err => {
          this.showError('loadProject', err)
        })
    },
    saveProject: function () {
      console.log('saveProject from: ' + this.locale + ':' + this.project)

      habitatDb.saveProjectObject (this.projectData)
        .then (result => {
          console.log('saveProject:result: ' + JSON.stringify(result))
          if (result.ok) {
            this.dbDisplay = 'Project save ok for : ' + this.projectdata.keys.project
          } else {
            throw new Error (result.msg)
          }
        })
        .catch(err => {
          this.showError('saveProject', err)
        })

      // habitatCloud.assureRemoteLogin()
      //   .then(() => {
      //     this.opsDisplay = 'Logged in to Habitat Cloud'  // result.msg
      //   })
      //   .then (() => {
      //     return  habitatCloud.doRequest('saveProject', this.remoteUrl,
      //       {
      //         locale: this.locale,
      //         project: this.project,
      //         identity: 'no identities now',
      //         projectData: this.projectData
      //       }
      //     )
      //   })
      //   .then (result => {
      //     console.log('saveProject:result: ' + JSON.stringify(result))
      //     if (result.ok) {
      //       this.dbDisplay = 'Project dataObject ok for : ' + result.keys.name
      //     } else {
      //       throw new Error (result.msg)
      //     }
      //   })
      //   .catch(err => {
      //     this.showError('saveProject', err)
      //   })
    },
    updateProject: function () {
      console.log('updateProject from: ' + this.locale + ':' + this.project)

      // *todo* actually this needs to be the replication
      habitatCloud.assureRemoteLogin()
        .then(() => {
          this.opsDisplay = 'Logged in to Habitat Cloud'  // result.msg
        })
        .then (() => {
          return  habitatCloud.doRequest('updateProject', this.remoteUrl,
            {
              locale: this.locale,
              project: this.project,
              identity: 'no identities now',
              projectData: this.projectData
            }
          )
        })
        .then (result => {
          console.log('updateProject:result: ' + JSON.stringify(result))
          if (result.ok) {
            this.dbDisplay = 'Project dataObject ok for : ' + result.keys.name
          } else {
            throw new Error (result.msg)
          }
        })
        .catch(err => {
          this.showError('updateProject', err)
        })
    },
    replicateTestLocale: function () {
      this.clearPanels()
      const testLocale = 'test-locale'
      const remoteLocale = 'https://hd.narrationsd.com/hard-api/' + testLocale
      console.log('replicateTestProject projects from ' + testLocale + ' to ' + remoteLocale + '... ')

      // *todo* look very carefully into consequences of both checkpoint settings below,
      // but also the thing they save from, the odd nature of the 404 setting off CORS

      let locForErrs = 'replicateTestProject'
      habitatCloud.assureRemoteLogin(remoteLocale, {})
        .then(() => {
          locForErrs = 'replicateTestProject down from: ' + testLocale
          // *todo* temporary replication control discovery next
          const options = {
            filter: 'locale-projects/onlyTheLonely'
          }
          return habitatDb.replicateDatabase(remoteLocale, testLocale, options)
        })
        .then(result => {
          console.log('replicateTestProject:down:result: ' + JSON.stringify(result))
          this.dbDisplay = 'down: ' + JSON.stringify(result)
          locForErrs = 'replicateTestProject up to: ' + remoteLocale
          return habitatDb.replicateDatabase(testLocale, remoteLocale)
        })
        .then(result => {
          console.log('replicateTestProject:up:result: ' + JSON.stringify(result))
          this.dbDisplay += ', up: ' + JSON.stringify(result)
          this.opsDisplay = 'this is not real yet - not operating on a proper ' +
            'Locale yet - ' + remoteLocale + ' db'
        })
        .catch(err => {
          this.showError('replicateTestProject' + ':' + locForErrs, err)
        })
    },
    createProject: function () {
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
            {  // identity check is properly in cloud
              locale: this.locale,
              project: this.project,
            }
          )
        })
        // .then (result => {
        //   // *todo* replicateDb the initialized project down here??
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
          this.showError('createProject', err.msg)
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
          this.showError('listLocalProjects', err)
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
          this.showError('clearLocalProjects', err)
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
          this.opsDisplay = 'this is not real yet - just listing any records ' +
            'locale can reach - ' +  this.cloudDb + ' db'
        })
        .catch(err => {
          this.showError('listRemoteProjects', err)
        })
    },
    replicateDb: function () {
      this.clearPanels()
      let locForErrs = 'replicateDb'
      console.log('replicateDb projects from ' + this.cloudDb + ' to ' + this.localDb + '... ')
      // *todo* look very carefully into consequences of both checkpoint settings below,
      // but also the thing they save from, the odd nature of the 404 setting off CORS
      habitatCloud.assureRemoteLogin()
        .then(() => {
          locForErrs = 'replicateDb down from: ' + this.cloudDb
          // *todo* temporary replication control discovery next
          const options = {
            filter: 'projects/onlyTheLonely'
          }

          return habitatDb.replicateDatabase(this.cloudDb, this.localDb, options)
        })
        .then(result => {
          console.log('replicateDb:down:result: ' + JSON.stringify(result))
          this.dbDisplay = 'down: ' + this.$htmlJson(result)
          locForErrs = 'replicateDb up to: ' + this.cloudDb
          return habitatDb.replicateDatabase(this.localDb, this.cloudDb)
        })
        .then(result => {
          console.log('replicateDb:up:result: ' + JSON.stringify(result))
          this.dbDisplay += ', up: ' + this.$htmlJson(result)
          this.opsDisplay = 'this is not real yet - not operating on a proper ' +
            'Locale yet - ' + this.cloudDb + ' db'
        })
        .catch(err => {
          this.showError(this.localDb + ':' + locForErrs, err)
        })
    },
    initializeHabitat: function () {
      // this.clearPanels()
      console.log('initializing Habitat...')

      habitatCloud.assureRemoteLogin()
        .then(result => {
          this.opsDisplay = result.msg
          return
        })
        .then(() => {
          console.log('headed for initialize')
          const result = habitatCloud.doRequest('initializeCloud', this.remoteUrl)
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
    publishProject: function () { // *todo* in progress at this point
      this.clearPanels()
      const requestedStatus = false
      const locale = 'dummy Locale'
      const project = 'dummy Project'
      this.dbDisplay = 'publishProject state requested: ' + requestedStatus

      habitatCloud.assureRemoteLogin()
        .then(result => {
          this.opsDisplay = result.msg + '\r'
          return
        })
        .then(() => {
          return habitatCloud.doRequest(
            'publishProject',
            this.remoteUrl,
            {status: requestedStatus, locale: locale, project: project})
        })
        .then (result => {
          this.opsDisplay += 'Publish project result: ' + JSON.stringify(result)
        })
        .catch(err => {
          this.showError('publishProject', JSON.stringify(err))
        })
    },
    tryGql: function () {
      this.clearPanels()
      // const query = 'query { all { locale project description metadata docs { title content } } }'
      // const query = 'query { item(id: 1) { locale project description metadata docs { title content } } }'
      // const query = 'query { projects(locale: "NSD") { locale project description metadata docs { title content } } }'
      const query = 'query { project(locale: "NSD", project: "Habitat HD Client") { locale project description metadata docs { title content } } }'
      this.dbDisplay = 'Gql query: ' + query

      habitatCloud.assureRemoteLogin()
        .then(result => {
          this.opsDisplay = result.msg + '\r'
          return
        })
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
          this.showError('tryGql', err)
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
          this.showError('logOutRemote', err)
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
    showError: function (action, err) {
      // an essential, so we don't need to know which form comes
      // if it's not an Error, it's string or JSON
      // we ourselves always throe Errors, but libraries...
      err = err instanceof Error ? err.message : JSON.stringify(err)
      const msg = `Error:  ${action}: ` + err
      this.opsDisplay = msg
      console.log(msg)
    },
    clearPanels: function () {
      console.log ('clearPanels')
      this.opsDisplay = ''
      this.dbDisplay = ''
      this.adminLocaleForm = false
      this.adminProjectsForm = false
      this.interactWithProjectForm = false
    },
    preloadDummyProjectInfo: function (marker) {
      // *todo* for the moment, this is dummy data. Soon we'll add it normally, then find with view
      this.locale = 'hardocs-team'
      this.project = 'test-project'
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
  padding: 0 15%;
}
</style>
