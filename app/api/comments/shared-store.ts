// Almacenamiento en memoria compartido para desarrollo
// Este módulo permite que tanto route.ts como actions/route.ts compartan el mismo estado

interface Reply {
  id: string
  name: string
  email: string
  message: string
  timestamp: string
  approved: boolean
  likes: number
  likedBy: string[]
  avatar?: string
}

interface Comment {
  id: string
  name: string
  email: string
  message: string
  timestamp: string
  approved: boolean
  ip?: string
  userAgent?: string
  likes: number
  likedBy: string[]
  replies: Reply[]
  parentId?: string
  avatar?: string
}

interface CommentsData {
  postSlug: string
  comments: Comment[]
}

// Almacenamiento compartido en memoria
const memoryStore: { [key: string]: CommentsData } = {}

export { memoryStore }
export type { CommentsData, Comment, Reply }
