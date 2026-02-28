import { reactive } from 'vue'
import { getPublishedAnnouncements } from '@/stores/announcementStore'
import { getForumPosts, forumStore } from '@/stores/forumStore'

/** 轮播图单条 */
export interface CarouselSlide {
  id: number
  imageUrl: string
  title: string
  subtitle: string
  badge?: string
}

/** 最新动态候选项（来源：全站/训练/比赛公告、论坛帖子） */
export interface FeedCandidate {
  id: string
  source: 'announcement' | 'forum'
  sourceLabel: string
  title: string
  time: string
  author?: string
}

/** 每日签到配置 */
export interface CheckInConfig {
  enabled: boolean
  dailyChallengeId: string
  dailyChallengeTitle: string
  fortune: string
  yiText: string
  yiDesc: string
  jiText: string
  jiDesc: string
  motto: string
}

/** 曾在表格中展示过的标签（取消勾选后行保留，仅复选框变空） */
const knownTagsForDisplay = reactive<Set<string>>(new Set())

const homeStore = reactive<{
  carouselSlides: CarouselSlide[]
  selectedFeedIds: string[]
  hotTags: string[]
  checkInConfig: CheckInConfig
}>({
  carouselSlides: [
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
      title: 'SWJTU Rookie CTF Game 2026',
      subtitle: '本年CTF新秀杯已经开启，点击进入赛事详情页面报名参赛。',
      badge: '正在进行',
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200',
      title: '训练平台持续更新',
      subtitle: '新增 Web、Pwn、Reverse 等多方向题目，欢迎来练。',
      badge: '热门',
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
      title: '论坛交流区上线',
      subtitle: '分享 writeup、讨论题目，与大家一同进步。',
      badge: '新功能',
    },
  ],
  selectedFeedIds: ['announcement-1', 'announcement-2', 'forum-1'],
  hotTags: ['#pwn', '#writeup', '#ctf2024', '#python', '#docker'],
  checkInConfig: {
    enabled: true,
    dailyChallengeId: 'PWN-082',
    dailyChallengeTitle: 'Easy_Heap_OverFlow',
    fortune: '中吉',
    yiText: '研究 SQL 注入',
    yiDesc: '万物皆可 Union，今天灵感爆棚',
    jiText: '强制删除容器',
    jiDesc: '小心没做完题数据就丢了',
    motto: '真正的黑客，在命令行里寻找诗意。',
  },
})

let nextCarouselId = 4

export function getCarouselSlides(): CarouselSlide[] {
  return [...homeStore.carouselSlides]
}

export function addCarouselSlide(slide: Omit<CarouselSlide, 'id'>): CarouselSlide {
  const newSlide: CarouselSlide = { ...slide, id: nextCarouselId++ }
  homeStore.carouselSlides.push(newSlide)
  return newSlide
}

export function updateCarouselSlide(id: number, data: Partial<Omit<CarouselSlide, 'id'>>): boolean {
  const slide = homeStore.carouselSlides.find((s) => s.id === id)
  if (!slide) return false
  if (data.imageUrl !== undefined) slide.imageUrl = data.imageUrl
  if (data.title !== undefined) slide.title = data.title
  if (data.subtitle !== undefined) slide.subtitle = data.subtitle
  if (data.badge !== undefined) slide.badge = data.badge
  return true
}

export function removeCarouselSlide(id: number): boolean {
  const idx = homeStore.carouselSlides.findIndex((s) => s.id === id)
  if (idx === -1) return false
  homeStore.carouselSlides.splice(idx, 1)
  return true
}

export function moveCarouselSlide(id: number, direction: 'up' | 'down'): boolean {
  const idx = homeStore.carouselSlides.findIndex((s) => s.id === id)
  if (idx === -1) return false
  const newIdx = direction === 'up' ? idx - 1 : idx + 1
  if (newIdx < 0 || newIdx >= homeStore.carouselSlides.length) return false
  const arr = homeStore.carouselSlides
  const a = arr[idx]
  const b = arr[newIdx]
  if (a === undefined || b === undefined) return false
  arr[idx] = b
  arr[newIdx] = a
  return true
}

