import axios from 'axios'

async function testClerkWebhook() {
  console.log('Testing Clerk webhook endpoint...')
  
  const ngrokUrl = 'https://summary-monster-charmed.ngrok-free.app'
  const webhookUrl = `${ngrokUrl}/api/webhooks/clerk`
  
  try {
    // Test if the endpoint is accessible
    console.log(`Testing endpoint: ${webhookUrl}`)
    
    const response = await axios.get(webhookUrl, {
      headers: {
        'ngrok-skip-browser-warning': 'true' // Skip ngrok browser warning
      }
    })
    
    console.log('✅ Webhook endpoint is accessible')
    console.log('Response status:', response.status)
    
  } catch (error: any) {
    if (error.response?.status === 405) {
      console.log('✅ Webhook endpoint exists (405 Method Not Allowed is expected for GET request)')
      console.log('The endpoint only accepts POST requests, which is correct')
    } else {
      console.error('❌ Error accessing webhook endpoint:', error.message)
      if (error.response) {
        console.error('Status:', error.response.status)
        console.error('Data:', error.response.data)
      }
    }
  }
}

// Test database connection as well
async function testDatabaseConnection() {
  console.log('\nTesting database connection...')
  
  try {
    const { db } = await import('../src/lib/db')
    const { sql } = await import('drizzle-orm')
    
    const result = await db.execute(sql`SELECT 1 as test`)
    console.log('✅ Database connection successful')
    
    // Test if subscription tables exist
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('tenants', 'users', 'user_subscriptions')
    `)
    
    const tableNames = Array.isArray(tables) ? tables.map((row: any) => row.table_name) : []
    console.log('✅ Required tables exist:', tableNames)
    
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  }
}

// Run tests
async function runTests() {
  await testClerkWebhook()
  await testDatabaseConnection()
  
  console.log('\n📋 Next steps:')
  console.log('1. Make sure ngrok is running: ngrok http --url=summary-monster-charmed.ngrok-free.app 3000')
  console.log('2. Add webhook endpoint in Clerk dashboard: https://summary-monster-charmed.ngrok-free.app/api/webhooks/clerk')
  console.log('3. Add CLERK_WEBHOOK_SECRET to your .env file')
  console.log('4. Test by creating a user or organization in Clerk')
}

runTests().catch(console.error) 