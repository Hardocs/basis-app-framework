<template>
  <span>
    <h2>Buttons With Actions -- try one...</h2>
    <hr>
    <ButtonsPanel :jsonData="fileJson" v-on:showFile="showFile" v-on:saveFile="saveFile"/>
    <div v-if="fileName" class="text-json">
      <h2>Gurkha here</h2>
      <h3>File is {{ fileName }}</h3>
      <h3>Json is: </h3>
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
import ButtonsPanel from '@/components/ButtonsPanel';
import WrapAnsi from 'wrap-ansi';

export default {
  name: "ButtonsGurkha",
  data: function () {
    return {
      fileName: null,
      fileJson: null
    }
  },
  methods: {
    showFile: function (fileData) {
      this.fileName = fileData.name
      // remember the file is text, not JSON...
      this.fileJson = this.screenFormatJson(this.textToJson(fileData.content))
    },
    saveFile: function (fileData) {
      this.fileName = fileData.path
      this.fileJson = fileData.success
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
    ButtonsPanel
  }
}
</script>

<style scoped>
.text-json {
  color: #1d3557;
}
.json-data {
  text-align: left;
  white-space: normal;
  margin: 20px;
}
</style>
