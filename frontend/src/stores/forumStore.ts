import { reactive } from 'vue'
import type { ForumPost, ForumComment, PostStatus, CommentStatus } from '../types/forum'
import { forumPosts as mockPosts, forumComments as mockComments } from '../mock/forum'

export const forumStore = reactive<{
  posts: ForumPost[]
  comments: ForumComment[]
}>({
  posts: [...mockPosts],
  comments: [...mockComments],
})

function publishedCommentCount(postId: number): number {
  return forumStore.comments.filter(
    (c) => c.postId === postId && (c.status ?? 'published') === 'published'
  ).length
}

function attachReplyAndLikeCount(posts: ForumPost[]): ForumPost[] {
  return posts.map((p) => ({
    ...p,
    replyCount: publishedCommentCount(p.id),
    likedByUserIds: p.likedByUserIds ?? [],
  }))
}

/** 前台：仅已通过的帖子，按时间倒序 */
export function getForumPosts(): ForumPost[] {
  const list = forumStore.posts.filter((p) => (p.status ?? 'published') === 'published')
  const sorted = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return attachReplyAndLikeCount(sorted)
}

/** 管理端：全部帖子，按时间倒序 */
export function getForumPostsForAdmin(): ForumPost[] {
  const sorted = [...forumStore.posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return attachReplyAndLikeCount(sorted)
}

/** 单个帖子（不区分审核状态，详情页自行判断是否展示） */
export function getForumPost(id: number): ForumPost | undefined {
  const post = forumStore.posts.find((p) => p.id === id)
  if (!post) return undefined
  return {
    ...post,
    replyCount: publishedCommentCount(id),
    likedByUserIds: post.likedByUserIds ?? [],
  }
}

/** 帖子点赞数 */
export function getPostLikeCount(postId: number): number {
  const post = forumStore.posts.find((p) => p.id === postId)
  return post?.likedByUserIds?.length ?? 0
}

/** 当前用户是否已点赞该帖 */
export function hasUserLikedPost(postId: number, userId: number | undefined): boolean {
  if (userId === undefined) return false
  const post = forumStore.posts.find((p) => p.id === postId)
  return post?.likedByUserIds?.includes(userId) ?? false
}

/** 切换帖子点赞（点赞/取消点赞） */
export function togglePostLike(postId: number, userId: number | undefined): boolean {
  if (userId === undefined) return false
  const post = forumStore.posts.find((p) => p.id === postId)
  if (!post) return false
  if (!post.likedByUserIds) post.likedByUserIds = []
  const idx = post.likedByUserIds.indexOf(userId)
  if (idx === -1) {
    post.likedByUserIds.push(userId)
  } else {
    post.likedByUserIds.splice(idx, 1)
  }
  return true
}

/** 某帖子的评论列表（仅已通过），按时间正序，用于前台展示 */
export function getCommentsByPostId(postId: number): ForumComment[] {
  return forumStore.comments
    .filter((c) => c.postId === postId && (c.status ?? 'published') === 'published')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((c) => ({ ...c, likedByUserIds: c.likedByUserIds ?? [] }))
}

/** 管理端：某帖子的全部评论（含待审核/已拒绝），按时间正序 */
export function getCommentsByPostIdForAdmin(postId: number): ForumComment[] {
  return forumStore.comments
    .filter((c) => c.postId === postId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((c) => ({ ...c, likedByUserIds: c.likedByUserIds ?? [] }))
}

/** 当前用户是否已点赞该评论 */
export function hasUserLikedComment(commentId: number, userId: number | undefined): boolean {
  if (userId === undefined) return false
  const comment = forumStore.comments.find((c) => c.id === commentId)
  return comment?.likedByUserIds?.includes(userId) ?? false
}

/** 切换评论点赞 */
export function toggleCommentLike(commentId: number, userId: number | undefined): boolean {
  if (userId === undefined) return false
  const comment = forumStore.comments.find((c) => c.id === commentId)
  if (!comment) return false
  if (!comment.likedByUserIds) comment.likedByUserIds = []
  const idx = comment.likedByUserIds.indexOf(userId)
  if (idx === -1) {
    comment.likedByUserIds.push(userId)
  } else {
    comment.likedByUserIds.splice(idx, 1)
  }
  return true
}

function nowStr(): string {
  return new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(/\//g, '-')
}

/** 发帖 */
export function createForumPost(data: {
  title: string
  content: string
  author: string
  authorId?: number
  status?: PostStatus
}): ForumPost | null {
  const maxId = forumStore.posts.length > 0
    ? Math.max(...forumStore.posts.map((p) => p.id))
    : 0
  const now = nowStr()
  const newPost: ForumPost = {
    id: maxId + 1,
    title: data.title,
    content: data.content,
    author: data.author,
    authorId: data.authorId,
    createdAt: now,
    updatedAt: now,
    status: data.status ?? 'pending',
    replyCount: 0,
    likedByUserIds: [],
  }
  forumStore.posts.push(newPost)
  return newPost
}

/** 更新帖子 */
export function updateForumPost(
  id: number,
  data: {
    title?: string
    content?: string
    status?: PostStatus
    reviewedAt?: string
    reviewedBy?: string
    rejectReason?: string
  }
): boolean {
  const post = forumStore.posts.find((p) => p.id === id)
  if (post) {
    if (data.title !== undefined) post.title = data.title
    if (data.content !== undefined) post.content = data.content
    if (data.status !== undefined) post.status = data.status
    if (data.reviewedAt !== undefined) post.reviewedAt = data.reviewedAt
    if (data.reviewedBy !== undefined) post.reviewedBy = data.reviewedBy
    if (data.rejectReason !== undefined) post.rejectReason = data.rejectReason
    post.updatedAt = nowStr()
    return true
  }
  return false
}

/** 设置帖子审核状态（可选传入审核人、拒绝原因） */
export function setPostStatus(
  id: number,
  status: PostStatus,
  options?: { reviewedBy?: string; rejectReason?: string }
): boolean {
  const data: Parameters<typeof updateForumPost>[1] = { status }
  data.reviewedAt = nowStr()
  if (options?.reviewedBy !== undefined) data.reviewedBy = options.reviewedBy
  if (options?.rejectReason !== undefined) data.rejectReason = options.rejectReason
  return updateForumPost(id, data)
}

/** 删除帖子（同时删除该帖下所有评论） */
export function deleteForumPost(id: number): boolean {
  const idx = forumStore.posts.findIndex((p) => p.id === id)
  if (idx !== -1) {
    forumStore.posts.splice(idx, 1)
    forumStore.comments = forumStore.comments.filter((c) => c.postId !== id)
    return true
  }
  return false
}

/** 发表评论（默认待审核） */
export function addForumComment(data: {
  postId: number
  content: string
  author: string
  authorId?: number
}): ForumComment | null {
  const maxId = forumStore.comments.length > 0
    ? Math.max(...forumStore.comments.map((c) => c.id))
    : 0
  const now = nowStr()
  const newComment: ForumComment = {
    id: maxId + 1,
    postId: data.postId,
    content: data.content,
    author: data.author,
    authorId: data.authorId,
    createdAt: now,
    updatedAt: now,
    status: 'pending',
    likedByUserIds: [],
  }
  forumStore.comments.push(newComment)
  return newComment
}

/** 更新评论（审核字段等） */
export function updateForumComment(
  id: number,
  data: {
    status?: CommentStatus
    reviewedAt?: string
    reviewedBy?: string
    rejectReason?: string
  }
): boolean {
  const comment = forumStore.comments.find((c) => c.id === id)
  if (!comment) return false
  if (data.status !== undefined) comment.status = data.status
  if (data.reviewedAt !== undefined) comment.reviewedAt = data.reviewedAt
  if (data.reviewedBy !== undefined) comment.reviewedBy = data.reviewedBy
  if (data.rejectReason !== undefined) comment.rejectReason = data.rejectReason
  comment.updatedAt = nowStr()
  return true
}

/** 设置评论审核状态 */
export function setCommentStatus(
  id: number,
  status: CommentStatus,
  options?: { reviewedBy?: string; rejectReason?: string }
): boolean {
  const data: Parameters<typeof updateForumComment>[1] = { status }
  data.reviewedAt = nowStr()
  if (options?.reviewedBy !== undefined) data.reviewedBy = options.reviewedBy
  if (options?.rejectReason !== undefined) data.rejectReason = options.rejectReason
  return updateForumComment(id, data)
}

/** 删除评论 */
export function deleteForumComment(id: number): boolean {
  const idx = forumStore.comments.findIndex((c) => c.id === id)
  if (idx === -1) return false
  forumStore.comments.splice(idx, 1)
  return true
}

/** 搜索帖子（标题 + 内容模糊匹配） */
export function searchForumPosts(keyword: string): ForumPost[] {
  const list = getForumPosts()
  if (!keyword.trim()) return list
  const k = keyword.trim().toLowerCase()
  return list.filter(
    (p) =>
      p.title.toLowerCase().includes(k) || p.content.toLowerCase().includes(k)
  )
}
