<template>
  <div class="hello">
    <img alt="Vue logo" src="@/assets/icons/png/hardocs96.png" class="logo">
    <h1 class="font-bold text-primary-100 mt-2">Welcome to the Hardocs Framework Basis App</h1>
    <h1 class="font-bold text-primary-100 mt-2">{{ versionMsg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    appVersion: String
  },
  data: function () {
    return {
      versionMsg: null
    }

  },
  mounted () {
    this.versionMsg = 'Version ' + this.appVersion
  }
}
</script>

<style>
page-title {
  color: darkblue;
  margin-top: 100px !important;
}
</style>

<style scoped>
.logo {
  width: 96px;
  margin: 24px auto
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
