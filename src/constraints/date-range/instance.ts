import { GenericConstraint } from "@/constraints/type"
import { bad, nice } from "@/utils"
import { RefObject, createRef } from "react"

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

export class DateRangeConstraint implements GenericConstraint<Date> {
  startDate: Date
  endDate: Date
  ref: RefObject<{ pulse(): void }>

  constructor(props: ConstraintInitProps["init"]) {
    this.startDate = props.startDate
    this.endDate = props.endDate
    this.ref = createRef()
  }

  check(value: Date, newValue: Date): [nowAllowed: boolean] {
    if (value < this.startDate) return [true]
    if (value > this.endDate) return [true]
    return [false]
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
    const nameStr = name
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
