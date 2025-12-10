#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const contractPath = path.join(__dirname, 'build', 'contracts', 'StudentManagement.json');

if (!fs.existsSync(contractPath)) {
  console.error('❌ File không tồn tại:', contractPath);
  console.log('Chạy: truffle compile && truffle migrate --network development');
  process.exit(1);
}

const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
const deployedNetwork = contractJson.networks['1337'];

if (!deployedNetwork) {
  console.error('❌ Contract chưa deploy!');
  console.log('Chạy: truffle migrate --reset --network development');
  process.exit(1);
}

const contractAddress = deployedNetwork.address;
const contractABI = JSON.stringify(contractJson.abi);

const filesToUpdate = [
  'frontend/admin_programs.js',
  'frontend/admin_students.html',
  'frontend/admin_students.js',
  'frontend/dean_students.html',
  'frontend/dean_students.js',
  'frontend/student.html',
  'frontend/student.js',
  'frontend/verify_diploma.js'
];

let updated = 0;
let skipped = 0;

filesToUpdate.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) {
    skipped++;
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  const original = content;
  
  content = content.replace(
    /const contractAddress = ["']0x[a-fA-F0-9]{40}["'];/g,
    `const contractAddress = "${contractAddress}";`
  );
  
  content = content.replace(
    /const contractABI = \[.*?\];/gs,
    `const contractABI = ${contractABI};`
  );
  
  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ ${filePath}`);
    updated++;
  }
});

console.log(`\n📍 Address: ${contractAddress}`);
console.log(`✅ Updated: ${updated} file${updated !== 1 ? 's' : ''}`);
if (skipped > 0) console.log(`⚠️  Skipped: ${skipped} file${skipped !== 1 ? 's' : ''} (không tồn tại)`);
