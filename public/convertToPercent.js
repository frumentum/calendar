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

module.exports = allDates

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

// function to convert duration of an event to percentaged specification of the
// 'height' property in css
function convertDurationToPercentagedHeight (duration, displaySpan) {
  // since duration = displaySpan * x and the specification is expressed as a
  // percentage (not decimal number):
  return (duration / displaySpan) * 100
}

// function to convert start time of an event to percentaged specification of
// the 'top' property in css
function convertStartTimeToPercentagedTop (startTimeEarliestDate,
  startTimeDateToConvert, displaySpan, percentToAddBeforeEarliestDate = 10) {
  let durationBetweenTwoStartTimes = startTimeDateToConvert -
    startTimeEarliestDate
  // since the percentaged specification of 'top' is the space above the
  // earliest date's start time plus the duration between the two start times,
  // specification of 'top' is expressed as follows:
  return ((durationBetweenTwoStartTimes / displaySpan) * 100) +
    percentToAddBeforeEarliestDate
}

// function which uses information about overlapping events to calculate the
// 'width' and 'left' property in CSS
function calculateWidthAndLeftForCSS (
  eventID, overlappedDates, frameWidth = 96
) {
  let allInvolvedIDs = overlappedDates.id1.concat(overlappedDates.id2)
  allInvolvedIDs = [...new Set(allInvolvedIDs)].sort((a, b) => a - b)
  // if eventID is not overlapping with any other event, it will get the whole
  // width beginning from the left
  if (!allInvolvedIDs.includes(eventID)) return {left: 0, width: frameWidth}
  // let id2 = overlappedDates.id2
  // how often appears an element in array id2?
  let id2 = overlappedDates.id2.reduce(function (accumulator, currentValue) {
    if (typeof accumulator[currentValue] === 'undefined') {
      accumulator[currentValue] = 1
    } else {
      accumulator[currentValue] += 1
    }
    return accumulator
  }, {})
  // filter that id which overlaps the most
  console.log(id2)
  console.log(Object.values(id2))
  const maxNumber = Math.max(...Object.values(id2))
  console.log(maxNumber)

  console.log(allInvolvedIDs)
}
console.log(calculateWidthAndLeftForCSS(0, overlappedDates))
