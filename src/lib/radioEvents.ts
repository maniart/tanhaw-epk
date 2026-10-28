// Lightweight event bus for cross-component radio communication.
// RadioPlayer fires notifyIndexChange; RadioArchivePage subscribes + calls requestPlay.

let _currentIndex = 0

export function getCurrentIndex(): number {
  return _currentIndex
}

export function notifyIndexChange(index: number): void {
  _currentIndex = index
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('radio:index-changed', { detail: { index } }))
}

export function onIndexChange(cb: (index: number) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<{ index: number }>).detail.index)
  window.addEventListener('radio:index-changed', handler)
  return () => window.removeEventListener('radio:index-changed', handler)
}

export function requestPlay(index: number): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('radio:request-play', { detail: { index } }))
}

export function onRequestPlay(cb: (index: number) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<{ index: number }>).detail.index)
  window.addEventListener('radio:request-play', handler)
  return () => window.removeEventListener('radio:request-play', handler)
}
