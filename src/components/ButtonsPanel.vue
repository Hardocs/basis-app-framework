<template>
  <div class="btns-bg">
    <div class="text-white">
      <h2>Gurka here</h2>
      <h3>File is {{ fileName }}</h3>
      <div v-html="fileContent" />
    </div>
    <div class="container mx-auto max-w-5xl flex items-center h-full ">
      <div
        :key="item.label"
        v-for="item in items"
        active-class="p-4 mx-2 text-primary-25 hover:text-blue-100"
        class="p-2 hover:bg-primary-25 rounded-md mx-2 text-yellow-100 hover:font-semibold"
      >
        <div v-if="item.type === 'remote'">
          <a :href="item.name" target="_blank">{{ item.label }}</a>
        </div>
        <div v-else>
          <p @click="openFile">{{ item.label }}</p>
<!--          <router-link :to="item.name">{{ item.label }}</router-link>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fs from 'fs'
import app from 'electron'

  const dialog = app.remote.dialog;
  const rendWin = app.remote.getCurrentWindow()

export default {
  name: "ButtonsPanel",
  data: function () {
    return {
      file: null,
      fileName: "(not yet)",
      fileContent: "(not yet either)",
      items: [
        {
          name: "/",
          label: "Open",
          type: 'local',
          action: 'openFile'
        },
        {
          name: "/data-view",
          label: "Data View",
          type: 'local',
          action: ''
        },
        {
          name: "https://www.google.com/search?q=oceanic&source=lnms&tbm=isch",
          label: "Panel",
          type: 'remote',
          action: ''
        },
        {
          name: "/documentation",
          label: "Documentation",
          type: 'local',
          action: ''
        },
        {
          name: "/about",
          label: "Hoola",
          type: 'local',
          action: ''
        }
      ]
    }
  },
  methods: {
    openFile: function () {
      if (process.env.ORIGINAL_XDG_CURRENT_DESKTOP !== null) {
        dialog.showOpenDialog(rendWin, {
            filters: [
              {name: 'JSON Files', extensions: ['json']}
            ],
            properties: [
              'openFile',
              // 'openDirectory', // for later, implementing result
            ]
          })
          .then(file => {
            if (!file.canceled) {
              this.file = file
              this.fileName = file.filePaths[0]
              this.fileContent = fs.readFileSync(this.fileName, 'utf8')
            }
          })
      }
    }
  },
}
</script>

<style scoped>

.btns-bg {
  background-color: darkslateblue;
}

</style>
