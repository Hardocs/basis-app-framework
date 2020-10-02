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
      <div class="flex px-4 items-center">
        <h2 class="px-2 text-white text-lg">dB to Use: </h2>
        <VueSelect
          v-model="dbLocation"
          :options="dbLocations"
          :clearable="false"
        />
      </div>
    </div>
  </div>
</template>

<script>

const dbLocations = [
  { label: 'Local', signature: 'hardocs-projects' },
  { label: 'Habitat Cloud', signature: 'https://hd.narrationsd.com/hard-api/hardocs-projects' },
]

import VueSelect from 'vue-select'

export default {

  // n.b. Note that this component with HardocsDb practices a normal way
  // to interact between Vue parent and child, not needing external packages

  name: "HardocsDbOpsButtons",
  data: function () {
    return {
      items: [
        {
          label: "Load Hardocs Db Project",
          action: this.loadProjectFromDb
        },
        {
          label: "Save Hardocs Db Project",
          action: this.saveProjectToDb
        },
        {
          label: "Clear Current Db",
          action: this.clearDb
        },
        // {
        //   label: "Another Example (not yet)",
        //   action: this.noOp
        // },
      ],
      dbLocations: dbLocations,
      dbLocation: dbLocations[0]
    }
  },
  methods: {
    loadProjectFromDb: function () {
      this.$emit('loadProjectFromDb', this.dbLocation.signature)
    },
    saveProjectToDb: function () {
      this.$emit('saveProjectToDb', this.dbLocation.signature)
    },
    clearDb: function () {
      this.$emit('clearDatabase')
    },
    noOp: () => {} // but don't do arrows when you want to use this.anything
  },
  components: {
    VueSelect
  }
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
