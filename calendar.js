function addDate (startTime, endTime) {
  // convert startTime string to Date format
  const _s = startTime.split(':')
  let start = new Date()
  start.setUTCHours(_s[0], _s[1])
  // convert endTime string to Date format
  const _e = endTime.split(':')
  let end = new Date()
  end.setUTCHours(_e[0], _e[1])

  // add start and end time to the allDates array
  allDates.push({
    startTime: start,
    endTime: end,
    id: allDates.length + 1,
    timeSpan: end - start
  })
  // sort the array by the timespan: the greater timespans come first!
  sortAllDates(allDates)
}

function sortAllDates (allDatesArray) {
  if (allDatesArray.length >= 2) {
    // sort dates by timespan
    allDatesArray.sort((a, b) => b.timeSpan - a.timeSpan)
    // rewrite the date IDs; To do this create a sequence of new IDs
    const newIDs = Array.from(
      new Array(allDatesArray.length), (val, index) => index + 1
    )
    for (let i = 0; i < allDatesArray.length; i++) {
      allDatesArray[i].id = newIDs[i] // replace id by the new one
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

// create an array containing the dates as objects
let allDates = []
addDate('09:00', '14:30')
addDate('09:00', '15:30')
addDate('09:30', '11:30')
addDate('11:30', '12:00')
addDate('14:30', '15:00')
addDate('15:30', '16:00')
console.log(allDates)

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
  return resultArray.filter(object => object.return)
}
const overlappedDates = filterOverlappingDates(allDates)
console.log(overlappedDates)

// identify the span of all dates of the requested day
// console.log(allDates)
let tmpTime = []
allDates.forEach(object => tmpTime.push(object.startTime))
const earliestDate = tmpTime.reduce(function (pre, cur) {
  return Date.parse(pre) > Date.parse(cur) ? cur : pre
})
// the same for the latest date
tmpTime = [] // overwrite it again
allDates.forEach(object => tmpTime.push(object.endTime))
const latestDate = tmpTime.reduce(function (pre, cur) {
  return Date.parse(pre) < Date.parse(cur) ? cur : pre
})
const maximumTimeSpan = latestDate - earliestDate
console.log(maximumTimeSpan)
