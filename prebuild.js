import fs from 'fs';
import path from 'path';

const projetsDir = path.join(process.cwd(), 'public', 'projets');
const outputFile = path.join(process.cwd(), 'src', 'data', 'projets.json');

// Ensure directories exist
if (!fs.existsSync(projetsDir)) {
  fs.mkdirSync(projetsDir, { recursive: true });
  console.log('[Prebuild] Created missing public/projets directory.');
}

const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const projetsData = [];
const MAX_SIZE_MB = 100; // Limite de sécurité pour l'hébergement web

/**
 * Calcule la taille totale d'un dossier de manière récursive (en octets)
 */
function getDirSize(dirPath) {
  let size = 0;
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      size += getDirSize(filePath);
    } else {
      size += stat.size;
    }
  }
  return size;
}

// Read subdirectories
try {
  const folders = fs.readdirSync(projetsDir);

  for (const folder of folders) {
    const folderPath = path.join(projetsDir, folder);
    const stat = fs.statSync(folderPath);

    if (stat.isDirectory()) {
      // --- Vérification Sécurité: Taille du dossier ---
      const totalSize = getDirSize(folderPath);
      const sizeMB = totalSize / (1024 * 1024);

      if (sizeMB > MAX_SIZE_MB) {
        console.warn(`\x1b[31m[Security] BLOQUAGE: Le projet "${folder}" est trop lourd (${sizeMB.toFixed(2)} Mo). Limite autorisée : ${MAX_SIZE_MB} Mo.\x1b[0m`);
        console.warn(`\x1b[31m[Security] Merci de compresser tes textures sur gltf.report avant de refaire une PR.\x1b[0m`);
        // On continue quand même le prebuild, mais l'alerte est ultra visible.
      }
      
      const infoPath = path.join(folderPath, 'infos.json');

      if (fs.existsSync(infoPath)) {
        try {
          const rawData = fs.readFileSync(infoPath, 'utf-8');
          const data = JSON.parse(rawData);
          // Auto add the folder name as id if not present, but user must provide it
          if (!data.id) data.id = folder;

          // Vérification des données GPS cruciales
          if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
            console.warn(`\x1b[33m[Prebuild] ATTENTION: Les coordonnées (latitude/longitude) dans le projet "${folder}" ne sont pas des nombres valides. Le projet pourrait ne pas s'afficher sur le globe.\x1b[0m`);
          }

          projetsData.push(data);
          console.log(`[Prebuild] Loaded project stats: ${folder}`);
        } catch (err) {
          console.error(`[Prebuild] Error reading/parsing ${infoPath}:`, err.message);
        }
      } else {
        console.warn(`[Prebuild] Warning: No infos.json found in ${folderPath}`);
      }
    }
  }

  // Write the consolidated file
  fs.writeFileSync(outputFile, JSON.stringify(projetsData, null, 2), 'utf-8');
  console.log(`[Prebuild] Successfully generated src/data/projets.json with ${projetsData.length} projects.`);

} catch (err) {
  console.error('[Prebuild] Error scanning projects directory:', err);
}
