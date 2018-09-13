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

// function to convert the number of overlapping events to the specification of
// the 'width' property in css
function convertOverlappingEventsToPercentagedWidth (maxNumberOfOverlaps,
  )
