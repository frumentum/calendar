<template>
  <div>
    <div class="day">
      <div id="dayNumber"><b>{{ dayNumber || '0'}}</b></div>
      <div id="weekday">{{ weekday || 'not defined'}}</div>
    </div>
    <div class="container">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dayNumber: '',
      weekday: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.day {
  /* width: 100%; */
  /* position: relative; */
  border: 1px solid black;
  background-color: rgba(51, 50, 250, .3);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 100px;
  align-items: center;
}
#dayNumber {
  /* Block-Axis (= y-axis) */
  align-self: start;
  /* Inline / Row-axis (x-axis) */
  justify-self: start;
}
#weekday {
  align-self: start;
}
.container{
    /* width:100px; */
    position:relative;
    border:1px solid rgba(51, 50, 250, .7);
}
</style>
