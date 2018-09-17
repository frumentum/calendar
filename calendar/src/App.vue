<template>
  <div id="app">
    <DayCalendar id="day"/>
    <input type="button" @click="clickAdd" id="addEvent" value="+"/>
    <editEvent :style="editMode" id="edit"/>
  </div>
</template>

<script>
import DayCalendar from './components/DayCalendar.vue'
import editEvent from './components/editEvent.vue'

export default {
  name: 'app',
  components: {
    DayCalendar,
    editEvent
  },
  data() {
    return {
      editMode: 'visibility: hidden'
    }
  },
  methods: {
    clickAdd() {
      this.editMode =  'visibility: visible'
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  /* display: inline-block; */
}
#day {
  width: 80%;
  float: left;
}
#addEvent {
  width: 20%;
  margin: 0;
  font-size: 400%;
  background-color: orange;
  width: 100px;
  display: inline;
  float: left;
  height: 100px;
}
#edit {
  width: 80%;
}
</style>
