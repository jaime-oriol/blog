declare module 'body-scroll-lock' {
  export function disableBodyScroll(element: HTMLElement): void
  export function enableBodyScroll(element: HTMLElement): void
  export function clearAllBodyScrollLocks(): void
}
