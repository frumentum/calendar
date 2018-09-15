const allDates = require('./public/dates.js')

// function to iterate throug all combinations of events to filter the
// overlapping events
function filterOverlappingDates (allDatesArray, output = 'onlyID') {
  // iterate through every combination of events and look which ones overlap!
  // start at the first event, i = 0, ...
  let resultArray = []
  for (let i = 0; i + 1 < allDatesArray.length; i++) {
    // ... and compare with all events that follow afterwards, j = i + 1
    for (let j = i + 1; j < allDatesArray.length; j++) {
      resultArray.push(
        testOverlappingDate(allDatesArray[i], allDatesArray[j])
      )
    }
  }
  // filter those event combinations as an array which are overlapping
  const overlappedDates = resultArray.filter(object => object.return)
  if (output === 'arrayWithObjects' |
    overlappedDates.length === 0) return overlappedDates
  // extract only the IDs from the objects
  if (output === 'onlyID') {
    let id1 = []
    let id2 = []
    overlappedDates.forEach(obj => {
      id1.push(obj.id1)
      id2.push(obj.id2)
    })
    return {id1: id1, id2: id2}
  }
}

// define function to test if two events are overlapping!
function testOverlappingDate (event1, event2) {
  let infoAboutOverlapping = {
    id1: event1.sortedOrder,
    id2: event2.sortedOrder
  }
  infoAboutOverlapping.return = event1.endTime > event2.startTime
  infoAboutOverlapping.string = 'date ' + event1.sortedOrder + ' and date ' +
    event2.sortedOrder + ' are overlapping: ' + infoAboutOverlapping.return
  return infoAboutOverlapping
}
const overlappedDates = filterOverlappingDates(allDates, 'onlyID')

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

// function to convert miliseconds to hours
function parseMillisecondsIntoReadableTime (milliseconds) {
  // Get hours from milliseconds
  const hours = milliseconds / (1000 * 60 * 60)
  const absoluteHours = Math.floor(hours)
  const h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours

  // Get remainder from hours and convert to minutes
  const minutes = (hours - absoluteHours) * 60
  const absoluteMinutes = Math.floor(minutes)
  const m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes

  // Get remainder from minutes and convert to seconds
  const seconds = (minutes - absoluteMinutes) * 60
  const absoluteSeconds = Math.floor(seconds)
  const s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds

  return h + ':' + m + ':' + s
}
// check output of time spans
const maximumTimespan = extractMaximumTimespan(allDates) // detailed === false
// that the output is a number, not an array
const displaySpan = calculateDisplaySpan(maximumTimespan)

// export module
module.exports = {
  overlappedDates: overlappedDates,
  maximumTimespan: maximumTimespan,
  displaySpan: displaySpan
}

// For DEBUGGING!
// if (typeof maximumTimespan === 'number') {
//   const displaySpan = calculateDisplaySpan(maximumTimespan)
//   console.log(
//     `display span in time: ${parseMillisecondsIntoReadableTime(displaySpan)}`
//   )
//   console.log(
//     'maximum time span in time: ' +
//     parseMillisecondsIntoReadableTime(maximumTimespan)
//   )
// } else {
//   console.log(`date span, start and end time: ${maximumTimespan}`)
// }
