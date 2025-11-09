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
  console.log(sizes);
  // Helper function to format size display with ranges
  const formatSizeDisplay = (sizeArray: string[]) => {
    if (!sizeArray || sizeArray.length === 0) return [];
    
    // Filter out empty strings
    const validSizes = sizeArray.filter(s => s !== '' && s !== null && s !== undefined);
    
    if (validSizes.length === 0) return [];
    if (validSizes.length === 1) return validSizes;
    
    // If multiple values, convert to numbers to find min/max
    const numericSizes = validSizes
      .map(s => parseFloat(s))
      .filter(n => !isNaN(n));
    
    if (numericSizes.length === 0) return validSizes;
    if (numericSizes.length === 1) return validSizes;
    
    const min = Math.min(...numericSizes);
    const max = Math.max(...numericSizes);
    
    // If min and max are the same, return single value
    if (min === max) return [min.toString()];
    
    // Return range as single string
    return [`${min}-${max}`];
  };

  const bustSizes = formatSizeDisplay(sizes.bust);
  const waistSizes = formatSizeDisplay(sizes.waist);
  const lengthSizes = formatSizeDisplay(sizes.length);
  const sleeveLengthSizes = formatSizeDisplay(sizes.sleeveLength);

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h3 className="font-semibold text-lg mb-4">Product Measurements</h3>
        <p className="text-sm text-muted-foreground mb-6">
          All measurements are in inches. Ranges indicate the garment can accommodate measurements within that span.
        </p>
      </div>

      {/* Bust Size */}
      {bustSizes.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-semibold">Bust Size (inches)</Label>
          <div className="flex flex-wrap gap-3">
            {bustSizes.map((size) => (
              <div
                key={size}
                className="flex items-center justify-center px-4 py-2 rounded-lg border-2 border-primary bg-primary/10"
              >
                {size}
              </div>
            ))}
          </div>
        </div>
      )}
      

      {/* Waist Size */}
      {waistSizes.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-semibold">Waist Size (inches)</Label>
          <div className="flex flex-wrap gap-3">
            {waistSizes.map((size) => (
              <div
                key={size}
                className="flex items-center justify-center px-4 py-2 rounded-lg border-2 border-primary bg-primary/10"
              >
                {size}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Length */}
      {lengthSizes.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-semibold">Length (inches)</Label>
          <div className="flex flex-wrap gap-3">
            {lengthSizes.map((size) => (
              <div
                key={size}
                className="flex items-center justify-center px-4 py-2 rounded-lg border-2 border-primary bg-primary/10"
              >
                {size}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sleeve Length */}
      {sleeveLengthSizes.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-semibold">Sleeve Length (inches)</Label>
          <div className="flex flex-wrap gap-3">
            {sleeveLengthSizes.map((size) => (
              <div
                key={size}
                className="flex items-center justify-center px-4 py-2 rounded-lg border-2 border-primary bg-primary/10"
              >
                {size}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}