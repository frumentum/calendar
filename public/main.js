// import data array from dates.js
const allDates = require('./public/dates')

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

// function to iterate throug all combinations of events to filter the
// overlapping events
function filterOverlappingDates (allDatesArray) {
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
  if (overlappedDates.length) {
    return overlappedDates
  } else {
    return 'There are no overlapping events!'
  }
}
const overlappedDates = filterOverlappingDates(allDates)
if (overlappedDates.length) {
  let id2 = []
  overlappedDates.forEach(obj => id2.push(obj.id2))
  // how often appears an element in array id2?
  id2 = id2.reduce(function (accumulator, currentValue) {
    if (typeof accumulator[currentValue] === 'undefined') {
      accumulator[currentValue] = 1
    } else {
      accumulator[currentValue] += 1
    }
    return accumulator
  }, {})
  // filter that id which overlaps the most
  console.log(Object.values(id2))
  const maxNumber = Math.max(...Object.values(id2))
  const options = Object.entries(id2).filter(index => index[1] === maxNumber)
  let importantIDs = []
  options.forEach(i => importantIDs.push(parseInt(i[0]))) // extract IDs
  console.log(importantIDs)
}

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
const maximumTimespan = extractMaximumTimespan(allDates)
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
if (typeof maximumTimespan === 'number') {
  const displaySpan = calculateDisplaySpan(maximumTimespan)
  console.log(
    `display span in time: ${parseMillisecondsIntoReadableTime(displaySpan)}`
  )
  console.log(
    'maximum time span in time: ' +
    parseMillisecondsIntoReadableTime(maximumTimespan)
  )
} else {
  console.log(`date span, start and end time: ${maximumTimespan}`)
}

// Remember the rules
// 1) Events must not overlap
// 2) The “earlier” the start time, the further left the event is positioned
// 3) The longer the duration of the event, the further left the event is positioned
// 4) The space must be used fully
