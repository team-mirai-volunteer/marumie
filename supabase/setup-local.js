#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Supabase ローカル環境セットアップを開始します...');

// 1. Docker確認
console.log('📦 Docker の起動確認...');
try {
  execSync('docker --version', { stdio: 'pipe' });
  execSync('docker ps', { stdio: 'pipe' });
  console.log('✅ Docker 確認完了');
} catch (error) {
  console.error('❌ Docker が起動していません。Docker Desktop を起動してください。');
  process.exit(1);
}

// 2. Supabase起動
console.log('🔄 Supabase エミュレーター起動中...');
try {
  execSync('npx supabase start', { stdio: 'inherit' });
  console.log('✅ Supabase 起動完了');
} catch (error) {
  console.error('❌ Supabase の起動に失敗しました:', error.message);
  process.exit(1);
}

// 3. マイグレーション適用確認
console.log('🔍 マイグレーション状態確認...');

const CONTAINER_NAME = 'supabase_db_poli-money-something';

try {
  // テーブル存在確認
  const tableResult = execSync(
    `docker exec ${CONTAINER_NAME} psql -U postgres -d postgres -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('political_organizations', 'transactions');"`,
    { encoding: 'utf8' }
  );
  
  const tableCount = parseInt(tableResult.trim());
  
  if (tableCount < 2) {
    console.log('⚠️  テーブルが見つかりません。マイグレーションを手動適用します...');
    
    // マイグレーションファイルを直接適用
    const migrationPath = './supabase/migrations/20250816030231_create_initial_tables.sql';
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ マイグレーションファイルが見つかりません:', migrationPath);
      process.exit(1);
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📝 マイグレーション適用中...');
    execSync(
      `docker exec ${CONTAINER_NAME} psql -U postgres -d postgres -c "${migrationSQL.replace(/"/g, '\\"')}"`,
      { stdio: 'pipe' }
    );
    
    console.log('✅ マイグレーション適用完了');
  } else {
    console.log('✅ テーブル確認完了');
  }
} catch (error) {
  console.error('❌ マイグレーション適用に失敗しました:', error.message);
  
  // フォールバック: supabase db reset を試行
  console.log('🔄 supabase db reset を試行します...');
  try {
    execSync('npx supabase db reset', { stdio: 'inherit' });
    console.log('✅ データベースリセット完了');
  } catch (resetError) {
    console.error('❌ データベースリセットも失敗しました。手動で対応してください。');
    process.exit(1);
  }
}

// 4. 型定義生成
console.log('🔤 TypeScript型定義生成中...');
try {
  execSync('npx supabase gen types typescript --local > supabase/types.gen.ts', { stdio: 'pipe' });
  console.log('✅ 型定義生成完了');
} catch (error) {
  console.warn('⚠️  型定義生成に失敗しました。後で手動実行してください:', error.message);
}

// 5. 最終確認
console.log('🔍 最終確認...');
try {
  const finalResult = execSync(
    `docker exec ${CONTAINER_NAME} psql -U postgres -d postgres -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('political_organizations', 'transactions');"`,
    { encoding: 'utf8' }
  );
  
  const finalCount = parseInt(finalResult.trim());
  
  if (finalCount === 2) {
    console.log('✅ セットアップ完了！');
    console.log('');
    console.log('📊 Supabase Studio: http://127.0.0.1:54323');
    console.log('🔌 API URL: http://127.0.0.1:54321');
    console.log('🗄️  DB URL: postgresql://postgres:postgres@127.0.0.1:54332/postgres');
    console.log('');
    console.log('📋 次の手順:');
    console.log('  1. ブラウザで http://127.0.0.1:54323 にアクセス');
    console.log('  2. 左側の "Tables" をクリック');
    console.log('  3. political_organizations と transactions テーブルが表示されることを確認');
  } else {
    console.error(`❌ テーブル確認に失敗しました。期待値: 2, 実際: ${finalCount}`);
    console.log('');
    console.log('🛠️  手動で確認してください:');
    console.log('  npm run supabase:check');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ 最終確認に失敗しました:', error.message);
  process.exit(1);
}