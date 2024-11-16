/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
    readonly PUBLIC_TRACKING_ID: string;
    
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }