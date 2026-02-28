import { reactive } from 'vue'
import type { Announcement } from '@/types/announcement'
import { announcements as mockAnnouncements } from '@/mock/announcements'

// 共享的公告数据存储
export const announcementStore = reactive<{
  announcements: Announcement[]
}>({
  announcements: [...mockAnnouncements],
})

// 获取所有已发布的公告（按创建时间倒序）
export function getPublishedAnnouncements(): Announcement[] {
  return announcementStore.announcements
    .filter((a) => a.status === 'published')
    .sort((a, b) => {
      // 置顶的排在前面
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      // 然后按创建时间倒序
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
}

// 获取公告
export function getAnnouncement(id: number): Announcement | undefined {
  return announcementStore.announcements.find((a) => a.id === id)
}

// 更新公告
export function updateAnnouncement(
  id: number,
  data: {
    title?: string
    content?: string
    isPinned?: boolean
    status?: 'published' | 'draft'
  }
): boolean {
  const announcement = announcementStore.announcements.find((a) => a.id === id)
  if (announcement) {
    if (data.title !== undefined) announcement.title = data.title
    if (data.content !== undefined) announcement.content = data.content
    if (data.isPinned !== undefined) announcement.isPinned = data.isPinned
    if (data.status !== undefined) announcement.status = data.status
    announcement.updatedAt = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(/\//g, '-')
    return true
  }
  return false
}

// 创建公告
export function createAnnouncement(data: {
  title: string
  content: string
  isPinned: boolean
  status: 'published' | 'draft'
}): Announcement | null {
  const maxId = announcementStore.announcements.length > 0
    ? Math.max(...announcementStore.announcements.map((a) => a.id))
    : 0
  const newId = maxId + 1

  const now = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(/\//g, '-')

  const newAnnouncement: Announcement = {
    id: newId,
    title: data.title,
    content: data.content,
    author: 'admin',
    createdAt: now,
    updatedAt: now,
    isPinned: data.isPinned,
    status: data.status,
  }

  announcementStore.announcements.push(newAnnouncement)
  return newAnnouncement
}

// 删除公告
export function deleteAnnouncement(id: number): boolean {
  const index = announcementStore.announcements.findIndex((a) => a.id === id)
  if (index !== -1) {
    announcementStore.announcements.splice(index, 1)
    return true
  }
  return false
}

