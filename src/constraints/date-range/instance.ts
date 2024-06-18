import { bad, nice } from "@/utils"

export type ConstraintType<T = any> = {
  name: string
  validate(data: T): [string, undefined] | [undefined, T]
  slug: string
}

export class DateRangeConstraint {
  constructor(public startDate: Date, public endDate: Date) {}

  name = "Date Range"
  slug = "DATE_RANGE" as const

  validate(value: Date) {
    if (this.startDate && value.getTime() < this.startDate.getTime()) {
      return bad("BEFORE_ALLOWED")
    }
    if (this.endDate && value.getTime() > this.endDate.getTime()) {
      return bad("AFTER_ALLOWED")
    }

    return nice(value)
  }

  dispatch() {
    return JSON.stringify({
      fields: {
        startDate: this.startDate,
        endDate: this.endDate,
      },
    })
  }
}

export type Constraint = DateRangeConstraint
