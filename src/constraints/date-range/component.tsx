import { Input } from "@/components/ui/input"
import { DateRangeConstraint } from "@/constraints/date-range/instance"
import React, { useRef, useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type DateRangeComponentProps = {
  value: DateRangeConstraint
  onChange(value: DateRangeConstraint): void
}

export const DateRangeComponent = React.forwardRef<
  React.ElementRef<"input">,
  DateRangeComponentProps
>(function DateRangeComponentComponent({ onChange, value }, ref) {
  const [min, setMin] = useState(value.startDate)
  const [max, setMax] = useState(value.endDate)
  const valueFinal = useRef(value)

  function dispatchNewValue() {
    onChange(valueFinal.current)
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
              onSelect={v => {
                if (!v) return
                setMin(v)
                valueFinal.current.startDate = v!
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
              onSelect={v => {
                if (!v) return
                setMax(v!)
                valueFinal.current.endDate = v!
                dispatchNewValue()
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
})
