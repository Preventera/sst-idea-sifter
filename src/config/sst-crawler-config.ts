// src/config/sst-crawler-config.ts

export const sstCrawlerConfig = {
  // Chemin vers le sous-module
  basePath: process.env.NODE_ENV === 'production' 
    ? '/app/src/external/SST_CRAWLER' 
    : './src/external/SST_CRAWLER',
  
  // Configuration des sources prioritaires
  sources: {
    cnesst: { priority: 1, max_pages: 100 },
    irsst: { priority: 2, max_pages: 100 },
    asp_construction: { priority: 3, max_pages: 50 }
  },
  
  // Configuration du planning d'exécution
  schedule: {
    enabled: false, // Désactivé par défaut en dev
    time: '21:00',  // Exécution à 21h00
    timezone: 'America/Montreal'
  },
  
  // Répertoires de sortie
  outputDirs: {
    pdf: 'output/pdf',
    json: 'output/raw_items'
  },
  
  // Configuration Python
  python: {
    executable: 'python', // ou 'python3' selon l'environnement
    venvPath: './src/external/sst_crawler_env', // Environnement virtuel
    scriptsPath: './src/external/SST_CRAWLER'
  },
  
  // Configuration des timeouts
  timeouts: {
    crawling: 300000, // 5 minutes en millisecondes
    processing: 120000 // 2 minutes
  },
  
  // Paramètres de logging
  logging: {
    level: 'info', // 'debug', 'info', 'warn', 'error'
    logFile: './logs/sst-crawler.log'
  }
};