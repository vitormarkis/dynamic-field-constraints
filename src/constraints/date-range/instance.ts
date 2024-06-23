import { bad, nice } from "@/utils"

export type ConstraintType<T = any> = {
  name: string
  validate(data: T): [string, undefined] | [undefined, T]
  slug: string
}

type ConstraintInitProps = {
  init: {
    startDate: Date
    endDate: Date
  }
}

type ConstraintInitName = {
  name: "DATE_RANGE"
}

export class DateRangeConstraint {
  startDate: Date
  endDate: Date

  constructor(props: ConstraintInitProps["init"]) {
    this.startDate = props.startDate
    this.endDate = props.endDate
  }

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

  static restore(payload: string) {
    return new DateRangeConstraint(JSON.parse(payload))
  }

  static serialize({ init, name }: ConstraintInitProps & ConstraintInitName) {
    const nameStr = JSON.stringify(name)
    const initStr = JSON.stringify(init)
    return `${nameStr}~~${initStr}`
  }

  dispatch() {
    return DateRangeConstraint.serialize({
      init: {
        endDate: this.endDate,
        startDate: this.startDate,
      },
      name: "DATE_RANGE",
    })
  }
}

export type Constraint = DateRangeConstraint
