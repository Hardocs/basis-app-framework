<template>
  <span>
    <div class="w-full bg-title">
    <h2 class="text-json">Buttons With Actions -- try one...</h2>
    </div>
    <hr>
    <HardocsDbOpsButtons
      :htmlString="fileContent"
      :htmlEditor="editor"
      v-on:openEditFiles="openDir"
      v-on:showFile="showFile"
      v-on:savedFile="savedFile"
      v-on:loadProject="loadProject"
      v-on:saveProject="saveProject"
    />
    <div v-if="dbData" class="bg-display text-white">
      {{ dbData }}
    </div>
    <div v-if="opsError" class="bg-display text-white">
      {{ opsError }}
    </div>
    <div v-if="filePath" class="text-json">
      <div class="bg-display text-white">
        <h3>File is {{ filePath }}</h3>
      </div>
      <!--
        n.b. _Never_ use v-html as follows, if you aren't absolutely certain
        that the content is safe...as for example raw web content never can be.
        *todo* We will assure that safety later within the Habitat protocol...
        ...as we do throughout CombatCovid
      -->
      <div class="flex mb-4 h-full">
        <div class="w-1/2 bg-gray-400 h-12 px-2">
          <div v-for="(file, index) in editFiles" :key="index">
            <h2 class="master-item" @click="openFile(file)">{{ fileName(file) }}</h2>
            <hr>
          </div>
        </div>
        <div class="w-1/2 bg-gray-500 h-12 px-2 border-l-2 border-gray-600 h-full">
          <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
            <div>
              <button :class="{ 'is-active': isActive.italic() }" @click="commands.italic()">
                Italic
              </button>
              &nbsp;        <button :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
                Bold
              </button>
              &nbsp;
              <button :class="{ 'is-active': isActive.heading({ level: 1 }) }" @click="commands.heading({ level: 1 })">
                H1
              </button>
              &nbsp;
              <button :class="{ 'is-active': isActive.heading({ level: 2 }) }" @click="commands.heading({ level: 2 })">
                H2
              </button>
            </div>
          </editor-menu-bar>
          <hr>
          <editor-content :editor="editor"/>
        </div>
      </div>
    </div>
  </span>
</template>

<script>

import HardocsDbOpsButtons from '@/components/HardocsDbOpsButtons'
import {
  getHtmlFromPath,
  getFilesFromDir,
  saveToDatabase,
  loadFromDatabase
} from '@/modules/habitat-requests'
import {Editor, EditorContent, EditorMenuBar} from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
} from 'tiptap-extensions'

export default {
  name: "HardocsDb",
  data: function () {
    return {
      // these are the primary information for a project and its data
      owner: null,
      project: null,
      projectData: null, // expected connect to Vuex
      dbData: null, // temporary measure, to first view

      // the rest of these are points of call for the edit and file demonstrators
      editor: null,
      editFiles: [],
      filePath: null,
      fileContent: null,
      fileJsonObject: null,
      fileJsonView: null,

      // where we can indicate issues to screen
      opsError: null
    }
  },
  mounted () {
    this.preloadDummyProjectInfo()
    this.editor = new Editor({
      extensions: [
        new Blockquote(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({levels: [1, 2, 3]}),
        new BulletList(),
        new OrderedList(),
        new ListItem(),
        new TodoItem(),
        new TodoList(),
        new Bold(),
        new Code(),
        new Italic(),
        new Link(),
        new Strike(),
        new Underline(),
        new History(),
      ],
      content: `
          <h1>Hmm, Headlines!</h1>
          <p>All these <strong>few tags</strong> are working now.</p>
          <h2>But more can come.</h2>
        `,
    })
  },
  beforeDestroy () {
    this.editor.destroy()
  },
  methods: {
    loadProject: function () {
      this.clearPanels()
      console.log ('loading owner: ' + this.owner + ', project: ' + this.project)
      this.dbData = 'app is loading project owner: ' +
        this.owner + ', project: ' + this.project

      loadFromDatabase()
        .then(result => {
          console.log('loaded Project: ' + JSON.stringify(result))
          this.projectData = result.data
          this.dbData = 'app has loaded: '+ JSON.stringify(result.data)
        })
        .catch(err => {
          this.opsError = JSON.stringify(err)
        })
    },
    saveProject: function () {
      this.clearPanels()
      console.log ('saving owner: ' + this.owner + ', project: ' + this.project)

      // first make a change that we can see, in this level of demo
      this.projectData.count += 1

      saveToDatabase(this.owner, this.project, this.projectData)
        .then(result => {
          console.log('saveProject: result: ' + JSON.stringify(result))
          this.opsError = result
          this.dbData = 'app has saved: '+ JSON.stringify(this.projectData)
        })
        .catch(err => {
          console.log('saveProject:error: ' + err)
          this.opsError = err
        })
    },
    clearPanels: function () {
      this.opsError = null
      this.dbData = null
    },
    showFile: function (fileData) {
      this.filePath = fileData.path
      this.editFiles.push(this.filePath)
      this.fileContent = fileData.content
      this.editor.setContent(this.fileContent)
    },
    savedFile: function (fileData) {
      this.filePath = fileData.path
      this.fileContent = fileData.content
    },
    fileName: function (filePath) {
      const parts = filePath.split('\\')
      return parts[parts.length - 1]
    },
    openDir: function () {
      this.editFiles = []
      getFilesFromDir('.html') // mind the dot; it's required
        .then(result => {
          this.editFiles = result.files
          if (this.editFiles.length > 0) {
            this.openFile(this.editFiles[0])
          }
        })
        .catch(err => this.editFiles[0] = err) // we can do a lot better, but not today - parent ops result pane...
    },
    openFile: function (filePath) {
      getHtmlFromPath(filePath)
        .then(fileData => {
          this.filePath = fileData.path
          this.fileContent = fileData.content
          // part of the incoherent mess - we have already this file on list, etc..
          // this.editFiles.push(this.filePath)
          this.editor.setContent(this.fileContent)
        })
        .catch(e => {
          this.editor.setContent('error opening file: ' + e)
        })
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
        count: 0 // this is for keeping track of updates
      }
    }
  },
  components: {
    HardocsDbOpsButtons,
    EditorContent,
    EditorMenuBar
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
