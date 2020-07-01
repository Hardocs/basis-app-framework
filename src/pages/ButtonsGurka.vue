<template>
  <span>
    <h2>Buttons With Actions -- try one...</h2>
    <hr>
    <ButtonsPanel v-on:showFile="showFile"/>
    <div v-if="fileName" class="text-json">
      <h2>Gurka here</h2>
      <h3>File is {{ fileName }}</h3>
      <h3>Json is (no formatting yet): </h3>
      <!--
        _never_ do v-html as next, if you aren't absolutely certain
        that the content is safe...as for example raw web content never can be.
        *todo* We will assure that safety later within the Habitat protocol...
      -->
      <div class="json-data" v-html="fileJson" />
    </div>
  </span>
</template>

<script>
import ButtonsPanel from '../components/ButtonsPanel';

export default {
  name: "ButtonsGurka",
  data: function () {
    return {
      fileName: null,
      fileJson: null
    }
  },
  methods: {
    showFile: function (fileData) {
      this.fileName = fileData.name
      this.fileJson = fileData.content
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
