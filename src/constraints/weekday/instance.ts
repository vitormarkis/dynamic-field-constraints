import { Weekday } from "@/constraints/weekday/type"
import { bad, nice } from "@/utils"

export type ConstraintType<T = any> = {
  name: string
  validate(data: T): [string, undefined] | [undefined, T]
  slug: string
}

type ConstraintInitProps = {
  init: {
    weekday: Weekday
  }
}

type ConstraintInitName = {
  name: "WEEKDAY"
}

export class WeekdayConstraint {
  weekday: Weekday

  constructor(props: ConstraintInitProps["init"]) {
    this.weekday = props.weekday
  }

  name = "Weekday"
  slug = "WEEKDAY" as const

  validate(value: Date) {
    const weekdayIndex = value.getDay()
    const weekdayValue = mapWeekdayIndexToWeekday(weekdayIndex)
    if (weekdayValue !== this.weekday) {
      return bad("WRONG_WEEKDAY")
    }

    return nice(value)
  }

  static restore(payload: string) {
    return new WeekdayConstraint(JSON.parse(payload))
  }

  static serialize({ init, name }: ConstraintInitProps & ConstraintInitName) {
    const nameStr = JSON.stringify(name)
    const initStr = JSON.stringify(init)
    return `${nameStr}~~${initStr}`
  }

  dispatch() {
    return WeekdayConstraint.serialize({
      init: {
        weekday: this.weekday,
      },
      name: "WEEKDAY",
    })
  }
}

function mapWeekdayIndexToWeekday(idx: number): Weekday {
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
