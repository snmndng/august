
const fs = require('fs');
const path = require('path');

function checkEnvironment() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found');
    console.log('📝 Creating .env.local from env.example...');
    
    const examplePath = path.join(process.cwd(), 'env.example');
    if (fs.existsSync(examplePath)) {
      fs.copyFileSync(examplePath, envPath);
      console.log('✅ .env.local created from env.example');
      console.log('🔧 Please update the values in .env.local with your actual credentials');
    } else {
      console.log('❌ env.example not found');
    }
    return;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'DATABASE_URL'
  ];

  console.log('🔍 Checking environment variables...');
  
  for (const varName of requiredVars) {
    const match = envContent.match(new RegExp(`${varName}=(.+)`));
    if (!match || match[1].includes('your_') || match[1].includes('placeholder')) {
      console.log(`❌ ${varName} is not properly configured`);
    } else {
      console.log(`✅ ${varName} is configured`);
    }
  }
  
  console.log('\n📚 For setup instructions, see SETUP.md');
}

checkEnvironment();
