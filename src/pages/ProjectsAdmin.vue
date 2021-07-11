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
      v-on:listRemoteProjects="listRemoteProjects"
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
            <p v-if="!localeExists" class="text-red-500 text-xs italic">
              Please choose a locale name. which can have letters, numbers, dashes; no spaces.
            </p>
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
            <label class="block text-gray-700 text-sm font-bold mb-2" for="project-locale">
              Project
            </label>
            <input v-model="project" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
              leading-tight focus:outline-none focus:shadow-outline" type="text" id="project-locale" placeholder="project-name">
            <p v-if="!projectExists" class="text-red-500 text-xs italic">
              Please choose a locale name. which can have letters, numbers, dashes; no spaces.
            </p>
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
            <label class="label-spacing block text-gray-700 text-sm font-bold mb-2" for="project-project">
              Project:
            </label>
            <input v-model="project" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
              leading-tight focus:outline-none focus:shadow-outline" type="text" id="project-project" placeholder="project-name">
          </div>
          <p class="v-spaced-below">normal operations:</p>
          <div class="flex items-center justify-around">
            <button @click="loadCloudProject" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Load Project<br>from Cloud
            </button>
            <button @click="updateProjectToCloud" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Update Project<br>to Cloud
            </button>
          </div>
          <div class="flex items-center justify-around v-spaced">
            <button @click="loadLocalProject" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Load your<br>Local Project
            </button>
            <button @click="storeProjectLocally" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Save Your<br>Project Locally
            </button>
          </div>
<!--          <div class="flex items-center justify-around v-spaced">
            <button @click="tryModal" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Try that<br>File modal
            </button>
&lt;!&ndash;            <button @click="storeProjectLocally" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline" type="button">
              Save Your<br>Project Locally
            </button>&ndash;&gt;
          </div>-->
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
import VueJsonEditor from 'vue-json-editor'

