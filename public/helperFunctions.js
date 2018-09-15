const allDates = require('./public/main.js')

// check output of time spans
const maximumTimespan = extractMaximumTimespan(allDates) // detailed === false
// that the output is a number, not an array
const displaySpan = calculateDisplaySpan(maximumTimespan)

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
  return Math.floor(maximumTimespan / datesPercentage) // = displaySpan
}

// export module
module.exports = {
  maximumTimespan: maximumTimespan,
  displaySpan: displaySpan
}
console.log([maximumTimespan, displaySpan])
