import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ConstraintComponentProps } from "@/constraints/type"
import { WeekdayConstraint } from "@/constraints/weekday/instance"
import { Weekday, fromDateToWeekday } from "@/constraints/weekday/type"
import React, { useImperativeHandle, useRef } from "react"

export const WeekdayComponent = React.forwardRef<
  React.ElementRef<"input">,
  ConstraintComponentProps<Date, WeekdayConstraint>
>(function WeekdayComponentComponent(
  { onConstraintChange, constraint, value },
  ref
) {
  const valueFinal = useRef(constraint)
  const weekdays: Weekday[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]

  useImperativeHandle(constraint.ref, () => ({
    pulse() {
      console.log("Pulsing from ", '<SelectTrigger className="w-[180px]">')
    },
  }))

  function dispatchNewValue() {
    onConstraintChange(valueFinal.current)
  }

  return (
    <div className="flex px-2 justify-between">
      <div className="flex flex-col">
        <strong>Weekday:</strong>
        <Select
          onValueChange={(wd: Weekday) => {
            const [notAllowed] = constraint.check(fromDateToWeekday(value), wd)
            if (notAllowed) {
              return console.log(
                "Constraint validation: weekday should match the input selected weekday."
              )
            }
            valueFinal.current.weekday = wd
            dispatchNewValue()
          }}
          value={constraint.weekday}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={constraint.weekday} />
          </SelectTrigger>
          <SelectContent>
            {weekdays.map(weekday => (
              <SelectItem
                key={weekday}
                value={weekday}
              >
                {weekday}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
})
