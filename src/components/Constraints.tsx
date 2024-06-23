import { ConstraintContainer } from "@/components/ConstraintContainer"
import { DateField } from "@/components/DateField"
import { Button } from "@/components/ui/button"
import { DateRangeConstraint } from "@/constraints/date-range/instance"
import {
  ConstraintClass,
  ConstraintsUnion,
  GenericConstraint,
} from "@/constraints/type"
import { WeekdayConstraint } from "@/constraints/weekday/instance"
import { cn } from "@/lib/utils"
import React, { useReducer, useState } from "react"

export type ConstraintsProps = React.ComponentPropsWithoutRef<"div">

export const Constraints = React.forwardRef<
  React.ElementRef<"div">,
  ConstraintsProps
>(function ConstraintsComponent({ className, ...props }, ref) {
  const availableConstraints: ConstraintClass[] = [
    // DateRangeConstraint.restore(
    //   '{"init":{"endDate":"2024-06-11T03:00:00.000Z","startDate":"2024-06-10T03:00:00.000Z"},"name":"DATE_RANGE"}'
    // ),
    new DateRangeConstraint({
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    }),
    new WeekdayConstraint({
      weekday: "Sunday",
    }),
  ]

  const fromDB =
    '"DATE_RANGE"~~{"endDate":"2024-06-02T03:00:00.000Z","startDate":"2024-06-01T03:00:00.000Z"}'

  const [slug, _initProps] = fromDB.split("~~")

  const ConstraintsMapper = {
    DATE_RANGE: DateRangeConstraint,
    WEEKDAY: WeekdayConstraint,
  }

  const [constraints, setConstraints] = useState<ConstraintsUnion[]>([])
  // [
  //   {
  //     slug,
  //     value: ConstraintsMapper[slug]["restore"](_initProps),
  //   },
  // ]

  const validationConstraints = constraints.map(c => c.value)

  const { value, error, onChange } = useConstraints(
    new Date(),
    validationConstraints
  )

  function updateConstraint(newConstraintValue: GenericConstraint) {
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
  }

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
        <ConstraintContainer
          key={constraint.value.slug}
          fieldValue={value}
          constraint={constraint.value}
          onConstraintChange={updateConstraint}
          onClickRemove={() => {
            setConstraints(cons => cons.filter(c => c.slug !== constraint.slug))
          }}
        />
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
              key={constraint.slug}
              variant="ghost"
              size="sm"
              className={cn("", className)}
              disabled={constraints.map(c => c.slug).includes(constraint.slug)}
              onClick={() => {
                setConstraints(s => [
                  ...s,
                  {
                    slug: constraint.slug,
                    value: constraint,
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

type State<T> = {
  error: null | string
  value: T
}

export const useConstraints = <T,>(
  initialValue: T,
  constraints: GenericConstraint[]
) => {
  const initialState: State<T> = {
    error: null,
    value: initialValue,
  }
  const [state, onChange] = useReducer((prevState: State<T>, newValue: T) => {
    for (const constraint of constraints) {
      const [_error, _value] = constraint.validate(newValue as any)
      if (!_error) continue
      console.log({
        ref: constraint.ref.current,
      })
      constraint.ref.current?.pulse()
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

  function onChangeSelf(value: T) {
    onChange(value)
  }

  return {
    value: state.value,
    error: state.error,
    onChange: onChangeSelf,
  }
}
