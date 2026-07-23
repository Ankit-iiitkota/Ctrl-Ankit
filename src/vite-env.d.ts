/// <reference types="vite/client" />

declare module '*.md' {
  const content: string;
  export default content;
}

declare module 'canvas-confetti' {
  const confetti: any;
  export default confetti;
}
