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

// export module
module.exports = {
  maximumTimespan: maximumTimespan,
  displaySpan: displaySpan
}
console.log([maximumTimespan, displaySpan])
