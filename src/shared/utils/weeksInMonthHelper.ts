type CalendarDay = {
  date: Date
  day: number
  inCurrentMonth: boolean
}

type CalendarWeek = {
  week: number
  start: Date
  end: Date
  days: CalendarDay[]
}

// dimulai dari senin
export default function getWeeksInMonth(year: number, month: number): CalendarWeek[] {
  // month: 0 = Januari, 8 = September
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // Ubah JS Sunday=0 menjadi Monday=0
  const firstDayOnMonth = firstDay.getDay()

  const daysUntilMonday = (8 - firstDayOnMonth) % 7

  // Senin pada minggu pertama
  const calendarStart = new Date(year, month, 1 + daysUntilMonday)

  // Minggu pada minggu terakhir
  const lastDayIndex = (lastDay.getDay() + 6) % 7
  const calendarEnd = new Date(year, month, lastDay.getDate() + (6 - lastDayIndex))

  const weeks: CalendarWeek[] = []

  const current = new Date(calendarStart)
  let weekNumber = 1

  while (current <= calendarEnd) {
    const days: CalendarDay[] = []

    for (let i = 0; i < 7; i++) {
      const date = new Date(current)

      days.push({
        date,
        day: date.getDate(),
        inCurrentMonth: date.getMonth() === month,
      })

      current.setDate(current.getDate() + 1)
    }

    weeks.push({
      week: weekNumber,
      start: days[0]!.date,
      end: days[6]!.date,
      days,
    })

    weekNumber++
  }

  return weeks
}
