<template>
  <div class="frame">
    <input type="text" id="startTime" placeholder="Beginn"/>
    <input type="text" id="endTime" placeholder="Ende"/>
    <input type="text" id="title" placeholder="Titel"/>
    <input type="button" id="save" value="save" @click="save"/>
  </div>
</template>

<script>
export default {
  methods: {
    save() {
      this.$parent.editMode = "visibility: hidden"
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.frame {
  /* margin: 50px; */
  clear: both;
}
</style>
