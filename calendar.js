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
    id: allDates.length + 1
  })
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

let allDates = []

addDate('09:00', '15:30')
addDate('09:00', '14:30')
addDate('09:30', '11:30')
addDate('11:30', '12:00')
addDate('14:30', '15:00')
addDate('15:30', '16:00')

// iterate through every combination of dates and look which ones overlap
// start at the first date, i = 0, ...
let resultArray = []
for (let i = 0; i + 1 < allDates.length; i++) {
  // ... and compare with all dates that follow afterwards, j = i + 1
  for (let j = i + 1; j < allDates.length; j++) {
    resultArray.push(testOverlappingDate(allDates[i], allDates[j]))
  }
}
// filter the date combinations which are overlapping
let resultIsTrue = resultArray.filter(object => object.return)
console.log(resultIsTrue)
