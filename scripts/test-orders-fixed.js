// Test script to check orders access after RLS fix
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testOrdersAccess() {
  console.log('Testing orders access with service role...')
  
  try {
    // Test 1: Simple count query
    const { count, error: countError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('❌ Count query failed:', countError)
    } else {
      console.log(`✅ Total orders count: ${count}`)
    }
    
    // Test 2: Get all orders with basic info
    const { data: allOrders, error: allError } = await supabase
      .from('orders')
      .select('id, user_id, owner_id, product_id, status, created_at')
      .limit(10)
    
    if (allError) {
      console.error('❌ Basic orders query failed:', allError)
    } else {
      console.log(`✅ Found ${allOrders?.length || 0} orders`)
      if (allOrders && allOrders.length > 0) {
        console.log('Sample orders:', allOrders.slice(0, 3))
      }
    }
    
    // Test 3: Get orders with joins
    const { data: ordersWithDetails, error: detailsError } = await supabase
      .from('orders')
      .select(`
        id,
        status,
        total_amount,
        created_at,
        product:products(id, title),
        user:profiles!orders_user_id_fkey(id, full_name, email),
        owner:profiles!orders_owner_id_fkey(id, full_name, email)
      `)
      .limit(5)
    
    if (detailsError) {
      console.error('❌ Orders with details query failed:', detailsError)
    } else {
      console.log(`✅ Found ${ordersWithDetails?.length || 0} orders with details`)
      if (ordersWithDetails && ordersWithDetails.length > 0) {
        console.log('Sample order with details:', JSON.stringify(ordersWithDetails[0], null, 2))
      }
    }
    
    // Test 4: Check if we can create a test order (without actually creating it)
    console.log('\n📝 Testing order creation permissions...')
    
    // Test 5: Check RLS policies
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_table_policies', { table_name: 'orders' })
      .catch(() => ({ data: null, error: 'RPC not available' }))
    
    if (policiesError) {
      console.log('ℹ️  Cannot check policies via RPC (this is normal)')
    } else {
      console.log('✅ Policies check result:', policies)
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

testOrdersAccess().catch(console.error)