export default {
  name: "ProjectsAdmin",
  components: {
    ProjectsAdminOpsButtons,
    VueJsonEditor
  },
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
      completedSteps: 3,
      totalSteps: 10,
      animateSpeed: 500,
      strokeWidth: 15,
      innerStrokeWidth: 15,
      stopColor: '#d6b668',
      startColor: '#a3ff02',
      innerStrokeColor: '#03a8c4',

      // where we can indicate issues to screen
      opsDisplay: null,
      localProjectsDbName: 'habitat-projects',

      // control of forms
      adminLocaleForm: false,
      adminProjectsForm: false,
      interactWithProjectForm: false,
      isAgent: false,

      // progress indication
      progressIndicator: habitatLocal.progressModalFactory(),

      // testing
      testCount: 0,
    }
  },
  mounted () {
    this.preloadDummyProjectInfo()
  },
  methods: {

    // n.b. I know, it's big. And hungry for componentization, but...other needs came first
    // these routines arranged at the top are the ones to study for code pathways,
    // the useful ones you'll need. I'll extract from them for docmentation examples.

    loadCloudProject: function () {
      this.clearDisplays()
      console.log('cloud loadProjectLatest from: ' + this.locale + ':' + this.project)

      let step = 'assure-login'
      habitatCloud.assureRemoteLogin()
        .then(result => {
          this.dbDisplay = result.msg
          this.opsDisplay = 'Loading Project from Habitat Cloud'
          step = 'load-from-cloud'
          this.progressInitiate('Loading current Project from the cloud...')
          return  habitatCloud.doRequest(
            'loadProject',
            {
              locale: this.locale,
              project: this.project,
              identity: this.identity,
              options: { resolveMode: 'latestWins' }
            }
          )
        })
        .then (result => {
          // console.log('loadProjectLatest:result: ' + JSON.stringify(result))

          // here are your actions after.  We store to the db in this app framework
          // demonstrator, just to keep the id and rev available and sane for its
          // now-legacy use of a database, which production must never have and won't.

          // what you want to do instead is store the projectData out to your immediate
          // state store, later to be sent to the filesystem storage of all. So
          // setProjectObject will be your own routine, as will be display updating.
          // You'll find the easy details of how you do that in this example routine.

          // You'll want to use progressOpen() above, and progressClose(), to make confidence,
          // and they hold and call some necessary steps, also attune the modal text.
          step = 'set-project-object'
          this.setProjectObject(result.data)

          this.dbDisplay = 'Ok - ' + result.msg + ' completed'
          this.opsDisplay = 'for : ' + this.locale + ':' + this.project
          this.progressClose()
        })
        .catch(err => {
          this.progressClose()
          this.showCmdError('loadProjectLatest:' + step, err)
        })
    },
    updateProjectToCloud: function () {
      this.clearDisplays()
      console.log('updateProjectToCloud locale: ' + this.locale + ':' + this.project)

      let step = 'assure-login'
      habitatCloud.assureRemoteLogin()
        .then(result => {
          this.dbDisplay = result.msg
          this.opsDisplay = 'Updating Project to Habitat Cloud'
          step = 'update-HabitatProject'
          this.progressInitiate('Updating current Project to the cloud...')
          return habitatCloud.doRequest(
            'updateProject',
            {
              locale: this.locale,
              project: this.project,
              projectData: this.getProjectObject(),
              options: {}, // cloud will handle the primary itself
            })
        })
        .then(result => {
          this.progressClose()
          console.log('updateProjectToCloud:result: ' + JSON.stringify(result))
          this.dbDisplay = 'Ok - ' + result.msg + ','
          this.opsDisplay = 'for : ' + this.projectData._id
        })
        .catch(err => {
          this.progressClose()
          // normally you don't set showStack, for softer messages. Here though is how:
          this.showCmdError('updateProjectToCloud:' + step, err, true)
        })
    },
    progressInitiate: function (activityMsg) {
      // must renew this way, due to hidden Electron problem
      this.progressIndicator = habitatLocal.progressModalFactory(activityMsg)
      this.progressIndicator.initiate()
    },
    progressClose: function () {
      this.progressIndicator.complete()
      this.progressIndicator = null
    },
    setProjectObject: function (resultObject) {
      // write your own, compose from data you have
      this.projectData = {
        // these first items (and any added later) are only for this App Framework, as
        // it's a convenience to Habitat client api development to have them visible
        // DO NOT save or restore them in your application software.
        // -- begin ignore --
        _id: resultObject._id,
        _rev: resultObject._rev,
        // details vary with future abilities. There might come a time
        // when you would use one or two of them, but never store directly
        details: resultObject.details,
        // -- end ignore --

        // Now, these are the objects you take from the result in your application
        // you'll aave the hdFrame and hdObject on your own app in-view object,
        // and as necessary further to your internal and then filesystem storage
        // In other words, what you do here should be just as you expect...

        hdFrame: resultObject.hdFrame,
        hdObject: resultObject.hdObject
      }
    },
    getProjectObject: function () {
      // write your own, compose from data you have
      return {
        // *todo* first two, and any others are only for moment, go out
        _id: this.projectData._id,
        _rev: this.projectData._rev,

        // and this is your real data handling, that you do
        details: this.projectData.details,
        hdFrame: this.projectData.hdFrame,
        hdObject: this.projectData.hdObject
      }
    },
    showCmdError: function (action, err, showStack = false) {
      // an essential, so we don't need to know which form comes
      // if it's not an Error, it's string or JSON
      // we ourselves always throw Errors, but libraries...
      // the stack showing would be used only in debugging for
      // the local habitat-client (habitatCloud etc.) libraries
      let msg
      if (err instanceof Error) {
        const error = showStack ? err.stack : err
        msg = `Error:  ${action}: ` + error
      } else {
        // we should always have the same form now, { ok, msg }
        // but if not, revert here until we do...
        msg = `Error:  ${action}: ` + err.msg
      }
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

    // n.b. below here, still discovery-land and development
    // the idea is to not take any of this code, nor look at it :)

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
          habitatLocal.validateHabitatName (this.locale, 'Project Locale')

          return habitatCloud.doRequest(
            'createLocale',
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
          this.showCmdError('createLocale', err)
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
          habitatLocal.validateHabitatName (this.locale, 'Locale')

          return habitatCloud.doRequest(
            'deleteLocale',
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
          this.showCmdError('deleteLocale', err)
        })
    },
    setUpForCloudActions: async function () {
      await habitatCloud.assureRemoteLogin()
        .then((result) => {
          // .then(result => {
          // *todo* see plan related
          this.dbDisplay = /*'Logged in to Habitat Cloud'*/  result.msg
        })
        .then(() => {
          return habitatCloud.doRequest('getLoginIdentity')
        })
        .then(result => {
          // We likely  want to use role and identity information coming here,
          // just to help the UX present what's possible - the original intent.

          // Both identity and role are only hard-determined on the cloud,
          // so that no forgery is ever possible. No matter what is tried,
          // db-affecting data like keys will always be identified to you.

          console.log('identity: ' + JSON.stringify(result))
          this.loginIdentity = result.identity
          this.isAgent = this.checkRole('agent')
          console.log('id: ' + this.loginIdentity + ', is agent: ' + this.isAgent)
          // later? still working out what we actually want to show, and when
          // this.opsDisplay = this.isAgent ? ('Locale: ' + this.locale) : 'not agent yet'
          return result.identity
        })
        .then(result => {
          this.project = 'your-project'
          this.opsDisplay = 'Actions identity: ' + result
        })
        .catch(err => {
          console.log ('setUpForCloud:error: ' + JSON.stringify(err))
          this.showCmdError('setUpForCloud', err)
        })
    },
    adminProjects: function () {
      this.clearPanels()
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
          this.projectData = result.data // error will throw for catch
          this.dbDisplay = 'OK - ' + result.msg + ' locally, '
          this.opsDisplay = 'for: ' + result.data._id
        })
        .catch(err => {
          this.showCmdError('loadLocalProject', err)
        })
    },
    loadUnresolvedCloudProject: function () {

      // NOTE:  this method is ONLY for examining how resolution works. NOT for production!
      // and now that we do all resolution on the server, it  won't show you anything interesting.
      // Kept for the moment, but probably add an option to get the info from the normal call instead.

      this.clearDisplays()
      console.log('cloud loadUnresolvedCloudProject from: ' + this.locale + ':' + this.project)

      habitatCloud.assureRemoteLogin()
        .then(() => {
          return  habitatCloud.doRequest(
            'loadProjectUnresolved',
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
          // we needed to save the result to the local db, in this case *without* changing the rev.
          // this was to make visible why we did the other half of our conflict-resolving
          // pattern, instead of replication, for both activity and security reasons

          // in this test case also we wanted the resolved cloud result replicated exactly, locally
          // NOTE but never use this call in any normal Hardocs application,
          // and never without complete understanding of what you are doing!!
          // In any case, as noted, the daaabase will entirely disappear before long.
          return habitatDb.storeProjectObjectSameRev(projectData, this.localProjectsDbName)
        })
        .then (result => {
          this.opsDisplay = result.msg + ' locally'
        })
        .catch(err => {
          this.projectData = { no: 'data' }
          this.showCmdError('loadProjectLatest', err)
        })
    },
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
      return habitatCloud.doRequest('checkRoles')
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
    tryModal: function () {
      // this.clearPanels()
      const options =  {
        height: 480,
        width: 600,
        backgroundColor: '#0d3856'
      }
      habitatLocal.modalOnFileHtml ('waiting.html', options)
      .then (modal => {
        modal.show()
        this.opsDisplay = 'ok, modal'
        // setTimeout (function () {
        //   modal.close()
        // }, 4000)
      })
      .catch (err => {
        this.opsDisplay = 'no modal, err: ' + err
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

        // n.b. the result at this point uses id and rev, not _id and _rev

        this.projectData._rev = result.rev // critical
        this.projectData.timestamp = result.timestamp // critical also
        return this.projectData
     }

      habitatDb.storeProjectObject (
        this.projectData,
          updateProject.bind(this),  // always with the .bind(this)
          this.localProjectsDbName)
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
          habitatLocal.validateHabitatName (this.locale, 'Locale')
          habitatLocal.validateHabitatName (this.project, 'Project')

          return habitatCloud.doRequest(
            'createProject',
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
          this.showCmdError('createProject', err)
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
          habitatLocal.validateHabitatName (this.locale, 'Locale')
          habitatLocal.validateHabitatName (this.project, 'Project')

          return habitatCloud.doRequest(
            'deleteProject',
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
          this.showCmdError('deleteProject', err)
        })
    },
    listLocalProjects: function () {
      this.clearPanels()
      habitatDb.listLocaleProjects('hardLocale', this.localProjectsDbName)
        .then(result => {
          console.log('listLocalProjects: ' + JSON.stringify(result))
          this.dbDisplay = this.$htmlJson(result)
          this.opsDisplay = 'this is not real yet - just listing any records ' +
            'locale can reach - ' + this.localProjectsDbName + ' db'
        })
        .catch(err => {
          this.showCmdError('listLocalProjects', err)
        })
    },
    clearLocalProjects: function () {
      this.clearPanels()
      console.log('clearing local database... ')

      habitatDb.clearDatabase(this.localProjectsDbName)
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
          console.log('app:delete project: ' + this.project +
            ', locale: ' + this.locale + ', identity: ' + this.loginIdentity)
          return habitatCloud.doRequest(
            'listProjects',
            {  // identity check is properly in cloud
              locale: 'all', // this.locale,
              project: 'all' //this.project,
            }
          )
        })
        .then(result => {
          console.log('listRemoteProjects: ' + JSON.stringify(result))
          if (result.ok) {
            this.dbDisplay = result.msg
            this.opsDisplay = this.$htmlJson(result.data)
          } else {
            throw new Error (result.msg)
          }
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
          return habitatCloud.doRequest(
            'initializeCloud'
          )
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
      const requestedStatus = false // what is this intended for, now it's later?
      const locale = 'dummy-Locale'
      const project = 'dummy-Project'
      this.dbDisplay = 'publishProject state requested: ' + requestedStatus

      habitatCloud.assureRemoteLogin()
        .then(result => {
          this.opsDisplay = result.msg
          return habitatCloud.doRequest(
            'publishProject',
            {
              status: requestedStatus,
              locale: locale,
              project: project
            }
          )
        })
        .then (result => {
          this.opsDisplay += '.  Publish project result: ' + JSON.stringify(result)
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
            {query: query})
        })
        .then (result => {
          // with gql, results contain data or its own errors
          // thus, ok is critical to handling, and result is json either way
          this.opsDisplay = 'Gql result: ' + this.$htmlJson(result.data);
          this.dbDisplay += ' -- ' + result.msg
        })
        .catch(err => {
          this.showCmdError('tryGql', err)
        })
    },
    logOutRemote: function () {
      this.clearPanels()
      habitatLocal.logoutOfHabitat()
        .then(result => {
          this.opsDisplay = result.msg
        })
        .catch(err => {
          this.showCmdError('logOutRemote', err)
        })
    },
    onJsonChange (value) {
      console.log('value:', value)
    },
    preloadDummyProjectInfo: function (marker) {
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
