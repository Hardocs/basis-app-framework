<template>
  <span>
    <h2>Buttons Data View</h2>
    <hr>
    <ButtonsPanel/>
  </span>
</template>

<script>
import ButtonsPanel from '../components/ButtonsPanel';

export default {
  name: "ButtonsGurka",
  data: function () {
    return {
      pouchData: ''
    }
  },
  components: {
    ButtonsPanel
  }
}
</script>

<style scoped>
.json-data {
  text-align: left;
  white-space: normal;
  margin: 20px;
}
</style>
