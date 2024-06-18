"use client"
import { Constraints } from "@/components/Constraints"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet"
import { useState } from "react"

export default function Home() {
  const [open, setOpen] = useState(false)

  return (
    <div className="">
      <div className="flex flex-col gap-2 p-2 border rounded-lg m-4 max-w-[16rem]">
        <Button
          onClick={() => setOpen(true)}
          variant="secondary"
          className=""
        >
          Date
        </Button>
        <Button
          onClick={() => setOpen(true)}
          variant="secondary"
          className=""
        >
          Checkbox
        </Button>
        <Button
          onClick={() => setOpen(true)}
          variant="secondary"
          className=""
        >
          Text
        </Button>
      </div>
      <Constraints />
      <Sheet
        open={false}
        onOpenChange={setOpen}
      >
        <SheetContent onBlur={() => setOpen(false)}>
          <SheetHeader>
            <Label className="flex items-center gap-2">
              <Checkbox />
              Required
            </Label>
            <Label className="flex items-center gap-2">
              <Checkbox />
              Required
            </Label>
          </SheetHeader>
          <div className="py-4" />
          <div className="border rounded-md border-dashed p-2"></div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