const SOURCE_LABELS = ['全站公告', '训练公告', '比赛公告', '论坛帖子'] as const

type SourceLabel = (typeof SOURCE_LABELS)[number]

/** 按来源分组的候选列表（全站公告、训练公告、比赛公告、论坛帖子） */
export function getFeedCandidatesBySource(): Record<SourceLabel, FeedCandidate[]> {
  const out: Record<SourceLabel, FeedCandidate[]> = {
    全站公告: [],
    训练公告: [],
    比赛公告: [],
    论坛帖子: [],
  }
  const announcements = getPublishedAnnouncements()
  announcements.forEach((a) => {
    let sourceLabel: SourceLabel = '全站公告'
    if (a.title.includes('训练') || a.title.includes('题目')) sourceLabel = '训练公告'
    else if (a.title.includes('比赛') || a.title.includes('赛事') || a.title.includes('CTF')) sourceLabel = '比赛公告'
    out[sourceLabel].push({
      id: `announcement-${a.id}`,
      source: 'announcement',
      sourceLabel,
      title: a.title,
      time: a.createdAt,
      author: a.author,
    })
  })
  getForumPosts().forEach((p) => {
    out['论坛帖子'].push({
      id: `forum-${p.id}`,
      source: 'forum',
      sourceLabel: '论坛帖子',
      title: p.title,
      time: p.createdAt,
      author: p.author,
    })
  })
  SOURCE_LABELS.forEach((label) => {
    out[label].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
  })
  return out
}

/** 获取最新动态候选列表（兼容，合并所有来源） */
export function getFeedCandidates(): FeedCandidate[] {
  const bySource = getFeedCandidatesBySource()
  const merged = SOURCE_LABELS.flatMap((label) => bySource[label])
  return merged.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
}

export function getSelectedFeedIds(): string[] {
  return [...homeStore.selectedFeedIds]
}

export function setSelectedFeedIds(ids: string[]): void {
  homeStore.selectedFeedIds = ids
}

/** 根据选中的 id 解析出展示用的动态列表（供前台 ActivityFeed 使用），按时间倒序 */
export function getSelectedFeeds(): FeedCandidate[] {
  const candidates = getFeedCandidates()
  const selected = homeStore.selectedFeedIds
    .map((id) => candidates.find((c) => c.id === id))
    .filter((c): c is FeedCandidate => !!c)
  return selected.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
}

export function getHotTags(): string[] {
  return [...homeStore.hotTags]
}

export function setHotTags(tags: string[]): void {
  homeStore.hotTags = tags
}

export function addHotTag(tag: string): void {
  const t = tag.startsWith('#') ? tag : `#${tag}`
  if (!homeStore.hotTags.includes(t)) homeStore.hotTags.push(t)
  knownTagsForDisplay.add(t)
}

export function removeHotTag(tag: string): void {
  homeStore.hotTags = homeStore.hotTags.filter((x) => x !== tag)
}

/** 标签出现次数统计（从论坛帖子、公告标题与内容中提取 #xxx） */
export interface TagCount {
  tag: string
  count: number
}

export function getTagCounts(): TagCount[] {
  const countMap = new Map<string, number>()
  const add = (text: string) => {
    const matches = text.matchAll(/#(\w+)/g)
    for (const m of matches) {
      const tag = '#' + m[1]
      countMap.set(tag, (countMap.get(tag) ?? 0) + 1)
    }
  }
  getPublishedAnnouncements().forEach((a) => {
    add(a.title)
    add(a.content)
  })
  forumStore.posts.forEach((p) => {
    add(p.title)
    add(p.content)
  })
  homeStore.hotTags.forEach((tag) => {
    knownTagsForDisplay.add(tag)
    if (!countMap.has(tag)) countMap.set(tag, 0)
  })
  knownTagsForDisplay.forEach((tag) => {
    if (!countMap.has(tag)) countMap.set(tag, 0)
  })
  return Array.from(countMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export function getCheckInConfig(): CheckInConfig {
  return { ...homeStore.checkInConfig }
}

export function updateCheckInConfig(data: Partial<CheckInConfig>): void {
  Object.assign(homeStore.checkInConfig, data)
}

export { homeStore }
