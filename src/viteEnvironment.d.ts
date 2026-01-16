/// <reference types="vite/client" />

interface ImportMetaEnvironment {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnvironment;
}

