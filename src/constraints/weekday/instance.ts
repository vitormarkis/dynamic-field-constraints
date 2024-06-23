import { ConstraintSlug, GenericConstraint } from "@/constraints/type"
import { Weekday } from "@/constraints/weekday/type"
import { bad, nice } from "@/utils"
import { RefObject, createRef } from "react"

type ConstraintInitProps = {
  init: {
    weekday: Weekday
  }
}

type ConstraintInitName = {
  name: "WEEKDAY"
}

export class WeekdayConstraint implements GenericConstraint<Weekday> {
  name: string = "Weekday"
  slug: ConstraintSlug = "WEEKDAY"
  ref: RefObject<{ pulse(): void }>

  weekday: Weekday

  constructor(props: ConstraintInitProps["init"]) {
    this.weekday = props.weekday
    this.ref = createRef()
  }

  check(value: Weekday, newValue: Weekday): [nowAllowed: boolean] {
    if (value !== newValue) {
      return [true]
    }
    return [false]
  }

  validate(value: Weekday) {
    if (value !== this.weekday) {
      return bad("WRONG_WEEKDAY")
    }

    return nice(value)
  }

  dispatch() {
    return WeekdayConstraint.serialize({
      init: {
        weekday: this.weekday,
      },
      name: "WEEKDAY",
    })
  }

  static restore(payload: string) {
    return new WeekdayConstraint(JSON.parse(payload))
  }

  static serialize({ init, name }: ConstraintInitProps & ConstraintInitName) {
    const nameStr = name
    const initStr = JSON.stringify(init)
    return `${nameStr}~~${initStr}`
  }
}
