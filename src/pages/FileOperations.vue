<template>
  <span>
    <div class="w-full bg-title">
    <h2 class="text-json">Buttons With Actions -- try one...</h2>
    </div>
    <hr>
    <FileOpsButtons :jsonString="fileContent" v-on:showFile="showFile" v-on:savedFile="savedFile"/>
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
      <div class="json-data" v-html="fileJson" />
    </div>
  </span>
</template>

<script>
import FileOpsButtons from '@/components/FileOpsButtons';
import WrapAnsi from 'wrap-ansi';

export default {
  name: "FileOperations",
  data: function () {
    return {
      filePath: null,
      fileContent: null,
      fileJson: null
    }
  },
  methods: {
    showFile: function (fileData) {
      this.filePath = fileData.path
      // remember the file is text, not JSON...
      this.fileContent = fileData.content
      this.fileJson = this.screenFormatJson(this.textToJson(this.fileContent))
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
    FileOpsButtons
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
