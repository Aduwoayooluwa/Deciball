/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
    readonly TRACKING_ID: string;
    
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }