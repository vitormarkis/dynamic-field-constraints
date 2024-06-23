import { Button } from "@/components/ui/button"
import { ConstraintMapper } from "@/constraints/Mapper"
import { GenericConstraint } from "@/constraints/type"
import { cn } from "@/lib/utils"
import React, { useImperativeHandle, useRef, useState } from "react"
import { animate, stagger } from "framer-motion"

export type ConstraintContainerProps<T> =
  React.ComponentPropsWithoutRef<"div"> & {
    constraint: GenericConstraint<T>
    onClickRemove(): void
    onConstraintChange(newConstraintValue: GenericConstraint): void
    fieldValue: T
  }

export function ConstraintContainer<T>({
  fieldValue,
  onConstraintChange,
  onClickRemove,
  constraint,
  className,
  ...props
}: ConstraintContainerProps<T>) {
  const ref = useRef<HTMLDivElement | null>(null)

  if (ref.current) {
    animate(
      ref.current,
      { boxShadow: "0px 0px 2px 5px #ff4f4f40" },
      {
        onUpdate: constraint.ref.current?.pulse,
        type: "spring",
        velocity: 100,
      }
    )
  }

  useImperativeHandle(constraint.ref, () => ({
    pulse() {
      animate(
        ".item",
        { boxShadow: "0px 0px 2px 5px #ff4f4f40" },
        {
          onUpdate: constraint.ref.current?.pulse,
          type: "spring",
          velocity: 100,
        }
      )
    },
  }))

  return (
    <div
      ref={ref}
      data-constraint-slug={`${constraint.slug}`}
      className={cn("px-4 py-4 rounded border border-dashed item", className)}
      {...props}
    >
      <div className="flex justify-between">
        <span>{constraint.slug}</span>
        <Button
          variant="destructive"
          size="icon"
          className="size-6"
          onClick={onClickRemove}
        >
          X
        </Button>
      </div>
      <div className="py-2" />
      <ConstraintMapper
        onConstraintChange={onConstraintChange}
        constraint={constraint}
        value={fieldValue}
      />
    </div>
  )
}
