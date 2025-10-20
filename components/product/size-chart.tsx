"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface SizeChartProps {
  sizes: {
    bust: string[]
    waist: string[]
    length: string[]
    sleeveLength: string[]
  }
  selectedSize: {
    bust: string
    waist: string
    length: string
    sleeveLength: string
  }
  setSelectedSize: (size: any) => void
}

export function SizeChart({ sizes, selectedSize, setSelectedSize }: SizeChartProps) {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h3 className="font-semibold text-lg mb-4">Select Your Size</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Please select your measurements to ensure the perfect fit. All measurements are in inches.
        </p>
      </div>

      {/* Bust Size */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Bust Size (inches)</Label>
        <RadioGroup
          value={selectedSize.bust}
          onValueChange={(value) => setSelectedSize({ ...selectedSize, bust: value })}
          className="flex flex-wrap gap-3"
        >
          {sizes.bust.map((size) => (
            <div key={size}>
              <RadioGroupItem value={size} id={`bust-${size}`} className="peer sr-only" />
              <Label
                htmlFor={`bust-${size}`}
                className="flex items-center justify-center px-4 py-2 rounded-lg border-2 border-border cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 transition-all hover:border-primary/50"
              >
                {size}"
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Waist Size */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Waist Size (inches)</Label>
        <RadioGroup
          value={selectedSize.waist}
          onValueChange={(value) => setSelectedSize({ ...selectedSize, waist: value })}
          className="flex flex-wrap gap-3"
        >
          {sizes.waist.map((size) => (
            <div key={size}>
              <RadioGroupItem value={size} id={`waist-${size}`} className="peer sr-only" />
              <Label
                htmlFor={`waist-${size}`}
                className="flex items-center justify-center px-4 py-2 rounded-lg border-2 border-border cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 transition-all hover:border-primary/50"
              >
                {size}"
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Length */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Length (inches)</Label>
        <RadioGroup
          value={selectedSize.length}
          onValueChange={(value) => setSelectedSize({ ...selectedSize, length: value })}
          className="flex flex-wrap gap-3"
        >
          {sizes.length.map((size) => (
            <div key={size}>
              <RadioGroupItem value={size} id={`length-${size}`} className="peer sr-only" />
              <Label
                htmlFor={`length-${size}`}
                className="flex items-center justify-center px-4 py-2 rounded-lg border-2 border-border cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 transition-all hover:border-primary/50"
              >
                {size}"
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Sleeve Length */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Sleeve Length</Label>
        <RadioGroup
          value={selectedSize.sleeveLength}
          onValueChange={(value) => setSelectedSize({ ...selectedSize, sleeveLength: value })}
          className="flex flex-wrap gap-3"
        >
          {sizes.sleeveLength.map((size) => (
            <div key={size}>
              <RadioGroupItem value={size} id={`sleeve-${size}`} className="peer sr-only" />
              <Label
                htmlFor={`sleeve-${size}`}
                className="flex items-center justify-center px-4 py-2 rounded-lg border-2 border-border cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 transition-all hover:border-primary/50"
              >
                {size}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}
