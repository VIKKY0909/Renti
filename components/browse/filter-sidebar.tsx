"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterSidebarProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  sortBy: string
  setSortBy: (sort: string) => void
}

export function FilterSidebar({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
}: FilterSidebarProps) {
  return (
    <div className="space-y-8 bg-card p-6 rounded-2xl border border-border sticky top-24">
      {/* Sort By */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Sort By</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="bg-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Category</Label>
        <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="font-normal cursor-pointer">
              All Categories
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Gowns" id="gowns" />
            <Label htmlFor="gowns" className="font-normal cursor-pointer">
              Gowns
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Lehenga" id="lehenga" />
            <Label htmlFor="lehenga" className="font-normal cursor-pointer">
              Lehenga
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Saree" id="saree" />
            <Label htmlFor="saree" className="font-normal cursor-pointer">
              Saree
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Others" id="others" />
            <Label htmlFor="others" className="font-normal cursor-pointer">
              Others
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Price Range</Label>
        <div className="px-2">
          <Slider
            min={0}
            max={5000}
            step={100}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            className="w-full"
          />
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>
    </div>
  )
}
