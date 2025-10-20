"use server"

import { createClient } from "@/lib/supabase/server"

export async function runMigration() {
  const supabase = await createClient()

  try {
    // Add total_reviews column
    const { error: totalReviewsError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.products ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;'
    })

    if (totalReviewsError) {
      console.error('Error adding total_reviews column:', totalReviewsError)
    }

    // Add available_from and available_until columns
    const { error: availableFromError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.products ADD COLUMN IF NOT EXISTS available_from DATE;'
    })

    const { error: availableUntilError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.products ADD COLUMN IF NOT EXISTS available_until DATE;'
    })

    // Add condition column
    const { error: conditionError } = await supabase.rpc('exec_sql', {
      sql: "ALTER TABLE public.products ADD COLUMN IF NOT EXISTS condition TEXT DEFAULT 'good';"
    })

    // Update existing products
    const { error: updateError } = await supabase.rpc('exec_sql', {
      sql: 'UPDATE public.products SET total_reviews = 0 WHERE total_reviews IS NULL;'
    })

    const { error: conditionUpdateError } = await supabase.rpc('exec_sql', {
      sql: "UPDATE public.products SET condition = 'good' WHERE condition IS NULL;"
    })

    return { success: true, error: null }
  } catch (error) {
    console.error('Migration error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Alternative approach using direct SQL execution
export async function runMigrationDirect() {
  const supabase = await createClient()

  try {
    // Try to add the column directly
    const { error } = await supabase
      .from('products')
      .select('total_reviews')
      .limit(1)

    if (error && error.code === '42703') {
      // Column doesn't exist, we need to add it
      console.log('total_reviews column does not exist, needs to be added via database migration')
      return { 
        success: false, 
        error: 'Column total_reviews does not exist. Please run the database migration script: scripts/009_add_total_reviews_column.sql' 
      }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Migration check error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
