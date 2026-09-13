/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STATIC_DEPLOYMENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
