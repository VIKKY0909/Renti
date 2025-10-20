"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { runMigrationDirect } from "@/lib/actions/migrate"
import { toast } from "sonner"

export default function MigratePage() {
  const [isRunning, setIsRunning] = useState(false)

  const handleMigration = async () => {
    setIsRunning(true)
    try {
      const result = await runMigrationDirect()
      if (result.success) {
        toast.success("Database schema is up to date!")
      } else {
        toast.error(result.error || "Migration failed")
      }
    } catch (error) {
      toast.error("Migration failed: " + (error instanceof Error ? error.message : "Unknown error"))
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Database Migration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This page helps fix the missing <code>total_reviews</code> column in the products table.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Manual Database Update Required</h3>
            <p className="text-yellow-700 text-sm mb-4">
              Please run the following SQL commands in your Supabase SQL editor:
            </p>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS available_from DATE;

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS available_until DATE;

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS condition TEXT DEFAULT 'good';

UPDATE public.products 
SET total_reviews = 0 
WHERE total_reviews IS NULL;

UPDATE public.products 
SET condition = 'good' 
WHERE condition IS NULL;`}
            </pre>
          </div>

          <Button 
            onClick={handleMigration} 
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? "Checking..." : "Check Database Schema"}
          </Button>

          <div className="text-xs text-muted-foreground">
            <p>After running the SQL commands above, click the button to verify the schema is updated.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
