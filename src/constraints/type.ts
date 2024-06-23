import { DateRangeConstraint } from "@/constraints/date-range/instance"
import { WeekdayConstraint } from "@/constraints/weekday/instance"
import { only } from "@/utils"

export type ConstraintClass = WeekdayConstraint | DateRangeConstraint
export type Constraint = (typeof ConstraintSlugMap)[number]

export const ConstraintSlugMap = only([
  {
    slug: "DATE_RANGE",
    value: DateRangeConstraint["prototype"],
  },
  {
    slug: "WEEKDAY",
    value: WeekdayConstraint["prototype"],
  },
])
