/**
 * Ordena posts con los pineados siempre primero, luego por fecha descendente
 */
export function sortPostsWithPinned<T extends { pinned?: boolean }>(posts: T[]): T[] {
  const pinned = posts.filter((p) => p.pinned)
  const rest = posts.filter((p) => !p.pinned)
  return [...pinned, ...rest]
}
