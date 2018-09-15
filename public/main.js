// Remember the rules
// 1) Events must not overlap
// 2) The “earlier” the start time, the further left the event is positioned
// 3) The longer the duration of the event, the further left the event is positioned
// 4) The space must be used fully
// create example data
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
module.exports = allDates

function distributeEventsToColumns (allDates) {
  // sort events by start time followed by time span
  let events = allDates.sort((a, b) => {
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
console.log(eventListToRender)

// identify the timespan of all dates on one day
function extractMaximumTimespan (allDatesArray, detailed = false) {
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
  if (detailed) return [earliestDate, latestDate] // only for debugging
  return latestDate - earliestDate
}
// function to calculate the display's span (y-axis)
// 'datesPercentage' represents the part of the display which will be covered
// by dates
function calculateDisplaySpan (maximumTimespan, datesPercentage = 0.85) {
  // since maximumTimespan = datesPercentag * displaySpan
  return maximumTimespan / datesPercentage // = displaySpan
}
