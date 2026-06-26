import {
	Ticket,
	BookOpen,
	Trophy,
	Cookie,
	Repeat,
	Download,
	CalendarClock,
	type LucideIcon,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'codes' -> t('nav.codes')
	path: string // URL 路径，如 '/codes'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// CookieRun Classic 导航分类（与 content/ 目录的 7 个分类一一对应）
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'codes', path: '/codes', icon: Ticket, isContentType: true },
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'tier', path: '/tier', icon: Trophy, isContentType: true },
	{ key: 'cookies', path: '/cookies', icon: Cookie, isContentType: true },
	{ key: 'reroll', path: '/reroll', icon: Repeat, isContentType: true },
	{ key: 'download', path: '/download', icon: Download, isContentType: true },
	{ key: 'release', path: '/release', icon: CalendarClock, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> []

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
