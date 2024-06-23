import { DateRangeComponent } from "@/constraints/date-range/component"
import { ConstraintComponentProps, ConstraintSlug } from "@/constraints/type"
import { WeekdayComponent } from "@/constraints/weekday/component"

export function ConstraintMapper(props: ConstraintComponentProps) {
  const ComponentMap: Record<
    ConstraintSlug,
    React.ForwardRefExoticComponent<
      ConstraintComponentProps<any, any> & React.RefAttributes<HTMLInputElement>
    >
  > = {
    DATE_RANGE: DateRangeComponent,
    WEEKDAY: WeekdayComponent,
  }

  const Component = ComponentMap[props.constraint.slug]

  return <Component {...props} />
}
