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

function testOverlappingDate (date1, date2, includeDescription = false) {
  if (date1.endTime > date2.startTime) {
    if (includeDescription) {
      return `date ${date1.id} and date ${date2.id} are overlapping!`
    } else {
      return true
    }
  } else {
    if (includeDescription) {
      return `date ${date1.id} and date ${date2.id} are NOT overlapping!`
    } else {
      return false
    }
  }
}

// function getDate (time) {
//   let today = new Date()
//   let _t = time.split(':')
//   today.setHours(_t[0], _t[1], 0, 0)
//   return today
// }

let allDates = []

addDate('09:00', '15:30')
addDate('09:00', '14:30')
addDate('09:30', '11:30')
addDate('11:30', '12:00')
addDate('14:30', '15:00')
addDate('15:30', '16:00')

console.log(testOverlappingDate(allDates[0], allDates[1], true))
console.log(testOverlappingDate(allDates[4], allDates[5], true))
