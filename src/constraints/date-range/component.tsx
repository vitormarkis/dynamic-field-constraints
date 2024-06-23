import { DateRangeConstraint } from "@/constraints/date-range/instance"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import React, { useImperativeHandle, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ConstraintComponentProps } from "@/constraints/type"
import { cn } from "@/lib/utils"

export const DateRangeComponent = React.forwardRef<
  React.ElementRef<"input">,
  ConstraintComponentProps<Date, DateRangeConstraint>
>(function DateRangeComponentComponent(
  { onConstraintChange, constraint, value },
  ref
) {
  const [min, setMin] = useState(constraint.startDate)
  const [max, setMax] = useState(constraint.endDate)
  const valueFinal = useRef(constraint)

  function dispatchNewValue() {
    onConstraintChange(valueFinal.current)
  }

  return (
    <div className="flex px-2 justify-between">
      <div className="flex flex-col">
        <strong>min</strong>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !min && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span suppressHydrationWarning>
                {min ? format(min, "PPP") : "Pick a mindate"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={min}
              onSelect={newValue => {
                if (!newValue) return
                const [notAllowed] = constraint.check(value, newValue)
                if (notAllowed) {
                  return console.log(
                    "Constraint validation: Can't be after the current date."
                  )
                }
                setMin(newValue)
                valueFinal.current.startDate = newValue
                dispatchNewValue()
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col">
        <strong>max</strong>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !max && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span suppressHydrationWarning>
                {max ? format(max, "PPP") : "Pick a maxdate"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={max}
              onSelect={newValue => {
                if (!newValue) return
                const [notAllowed] = constraint.check(value, newValue)
                if (notAllowed) {
                  return console.log(
                    "Constraint validation: Can't be before the current date."
                  )
                }
                setMax(newValue)
                valueFinal.current.endDate = newValue
                dispatchNewValue()
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
})
