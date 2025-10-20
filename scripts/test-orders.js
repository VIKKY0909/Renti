// Test script to check orders in database
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

// Load Supabase credentials from .env file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testOrders() {
  console.log('Testing orders in database...')
  
  // First, let's check what tables exist
  console.log('Checking available tables...')
  
  // Check total orders
  const { data: allOrders, error: allError } = await supabase
    .from('orders')
    .select('*', { count: 'exact' })
  
  if (allError) {
    console.error('Error fetching all orders:', allError)
    console.log('This might be due to RLS policies or the table not existing')
  } else {
    console.log(`Total orders in database: ${allOrders?.length || 0}`)
  }
  
  // Check orders with details
  const { data: ordersWithDetails, error: detailsError } = await supabase
    .from('orders')
    .select(`
      *,
      product:products(id, title),
      user:profiles!orders_user_id_fkey(id, full_name, email),
      owner:profiles!orders_owner_id_fkey(id, full_name, email)
    `)
    .limit(5)
  
  if (detailsError) {
    console.error('Error fetching orders with details:', detailsError)
  } else {
    console.log(`Orders with details:`, ordersWithDetails?.length || 0)
    if (ordersWithDetails && ordersWithDetails.length > 0) {
      console.log('Sample order:', JSON.stringify(ordersWithDetails[0], null, 2))
    }
  }
  
  // Check profiles table
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name, email, is_admin')
    .limit(5)
  
  if (profilesError) {
    console.error('Error fetching profiles:', profilesError)
  } else {
    console.log(`Profiles in database:`, profiles?.length || 0)
    if (profiles && profiles.length > 0) {
      console.log('Sample profiles:', profiles)
    }
  }
}

testOrders().catch(console.error)
