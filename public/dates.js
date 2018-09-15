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
