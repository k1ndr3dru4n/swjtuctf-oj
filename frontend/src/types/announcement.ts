export interface Announcement {
  id: number
  title: string
  content: string
  author: string
  createdAt: string
  updatedAt: string
  isPinned: boolean
  status: 'published' | 'draft'
}

