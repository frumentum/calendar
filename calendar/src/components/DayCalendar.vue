<template>
  <div>
    <div class="day">
      <div id="dayNumber"><b>{{ dayNumber || '0'}}</b></div>
      <div id="weekday">{{ weekday || 'not defined'}}</div>
      <!-- <div @click="clickAdd" id="addEvent">+</div> -->
      <input type="button" @click="clickAdd" id="addEvent" value="+"/>
    </div>
    <div class="container" :style='container'>
      <!-- <div v-for="ev in events"></div> -->
    </div>
    <div class="edit" :style='editMode'>
      <br>
      <h2>Bitte Beginn und Ende des Termins als String angeben: 'hh:mm'</h2>
      <input type="text" v-model="startTimeInput" placeholder="Beginn"/>
      <input v-model="endTimeInput" placeholder="Ende"/>
      <input type="button" id="save" value="save" @click="save"/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dayNumber: '',
      weekday: '',
      editMode: 'visibility: hidden;',
      container: 'visibility: visible;',
      events: [],
      eventsInColumns: [],
      startTimeInput: '',
      endTimeInput: ''
    }
  },
  methods: {
    clickAdd() {
      this.container = 'visibility: hidden;'
      this.editMode = 'visibility: visible;'
    },
    save() {
      if (this.startTimeInput !== '' & this.endTimeInput !== '') {
        // very short and (too) simple test: inputs shall be in format hh:mm
        if (this.startTimeInput.indexOf(':') !== -1 &
              this.endTimeInput.indexOf(':') !== -1) {
          const _s = this.startTimeInput.split(':')
          const start = new Date()
          start.setUTCHours(_s[0], _s[1], 0, 0)
          // convert endTime string to Date format
          const _e = this.endTimeInput.split(':')
          const end = new Date()
          end.setUTCHours(_e[0], _e[1], 0, 0)
          this.events.push({
            id: this.events.length,
            startTime: start,
            endTime: end,
            timeSpan: end - start
          })
          this.startTimeInput = ''
          this.endTimeInput = ''
        } else {
          alert('Bitte auf das Eingabeformat achten: hh:mm')
        }
      }
      if (this.events.length > 1) {
        this.sortEvents()
        this.distributeEventsToColumns()
        this.maximizeUsedSpace()
        this.calculateWidthAndLeft(96) // width = 96%
        // console.log(this.events)
      }
      console.log(this.events)
      this.editMode = 'visibility: hidden;'
      this.container = 'visibility: visible'
    }, // end of save
    sortEvents() {
      // sort events by startTime and time span
      this.events.sort((a, b) => {
        return a.startTime - b.startTime || b.timeSpan - a.timeSpan
      })
    },
    distributeEventsToColumns() {
      let eventsColumwise = [
        [this.events[0]]
      ]
      for (let i = 1; i < this.events.length; i++) {
        let compareDate1 = this.events[i].startTime
        let compareDate2 = {}
        for (let j = 0; j < eventsColumwise.length; j++) {
          compareDate2 = eventsColumwise[j][eventsColumwise[j].length - 1].endTime
          // If startTime[i] is later or equal to the last endTime in this column,
          // allEvents[i] will be placed in the same column. Otherwise start a new
          // list column.
          if (compareDate1 >= compareDate2) {
            eventsColumwise[j].push(this.events[i])
            break
          }
          if (j === eventsColumwise.length - 1) {
            eventsColumwise.push([])
            eventsColumwise[j + 1].push(this.events[i])
            break
          }
        }
      }
      this.eventsInColumns = eventsColumwise
    }, // end of distributeEventsToColumns
    maximizeUsedSpace() {
      const eventsColumwise = this.eventsInColumns
      // Iterate through every event in every column and look if there is enough
      // space for an event[i, j] in the following column.
      // let events = eventsInColumns
      for (let i = 0; i < eventsColumwise.length - 1; i++) { // columwise
        for (let j = 0; j < eventsColumwise[i].length; j++) { // rowwise
          let compareDate1 = eventsColumwise[i][j].startTime
          // Compare the current start time with the end time of the last event
          // in the following column
          let compareDate2 = eventsColumwise[i + 1].slice(-1)[0].endTime
          if (compareDate1 >= compareDate2) {
            eventsColumwise[i + 1].push(eventsColumwise[i][j])
          }
        }
      }
      this.eventsInColumns = eventsColumwise
    }, // end of maximizeUsedSpace
    calculateWidthAndLeft(width = 96) { // default is 96(%)
      const allIDs = []
      this.events.forEach(obj => allIDs.push(obj.id))
      // at first get information about left property
      console.log(allIDs)
      for (let ID = 0; ID < allIDs.length; ID++) { // get information for every ID
        console.log(allIDs[ID])
        console.log(this.events[ID])
        let objectToCompare = this.events.filter(obj => {
          console.log(obj.id === allIDs[ID])
          obj.id === allIDs[ID]
        })[0]
        console.log(objectToCompare)
        const index = this.events.indexOf(objectToCompare)
        console.log(index)
        for (let i = 0; i < this.eventsInColumns.length; i++) { // columnwise
          let objectToAnalyse = this.eventsInColumns[i].filter(obj => {
            obj.id === allIDs[ID]
          })
          console.log(objectToAnalyse)
          if (objectToAnalyse.length !== 0) {
            if (typeof this.events[index].column === 'undefined') {
              this.events[index].column = i
            }
            if (typeof this.events[index].widthAbs === 'undefined') {
              this.events[index].widthAbs = 1
            } else {
              this.events[index].widthAbs += 1
            }
          }
        }
      }
      // console.log(this.events.forEach(obj => obj.column))
      // // convert column and width to percentaged specifications
      // let numberOfColumns = []
      // this.events.forEach(obj => numberOfColumns.push(obj.column))
      // numberOfColumns = Math.max(...numberOfColumns)
      // for (let ID = 0; ID < this.events.length; ID++) {
      //   this.events[ID].left = this.events[ID].column *
      //     (width / (numberOfColumns + 1))
      //   this.events[ID].width = this.events[ID].widthAbs *
      //     (width / (numberOfColumns + 1))
      // }
    } // end of calculateWidthAndLeft
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.day {
  border: 1px solid black;
  background-color: rgba(51, 50, 250, .3);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 80px;
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
.edit {
  border: 1px solid black;
}
.container{
    position:relative;
    border:1px solid rgba(51, 50, 250, .7);
}
#addEvent {
  align-self: start;
  height: 80px;
  font-size: 400%;
  background-color: orange;
}
</style>
