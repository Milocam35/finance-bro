import 'dotenv/config';
import { readFileSync, mkdirSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { createInterface } from 'readline';

// Configuration from environment
const N8N_API_KEY = process.env.N8N_API_KEY;
const N8N_HOST = process.env.N8N_HOST?.replace(/\/$/, ''); // Remove trailing slash

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateEnv() {
  const errors = [];
  if (!N8N_API_KEY) errors.push('N8N_API_KEY is not defined in .env');
  if (!N8N_HOST) errors.push('N8N_HOST is not defined in .env');

  if (errors.length > 0) {
    log('\n[ERROR] Environment validation failed:', 'red');
    errors.forEach(err => log(`  - ${err}`, 'red'));
    process.exit(1);
  }
}

function readWorkflowFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      log(`\n[ERROR] File not found: ${filePath}`, 'red');
    } else if (error instanceof SyntaxError) {
      log(`\n[ERROR] Invalid JSON in file: ${filePath}`, 'red');
    } else {
      log(`\n[ERROR] Failed to read file: ${error.message}`, 'red');
    }
    process.exit(1);
  }
}

function askConfirmation(question, defaultYes = false) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      const trimmed = answer.trim().toLowerCase();

      // Si no respondió nada, usar el default
      if (trimmed === '') {
        resolve(defaultYes);
        return;
      }

      // Si respondió explícitamente
      if (trimmed === 'n' || trimmed === 'no') {
        resolve(false);
      } else if (trimmed === 'y' || trimmed === 'yes') {
        resolve(true);
      } else {
        // Respuesta inválida, usar default
        resolve(defaultYes);
      }
    });
  });
}

async function updateWorkflow(workflowId, workflowData) {
  const url = `${N8N_HOST}/api/v1/workflows/${workflowId}`;

  // Definimos SOLO los campos permitidos por la API v1 de n8n
  // NOTA: 'active' y 'tags' son read-only y no se pueden actualizar via PUT
  const payload = {
    name: workflowData.name,
    nodes: workflowData.nodes,
    connections: workflowData.connections,
    settings: workflowData.settings,
  };

  // DEBUG: Mostrar las claves del payload
  console.log('\n[DEBUG] Campos que se enviarán:', Object.keys(payload));
  console.log('[DEBUG] Settings keys:', payload.settings ? Object.keys(payload.settings) : 'none');

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': N8N_API_KEY
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('\n[DEBUG] Error detallado:', JSON.stringify(responseData, null, 2));
      throw new Error(responseData.message || `Error ${response.status}`);
    }

    return responseData;
  } catch (error) {
    if (error.cause?.code === 'ECONNREFUSED') {
      throw new Error(`No se pudo conectar a n8n en ${N8N_HOST}.`);
    }
    throw error;
  }
}

