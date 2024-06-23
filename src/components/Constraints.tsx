import { DateField } from "@/components/DateField"
import { Button } from "@/components/ui/button"
import { DateRangeComponent } from "@/constraints/date-range/component"
import {
  Constraint,
  DateRangeConstraint,
} from "@/constraints/date-range/instance"
import { cn } from "@/lib/utils"
import { only } from "@/utils"
import React, { useReducer, useState } from "react"

export type ConstraintsProps = React.ComponentPropsWithoutRef<"div">

export const Constraints = React.forwardRef<
  React.ElementRef<"div">,
  ConstraintsProps
>(function ConstraintsComponent({ className, ...props }, ref) {
  const availableConstraints: Constraint[] = [
    // DateRangeConstraint.restore(
    //   '{"init":{"endDate":"2024-06-11T03:00:00.000Z","startDate":"2024-06-10T03:00:00.000Z"},"name":"DATE_RANGE"}'
    // ),
    new DateRangeConstraint({
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    }),
  ]

  const fromDB =
    '"DATE_RANGE"~~{"endDate":"2024-06-02T03:00:00.000Z","startDate":"2024-06-01T03:00:00.000Z"}'

  const [_slug, _initProps] = fromDB.split("~~")
  const slug = JSON.parse(_slug)

  const ConstraintsMapper = {
    DATE_RANGE: DateRangeConstraint,
  }

  console.log({ slug, keys: Object.keys(ConstraintsMapper) })

  const [constraints, setConstraints] = useState<(typeof ConstraintSlugMap)[]>(
    []
  )
  // [
  //   {
  //     slug,
  //     value: ConstraintsMapper[slug]["restore"](_initProps),
  //   },
  // ]

  const validationConstraints = constraints.map(c => c.value)

  const { value, error, onChange } = useConstraints<Date>(
    new Date(),
    validationConstraints
  )

  return (
    <div className="flex flex-col justify-start px-6 gap-2">
      <DateField
        value={value}
        onChange={onChange}
      />
      {error && (
        <strong className="w-fit text-xs/none py-1 px-2 rounded bg-red-500 text-white">
          {error}
        </strong>
      )}
      {constraints.map(constraint => (
        <div className="px-4 py-4 rounded border border-dashed">
          <div className="flex justify-between">
            <span>{constraint.slug}</span>
            <Button
              variant="destructive"
              size="icon"
              className="size-6"
              onClick={() => {
                setConstraints(cons =>
                  cons.filter(c => c.slug !== constraint.slug)
                )
              }}
            >
              X
            </Button>
          </div>
          <div className="py-2" />
          <ConstraintMapper
            onChange={newConstraintValue => {
              setConstraints(cons => {
                return cons.map(({ slug, value }) =>
                  slug === newConstraintValue.slug
                    ? {
                        slug,
                        value: newConstraintValue,
                      }
                    : { slug, value }
                )
              })
            }}
            constraint={constraint}
          />
        </div>
      ))}
      <h2>Constraints:</h2>
      <div
        ref={ref}
        className={cn("", className)}
        {...props}
      >
        {availableConstraints.map(constraint => {
          return (
            <Button
              variant="ghost"
              size="sm"
              className={cn("", className)}
              disabled={constraints.map(c => c.slug).includes(constraint.slug)}
              onClick={() => {
                setConstraints(s => [
                  ...s,
                  {
                    slug: constraint.slug,
                    value: constraint as (typeof ConstraintSlugMap)["value"],
                  },
                ])
              }}
            >
              <h3>{constraint.name}</h3>
            </Button>
          )
        })}
      </div>
      <Button
        onClick={() => {
          const json = constraints.map(c => c.value.dispatch())
          console.log(json)
        }}
      >
        Submit
      </Button>
    </div>
  )
})

const ConstraintSlugMap = only({
  slug: "DATE_RANGE",
  value: DateRangeConstraint["prototype"],
})

type ConstraintMapperProps = {
  constraint: typeof ConstraintSlugMap
  onChange(constraint: (typeof ConstraintSlugMap)["value"]): void
}

export function ConstraintMapper({
  constraint,
  onChange,
}: ConstraintMapperProps) {
  switch (constraint.slug) {
    case "DATE_RANGE":
      return (
        <DateRangeComponent
          onChange={onChange}
          value={constraint.value}
        />
      )
  }
}

export const useConstraints = <T,>(
  initialValue: T,
  constraints: Constraint[]
) => {
  const initialState = {
    error: null,
    value: initialValue,
  }
  const [state, onChange] = useReducer((prevState: any, newValue: T) => {
    for (const constraint of constraints) {
      const [_error, _value] = constraint.validate(newValue as any)
      if (!_error) continue
      return {
        ...prevState,
        error: _error,
      }
    }
    return {
      ...prevState,
      error: null,
      value: newValue,
    }
  }, initialState)

  return {
    ...state,
    onChange,
  }
}
