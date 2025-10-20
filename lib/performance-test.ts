// Simple performance test to identify bottlenecks
export async function testDatabaseConnection() {
  const startTime = performance.now()
  
  try {
    const response = await fetch('https://ecrcbnerdfxmazdxntmk.supabase.co/rest/v1/', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjcmNibmVyZGZ4bWF6ZHhudG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTkzNzEsImV4cCI6MjA3NDk5NTM3MX0.ev3v3m4g28J8TSv6g3Ypy6EmOvMupYhE2d4OkgoAUi0',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjcmNibmVyZGZ4bWF6ZHhudG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTkzNzEsImV4cCI6MjA3NDk5NTM3MX0.ev3v3m4g28J8TSv6g3Ypy6EmOvMupYhE2d4OkgoAUi0'
      }
    })
    
    const endTime = performance.now()
    const responseTime = endTime - startTime
    
    console.log(`🔍 Database connection test: ${responseTime.toFixed(2)}ms`)
    
    if (responseTime > 1000) {
      console.warn(`⚠️ Slow database connection: ${responseTime.toFixed(2)}ms`)
    }
    
    return {
      success: response.ok,
      responseTime,
      status: response.status
    }
  } catch (error) {
    const endTime = performance.now()
    const responseTime = endTime - startTime
    
    console.error(`❌ Database connection failed: ${responseTime.toFixed(2)}ms`, error)
    
    return {
      success: false,
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}




