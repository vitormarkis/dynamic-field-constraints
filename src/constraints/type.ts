import { DateRangeConstraint } from "@/constraints/date-range/instance"
import { WeekdayConstraint } from "@/constraints/weekday/instance"
import { only } from "@/utils"
import React from "react"

export type ConstraintClass = WeekdayConstraint | DateRangeConstraint

export type ConstraintSlug = "DATE_RANGE" | "WEEKDAY"
export type ConstraintsUnion = {
  slug: ConstraintSlug
  value: GenericConstraint
}

export const ConstraintSlugMap: ConstraintsUnion[] = only([
  {
    slug: "DATE_RANGE",
    value: DateRangeConstraint["prototype"],
  },
  {
    slug: "WEEKDAY",
    value: WeekdayConstraint["prototype"],
  },
])

export type ConstraintComponentProps<
  TValue = any,
  TConstraint extends GenericConstraint<any> = GenericConstraint<any>
> = {
  constraint: TConstraint
  value: TValue
  onConstraintChange(value: TConstraint): void
}

export type GenericConstraint<T = any> = {
  name: string
  slug: ConstraintSlug
  validate(value: T): [string, undefined] | [undefined, T]
  dispatch(): string
  check(value: T, newValue: T): [nowAllowed: boolean]
  ref: React.RefObject<{
    pulse(): void
  }>
}
