#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..');

// Simple JSON schema validation
function validateChallengeJson(challengeData, schemaData) {
  const required = schemaData.required || [];
  const errors = [];
  
  for (const field of required) {
    if (!(field in challengeData)) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Validate enums
  if (challengeData.category && !['Algorithm', 'API', 'Component', 'Database', 'Security'].includes(challengeData.category)) {
    errors.push('Invalid category. Must be one of: Algorithm, API, Component, Database, Security');
  }
  
  if (challengeData.difficulty && !['Easy', 'Medium', 'Hard'].includes(challengeData.difficulty)) {
    errors.push('Invalid difficulty. Must be one of: Easy, Medium, Hard');
  }
  
  return errors;
}

function validateChallenge(challengeName) {
  const challengeDir = join(rootDir, challengeName);
  const errors = [];
  
  console.log(`Validating ${challengeName}...`);
  
  // Check if directory exists
  if (!existsSync(challengeDir)) {
    errors.push(`Challenge directory does not exist: ${challengeName}`);
    return errors;
  }
  
  // Required files
  const requiredFiles = [
    'package.json',
    'challenge.json',
    'README.md',
    'src',
    'test'
  ];
  
  for (const file of requiredFiles) {
    const filePath = join(challengeDir, file);
    if (!existsSync(filePath)) {
      errors.push(`Missing required file/directory: ${file}`);
    }
  }
  
  // Validate challenge.json
  const challengeJsonPath = join(challengeDir, 'challenge.json');
  if (existsSync(challengeJsonPath)) {
    try {
      const challengeData = JSON.parse(readFileSync(challengeJsonPath, 'utf8'));
      const schemaPath = join(rootDir, 'challenge-schema.json');
      const schemaData = JSON.parse(readFileSync(schemaPath, 'utf8'));
      
      const validationErrors = validateChallengeJson(challengeData, schemaData);
      errors.push(...validationErrors);
      
    } catch (err) {
      errors.push(`Invalid JSON in challenge.json: ${err.message}`);
    }
  }
  
  return errors;
}

async function main() {
  try {
    // Read manifest
    const manifestPath = join(rootDir, 'challenges-manifest.json');
    if (!existsSync(manifestPath)) {
      console.error('Error: challenges-manifest.json not found');
      process.exit(1);
    }
    
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const challenges = manifest.challenges || [];
    
    console.log(`Validating ${challenges.length} challenges...\n`);
    
    let totalErrors = 0;
    
    for (const challenge of challenges) {
      const errors = validateChallenge(challenge);
      if (errors.length > 0) {
        console.error(`❌ ${challenge}:`);
        for (const error of errors) {
          console.error(`  - ${error}`);
        }
        totalErrors += errors.length;
      } else {
        console.log(`✅ ${challenge}: Valid`);
      }
    }
    
    console.log(`\n${totalErrors === 0 ? '✅' : '❌'} Validation complete. ${totalErrors} error(s) found.`);
    
    if (totalErrors > 0) {
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Validation script error:', error.message);
    process.exit(1);
  }
}

main();