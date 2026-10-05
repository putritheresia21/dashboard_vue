/// <reference types="vite/client" />

declare module 'pagedjs' {
  export class Previewer {
    preview(content: string, stylesheets?: string[], target?: Element | HTMLElement): Promise<void>
  }
}
