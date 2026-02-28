/** 帖子审核状态 */
export type PostStatus = 'pending' | 'published' | 'rejected'

export interface ForumPost {
  id: number
  title: string
  content: string
  author: string
  authorId?: number
  createdAt: string
  updatedAt: string
  /** 审核状态：待审核、已通过、已拒绝 */
  status?: PostStatus
  /** 审核时间 */
  reviewedAt?: string
  /** 审核人 */
  reviewedBy?: string
  /** 拒绝原因/管理员备注（拒绝时填写） */
  rejectReason?: string
  /** 回复/评论数，可由 comments 长度计算 */
  replyCount?: number
  /** 点赞用户 id 列表，用于计数与是否已点赞 */
  likedByUserIds?: number[]
}

/** 评论审核状态 */
export type CommentStatus = 'pending' | 'published' | 'rejected'

export interface ForumComment {
  id: number
  postId: number
  content: string
  author: string
  authorId?: number
  createdAt: string
  updatedAt?: string
  /** 审核状态：待审核、已通过、已拒绝 */
  status?: CommentStatus
  /** 审核时间 */
  reviewedAt?: string
  /** 审核人 */
  reviewedBy?: string
  /** 拒绝原因/管理员备注 */
  rejectReason?: string
  /** 点赞用户 id 列表 */
  likedByUserIds?: number[]
}
