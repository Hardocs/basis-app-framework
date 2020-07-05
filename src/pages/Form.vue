<template lang="">
    <div>
        <input v-model="value">
        <button @click="testNode">Test node action</button>
    </div>
</template>

<script>
/**
 *
 * Make view of form validation
 * Compile schema
 * 
 */

const fs = require("fs");

const root = fs.readdirSync("./");

// This will print all files at the root-level of the disk,
// either '/' or 'C:\'.

export default {
  data() {
    return {
      /**
       * todo: Create data values based on schemas
       */
      value: "Jesus"
    };
  },
  methods: {
    /**
     * todo: On click validate data input
     */
    testNode: function() {
      console.log(root);
    }
  }
};
</script>