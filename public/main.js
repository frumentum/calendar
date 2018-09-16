// Remember the rules
// 1) Events must not overlap
// 2) The “earlier” the start time, the further left the event is positioned
// 3) The longer the duration of the event, the further left the event is positioned
// 4) The space must be used fully
// create example data
// let infos = require('./public/helperFunctions.js')
let allDates = []
addDate('09:00', '14:30', allDates)
addDate('09:00', '15:30', allDates)
addDate('09:30', '11:30', allDates)
addDate('11:30', '12:00', allDates)
addDate('14:30', '15:00', allDates)
addDate('15:30', '16:00', allDates)

function addDate (startTime, endTime, allDatesArray) {
  // convert startTime string to Date format
  const _s = startTime.split(':')
  let start = new Date()
  start.setUTCHours(_s[0], _s[1], 0, 0)
  // convert endTime string to Date format
  const _e = endTime.split(':')
  let end = new Date()
  end.setUTCHours(_e[0], _e[1], 0, 0)

  // add start and end time to the allDates array
  allDatesArray.push({
    startTime: start,
    endTime: end,
    id: allDatesArray.length + 1,
    timeSpan: end - start
  })
}

function distributeEventsToColumns (allDatesArray) {
  // sort events by start time followed by time span
  let events = allDatesArray.sort((a, b) => {
    return a.startTime - b.startTime || b.timeSpan - a.timeSpan
  })
  // Iterate through each event and place it as much left as possible.
  let eventsInColumns = [
    [events[0]]
  ]
  for (let i = 1; i < events.length; i++) {
    let compareDate1 = events[i].startTime
    let compareDate2 = {}
    for (let j = 0; j < eventsInColumns.length; j++) {
      compareDate2 = eventsInColumns[j][eventsInColumns[j].length - 1].endTime
      // If startTime[i] is later or equal to the last endTime in this column,
      // allDates[i] will be placed in the same column. Otherwise start a new
      // list column.
      if (compareDate1 >= compareDate2) {
        eventsInColumns[j].push(events[i])
        break
      }
      if (j === eventsInColumns.length - 1) {
        eventsInColumns.push([])
        eventsInColumns[j + 1].push(events[i])
        break
      }
    }
  }
  return eventsInColumns
}
const eventsInColumns = distributeEventsToColumns(allDates)

function maximizeUsedSpace (eventsInColumns) {
  // Iterate through every event in every column and look if there is enough
  // space for an event[i, j] in the following column.
  // let events = eventsInColumns
  for (let i = 0; i < eventsInColumns.length - 1; i++) { // columwise
    for (let j = 0; j < eventsInColumns[i].length; j++) { // rowwise
      let compareDate1 = eventsInColumns[i][j].startTime
      // Compare the current start time with the end time of the last event
      // in the following column
      let compareDate2 = eventsInColumns[i + 1].slice(-1)[0].endTime
      if (compareDate1 >= compareDate2) {
        eventsInColumns[i + 1].push(eventsInColumns[i][j])
      }
    }
  }
  return eventsInColumns
}
const eventListToRender = maximizeUsedSpace(eventsInColumns)

// function to calculate width and left property for css
function calculateWidthAndLeft (eventList, allDatesArray) {
  // sort allDatesArray
  let events = allDatesArray.sort((a, b) => {
    return a.startTime - b.startTime || b.timeSpan - a.timeSpan
  })
  let allIDs = []
  events.forEach(obj => allIDs.push(obj.id))
  // at first get information about left property
  for (let ID = 0; ID < allIDs.length; ID++) { // get information for every ID
    for (let i = 0; i < eventList.length; i++) { // columnwise
      let check = eventList[i].filter(obj => obj.id === allIDs[ID])
      if (check.length !== 0) {
        const objectToCompare = events.filter(obj => obj.id === allIDs[ID])[0]
        const index = events.indexOf(objectToCompare)
        if (typeof events[index].column === 'undefined') {
          events[index].column = i
        }
        if (typeof events[index].width === 'undefined') {
          events[index].width = 1
        } else {
          events[index].width += 1
        }
      }
    }
  }
  return events
}
console.log(calculateWidthAndLeft(eventListToRender, allDates))

// identify the timespan of all dates on one day
function calculateDisplaySpanInMS (allDatesArray, datesPercentage = 0.85) {
  let tmpTime = [] // dummy variable
  // extract the earliest date
  allDatesArray.forEach(obj => tmpTime.push(obj.startTime))
  const earliestDate = tmpTime.reduce(function (pre, cur) {
    return Date.parse(pre) > Date.parse(cur) ? cur : pre
  })
  // the same for the latest date
  tmpTime = [] // overwrite it again
  allDates.forEach(obj => tmpTime.push(obj.endTime))
  const latestDate = tmpTime.reduce(function (pre, cur) {
    return Date.parse(pre) < Date.parse(cur) ? cur : pre
  })
  // result is the maximum timespan
  // if (detailed) return [earliestDate, latestDate] // only for debugging
  const maximumTimespan = latestDate - earliestDate
  return Math.floor(maximumTimespan / datesPercentage)
}
const displaySpan = calculateDisplaySpanInMS(allDates)

// function to convert duration of an event to percentaged specification of the
// 'height' property in css and start time of an event to percentaged
// specification of the 'top' property in css
function convertStarTimeTimeSpanToTopHeight (
  allDatesArray, displaySpan, percentToAddBeforeEarliestEvent = 10
) {
  let events = allDatesArray.sort((a, b) => {
    return a.startTime - b.startTime || b.timeSpan - a.timeSpan
  })
  const earliestStartTime = events[0].startTime
  let allIDs = []
  events.forEach(obj => allIDs.push(obj.id))

  for (let ID = 0; ID < allIDs.length; ID++) {
    let ev = events[ID]
    // since timespan = displaySpan * x and the specification is expressed as a
    // percentage (not decimal number):
    events[ID].height = (ev.timeSpan / displaySpan) * 100
    let dummyDifference = ev.startTime - earliestStartTime
    // since the percentaged specification of 'top' is the space above the
    // earliest date's start time plus the duration between the two start times,
    // specification of 'top' is expressed as follows:
    events[ID].top = ((dummyDifference / displaySpan) * 100) +
      percentToAddBeforeEarliestEvent
  }
  return events
}
console.log(convertStarTimeTimeSpanToTopHeight(allDates, displaySpan))

// function to render the event list
function renderEventList (
  eventList, frameWidth = 96
) {
  // at first render current day
  const dayNames = [
    'Sonntag',
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag'
  ]
  const dayName = dayNames[eventList[0][0].startTime.getDay()]
  const dayDate = eventListToRender[0][0].startTime.getDate()
  document.getElementById('dayNumber').innerHTML = `<b>${dayDate}</b>`
  document.getElementById('weekday').innerHTML = `${dayName}`
}

// window.onload = function () {
//   renderEventList(eventListToRender)
// }
