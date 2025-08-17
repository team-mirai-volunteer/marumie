import { MfCsvLoader } from './src/server/lib/mf-csv-loader';
import * as fs from 'fs';

async function testCsv() {
  const loader = new MfCsvLoader();
  
  try {
    const csvContent = fs.readFileSync('../data/money-forward-v0.csv', 'utf8');
    const records = await loader.load(csvContent);
    
    console.log('✓ Records loaded successfully:', records.length);
    console.log('✓ First record:', JSON.stringify(records[0], null, 2));
    console.log('✓ Headers recognized successfully');
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

testCsv();