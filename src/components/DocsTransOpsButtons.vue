<template>
  <div class="bg-btns">
    <div class="container mx-auto max-w-5xl flex xpb-4 items-center h-full ">
      <!-- be sure to use the noOp action when type is remote... -->
      <div
        @click="item.action"
        :key="item.label"
        v-for="item in items"
        active-class="p-4 mx-2 text-primary-25 hover:text-blue-100"
        class="p-2 hover:bg-primary-25 rounded-md mx-2 text-yellow-100 hover:font-semibold"
      >
        <div v-if="item.type === 'remote'">
          <a :href="item.name" target="_blank">{{ item.label }}</a>
        </div>
        <div v-else>
          <p class="cursor-p">{{ item.label }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {

  // n.b. Note that this component with FileOperations practices a normal no-Vuex way
  // to interact between Vue parent and child

  name: "DocsTransOpsButtons",
  data: function () {
    return {
      items: [
        {
          label: "Choose Folder",
          action: this.openEditFiles
        },
        {
          label: "Translate Files",
          action: this.translateFiles
        },
        {
          label: "Save an Html File from Editor",
          action: this.saveToFile
        },
        // {
        //   label: "Another Example (not yet)",
        //   action: this.noOp
        // },
      ]
    }
  },
  methods: {
    openEditFiles: function () {
      this.$emit('openEditFiles')
    },
    translateFiles: function () {
      this.$emit('translateFiles')
    },
    saveToFile: function () {
      this.$emit('saveToFile')
    },
    noOp: () => {} // but don't do arrows when you want to use this.anything
  },
}
</script>

<style scoped>
.bg-btns {
  background-color: #3d538b;
}
.cursor-p { /* because tailwind cursor-pointer won't take care of it */
  cursor:pointer;
}
</style>