async function getWorkflowFromCloud(workflowId) {
  const url = `${N8N_HOST}/api/v1/workflows/${workflowId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY
      }
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.cause?.code === 'ECONNREFUSED') {
      throw new Error(`Cannot connect to n8n at ${N8N_HOST}`);
    }
    throw error;
  }
}

function getTodayDateFolder() {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1; // Los meses empiezan en 0
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
}

function getNextBackupNumber(dateFolder) {
  const backupsPath = join(process.cwd(), 'backups', dateFolder);

  if (!existsSync(backupsPath)) {
    return 1;
  }

  const files = readdirSync(backupsPath);
  const backupFiles = files.filter(f => f.startsWith('backup') && f.endsWith('.json'));

  if (backupFiles.length === 0) {
    return 1;
  }

  // Extraer números de los archivos existentes
  const numbers = backupFiles.map(f => {
    const match = f.match(/backup(\d+)\.json/);
    return match ? parseInt(match[1], 10) : 0;
  });

  return Math.max(...numbers) + 1;
}

function createBackup(workflowData, workflowName) {
  try {
    const dateFolder = getTodayDateFolder();
    const backupsPath = join(process.cwd(), 'backups', dateFolder);

    // Crear directorios si no existen
    mkdirSync(backupsPath, { recursive: true });

    // Obtener el siguiente número de backup
    const backupNumber = getNextBackupNumber(dateFolder);
    const backupFileName = `backup${backupNumber}.json`;
    const backupFilePath = join(backupsPath, backupFileName);

    // Guardar el backup
    writeFileSync(backupFilePath, JSON.stringify(workflowData, null, 2), 'utf-8');

    log(`[OK] Backup created: backups/${dateFolder}/${backupFileName}`, 'green');
    return backupFilePath;
  } catch (error) {
    log(`[ERROR] Failed to create backup: ${error.message}`, 'red');
    throw error;
  }
}

async function main() {
  console.log('\n========================================');
  log('   n8n Workflow Sync Tool', 'cyan');
  console.log('========================================\n');

  // Validate environment
  validateEnv();
  log(`[OK] Connected to: ${N8N_HOST}`, 'green');

  // Get file path from arguments or use default
  const filePath = process.argv[2] || 'TextScrapperTool.json';
  log(`[INFO] Reading workflow from: ${filePath}`, 'cyan');

  // Read and parse workflow file
  const workflow = readWorkflowFile(filePath);

  // Extract workflow ID
  const workflowId = workflow.id;
  if (!workflowId) {
    log('\n[ERROR] Workflow ID not found in JSON file', 'red');
    log('Make sure the JSON file contains an "id" field', 'dim');
    process.exit(1);
  }

  // Display workflow info
  console.log('\n----------------------------------------');
  log('Workflow Details:', 'yellow');
  console.log(`  Name: ${workflow.name || 'Unnamed'}`);
  console.log(`  ID:   ${workflowId}`);
  console.log(`  Nodes: ${workflow.nodes?.length || 0}`);
  console.log(`  Active: ${workflow.active ? 'Yes' : 'No'}`);
  console.log('----------------------------------------\n');

  // Check if workflow exists in cloud
  log('[INFO] Checking workflow in cloud...', 'cyan');
  const cloudWorkflow = await getWorkflowFromCloud(workflowId);

  if (!cloudWorkflow) {
    log(`\n[ERROR] Workflow with ID "${workflowId}" not found in n8n cloud`, 'red');
    log('Make sure the workflow exists before syncing', 'dim');
    process.exit(1);
  }

  log(`[OK] Found workflow "${cloudWorkflow.name}" in cloud`, 'green');

  // Show comparison
  console.log('\n----------------------------------------');
  log('Changes to apply:', 'yellow');
  console.log(`  Local name:  ${workflow.name}`);
  console.log(`  Cloud name:  ${cloudWorkflow.name}`);
  console.log(`  Local nodes: ${workflow.nodes?.length || 0}`);
  console.log(`  Cloud nodes: ${cloudWorkflow.nodes?.length || 0}`);
  console.log('----------------------------------------\n');

  // Ask if user wants to create a backup
  const wantsBackup = await askConfirmation(
    `${colors.yellow}Do you want to create a backup before updating? (Y/n): ${colors.reset}`,
    true
  );

  if (wantsBackup) {
    log('\n[INFO] Creating backup of current cloud workflow...', 'cyan');
    try {
      createBackup(cloudWorkflow, cloudWorkflow.name);
    } catch (error) {
      log('[WARNING] Backup failed, but you can continue with the update', 'yellow');
      const continueAnyway = await askConfirmation(
        `${colors.yellow}Continue without backup? (y/N): ${colors.reset}`,
        false
      );
      if (!continueAnyway) {
        log('\n[CANCELLED] Sync cancelled by user', 'yellow');
        process.exit(0);
      }
    }
  }

  // Ask for confirmation
  const confirmed = await askConfirmation(
    `${colors.yellow}Do you want to update the workflow in n8n cloud? (y/N): ${colors.reset}`,
    false
  );

  if (!confirmed) {
    log('\n[CANCELLED] Sync cancelled by user', 'yellow');
    process.exit(0);
  }

  // Update workflow
  log('\n[INFO] Updating workflow...', 'cyan');

  try {
    const result = await updateWorkflow(workflowId, workflow);

    console.log('\n========================================');
    log('   Workflow updated successfully!', 'green');
    console.log('========================================');
    console.log(`\n  ID: ${result.id}`);
    console.log(`  Name: ${result.name}`);
    console.log(`  Updated at: ${result.updatedAt || new Date().toISOString()}`);
    console.log(`  URL: ${N8N_HOST}/workflow/${result.id}\n`);

  } catch (error) {
    log(`\n[ERROR] Failed to update workflow: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  log(`\n[ERROR] Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});
