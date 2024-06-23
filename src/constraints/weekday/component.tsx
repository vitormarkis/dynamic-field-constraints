import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WeekdayConstraint } from "@/constraints/weekday/instance"
import { Weekday } from "@/constraints/weekday/type"
import React, { useRef } from "react"

export type WeekdayComponentProps = {
  value: WeekdayConstraint
  onChange(value: WeekdayConstraint): void
}

export const WeekdayComponent = React.forwardRef<
  React.ElementRef<"input">,
  WeekdayComponentProps
>(function WeekdayComponentComponent({ onChange, value }, ref) {
  const valueFinal = useRef(value)
  const weekdays: Weekday[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]

  function dispatchNewValue() {
    onChange(valueFinal.current)
  }

  return (
    <div className="flex px-2 justify-between">
      <div className="flex flex-col">
        <strong>Weekday:</strong>
        <Select
          onValueChange={(wd: Weekday) => {
            valueFinal.current.weekday = wd
            dispatchNewValue()
          }}
          value={value.weekday}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={value.weekday} />
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
