// create an array containing the dates as objects
let allDates = []
addDate('09:00', '14:30', allDates)
addDate('09:00', '15:30', allDates)
addDate('09:30', '11:30', allDates)
addDate('11:30', '12:00', allDates)
addDate('14:30', '15:00', allDates)
addDate('15:30', '16:00', allDates)
// sort the array by the timespan: the greater timespans come first!
addInfoAboutSorting(allDates)
createSortedNumbers(allDates)
console.log(allDates)

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

function addInfoAboutSorting (allDatesArray) {
  if (allDatesArray.length >= 2) {
    // sort by earliest event
    // extract all start times to an array
    let startTime = []
    allDatesArray.forEach(obj => startTime.push(obj.startTime.getTime()))
    // get unique values of start time
    const uniqueStartTime = [...new Set(startTime)]
    // now sort dates by earliest date
    uniqueStartTime.sort((a, b) => a - b)
    // now assign each object a number representing the order according to its
    // unique start time
    allDatesArray.forEach(obj => {
      obj.sortByStartTime = uniqueStartTime.indexOf(obj.startTime.getTime())
    })
    // sort by time span
    // the same for time span
    let timeSpan = []
    allDatesArray.forEach(obj => timeSpan.push(obj.timeSpan))
    // get unique values of time span
    const uniqueTimeSpan = [...new Set(timeSpan)]
    // sort the time spans: longest first
    uniqueTimeSpan.sort((a, b) => b - a)
    // now assign each object a number representing the order according to its
    // unique time span
    allDatesArray.forEach(obj => {
      obj.sortByTimeSpan = uniqueTimeSpan.indexOf(obj.timeSpan)
    })
  }
}

// Create sorted numbers to get the 'real' order we can use later to define the
// right places for each event/date/box.
function createSortedNumbers (allDatesArray) {
  let startTime = []
  allDatesArray.forEach(obj => startTime.push(obj.sortByStartTime))
  let timeSpan = []
  allDatesArray.forEach(obj => timeSpan.push(obj.sortByTimeSpan))
  for (let i = 0; i < startTime.length; i++) {
    // last case at first: if i is startTime.length - 1 , startTime[i + 1]
    // doesn't exist. In this case look at the last sortedOrder and check its
    // number
    if (i === startTime.length - 1) {
      const compare1 = allDatesArray[i - 1].sortedOrder
      const compare2 = allDatesArray[i - 1].sortByStartTime
      // if the last sortedOrder was the result of starTime, this sortedOrder
      // would be the result of startTime, too. Otherwise it results from
      // time span!
      if (compare1 === startTime.indexOf(compare2)) {
        allDatesArray[i].sortedOrder = startTime.indexOf(startTime[i])
      } else {
        allDatesArray[i].sortedOrder = timeSpan.indexOf(timeSpan[i])
      }
      // at least sort the objects of allDatesArray by its sortedOrder
      allDatesArray.sort((a, b) => a.sortedOrder - b.sortedOrder)
      break
    }
    let compare1 = startTime[i]
    let compare2 = startTime[i + 1]
    if (compare1 < compare2) {
      allDatesArray[i].sortedOrder = startTime.indexOf(compare1)
      continue
    }
    if (compare1 > compare2) {
      // Because allDatesArray's objects are ordered by start time, this case
      // should not occure!
      console.log(`An error occured: startTime[${i}] > startTime[${i + 1}]`)
      break
    }
    // if we get here, startTime[i] and startTime[i + 1] will be identically.
    // So let's see, if their time spans differ!
    compare1 = timeSpan[i]
    compare2 = timeSpan[i + 1]
    if (compare1 <= compare2) {
      // If the first event takes longer or is identically to the second one,
      // use the index of the first one to set sortedOrder.
      allDatesArray[i].sortedOrder = timeSpan.indexOf(compare1)
      continue
    } else {
      // Otherwise use the second event!
      allDatesArray[i].sortedOrder = timeSpan.indexOf(compare2)
    }
  }
}

function testOverlappingDate (date1, date2) {
  let infoAboutOverlapping = {
    id1: date1.id,
    id2: date2.id
  }
  infoAboutOverlapping.return = date1.endTime > date2.startTime
  let tmpString = `date ${date1.id} and date ${date2.id} are overlapping:`
  infoAboutOverlapping.string = `${tmpString} ${infoAboutOverlapping.return}`
  return infoAboutOverlapping
}

function filterOverlappingDates (dateArray) {
  // iterate through every combination of dates and look which ones overlap
  // start at the first date, i = 0, ...
  let resultArray = []
  for (let i = 0; i + 1 < dateArray.length; i++) {
    // ... and compare with all dates that follow afterwards, j = i + 1
    for (let j = i + 1; j < dateArray.length; j++) {
      resultArray.push(testOverlappingDate(dateArray[i], dateArray[j]))
    }
  }
  // filter those date combinations as an array which are overlapping
  const overlappedDates = resultArray.filter(object => object.return)
  if (overlappedDates.length) {
    return overlappedDates
  } else {
    return 'There are no overlapping dates!'
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

// function to sort by start time
function sortByStartTime (allDatesArray) {
  allDatesArray.sort((a, b) => a.startTime - b.startTime)
}

// Remember the rules
// 1) Events must not overlap
// 2) The “earlier” the start time, the further left the event is positioned
// 3) The longer the duration of the event, the further left the event is positioned
// 4) The space must be used fully
