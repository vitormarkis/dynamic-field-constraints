export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday"

export function fromDateToWeekday(date: Date): Weekday {
  const index = date.getDay()
  return fromWeekdayIndexToWeekday(index)
}

export function fromWeekdayIndexToWeekday(idx: number): Weekday {
  if (idx === 0) return "Sunday"
  if (idx === 1) return "Monday"
  if (idx === 2) return "Tuesday"
  if (idx === 3) return "Wednesday"
  if (idx === 4) return "Thursday"
  if (idx === 5) return "Friday"
  if (idx === 6) return "Saturday"
  console.log(idx)
  throw new Error("Impossible case.")
}
