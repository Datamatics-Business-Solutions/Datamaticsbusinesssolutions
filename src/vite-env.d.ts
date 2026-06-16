/// <reference types="vite/client" />

// Allow importing file contents as a raw string, e.g. `import html from './x.html?raw'`.
declare module '*.html?raw' {
  const content: string;
  export default content;
}
