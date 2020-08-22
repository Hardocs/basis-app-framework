<template>
  <span>
    <div class="w-full bg-title">
    <h2 class="text-json">Buttons With Actions -- try one...</h2>
    </div>
    <hr>
    <InterActOpsButtons
      :jsonString="fileContent"
      :jsonEditor="editor"
      v-on:showFile="showFile"
      v-on:savedFile="savedFile"
    />
    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
      <div>
        <button :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
          Bold
        </button>
        <button :class="{ 'is-active': isActive.heading({ level: 2 }) }" @click="commands.heading({ level: 2 })">
          H2
        </button>
      </div>
    </editor-menu-bar>
    <editor-content :editor="editor" />
    <div v-if="filePath" class="text-json">
      <div class="bg-display text-white">
        <h3>File is {{ filePath }}</h3>
        <h3>Json is: </h3>
      </div>
      <!--
        n.b. _Never_ use v-html as follows, if you aren't absolutely certain
        that the content is safe...as for example raw web content never can be.
        *todo* We will assure that safety later within the Habitat protocol...
        ...as we do throughout CombatCovid
      -->
      <div class="json-data" v-html="fileJsonView" />
    </div>
  </span>
</template>

<script>
import InterActOpsButtons from '@/components/InterActOpsButtons';
import WrapAnsi from 'wrap-ansi';
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
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
  name: "InterAction",
  data: function () {
    return {
      editor: null,
      filePath: null,
      fileContent: null,
      fileJsonObject: null,
      fileJsonView: null
    }
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        new Blockquote(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
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
          <h1>Yay Headlines!</h1>
          <p>All these <strong>cool tags</strong> are working now.</p>
        `,
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    showFile: function (fileData) {
      this.filePath = fileData.path
      // remember the file is text, not JSON...
      this.fileContent = fileData.content
      this.fileJsonObject = this.textToJson(this.fileContent)
      this.fileJsonView = this.screenFormatJson(this.fileJsonObject)
      this.editor.setContent(this.fileJsonView)
    },
    savedFile: function (fileData) {
      this.filePath = fileData.path
      this.fileContent = fileData.content
    },
    textToJson: (fileText) => {
      try {
        return JSON.parse(fileText)
      } catch (e) {
        return { error: 'File isn\'t proper JSON: ' + e } // be json in error
      }
    },
    // *todo* these duplicated from DataView; will later mixin or better Vue3 way single-point
    responsiveWrap: (text, width) => {
      // responsive part comes when you set the width per screen viewport...
      return WrapAnsi(text, width, { trim: false, hard: true})
    },
    screenFormatJson: function (text, width = 80) {
      // this form of stringify gives nice indented lines,
      // but we still have to wrap the long ones, since
      // we're presenting in <pre>
      const data = this.responsiveWrap(
        // text,
        JSON.stringify(text, null, 2),
        width)
      return '<pre>\n' + data + '\n</pre>'
    }
  },
  components: {
    InterActOpsButtons,
    EditorContent,
    EditorMenuBar
  }
}
</script>

<style scoped>
.bg-title {
  background-color: #d6b668;
}
.bg-display {
  background-color: teal;
}
.text-json {
  color: #1d3557;
}
.json-data {
  text-align: left;
  white-space: normal;
  margin: 20px;
}
</style>
