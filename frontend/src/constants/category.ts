import {
  Globe,
  Bomb,
  Lock,
  FileQuestion,
  ChevronsLeft,
  Smartphone,
  Brain,
  Shield,
  Binary,
} from 'lucide-vue-next';
import type { Component } from 'vue';
import type { Category } from '../types/challenge';

export interface CategoryMetadata {
  label: Category | 'All';
  icon: Component;
  // 用于 ChallengeCard 的背景 and 文字样式 (Arco Design Palette)
  cardClass: string;
  // 用于 TrainingView 侧边栏的活跃/非活跃样式
  sidebar: {
    active: string;
    inactive: string;
  };
}

export const CATEGORY_MAP: Record<Category | 'All', CategoryMetadata> = {
  All: {
    label: 'All',
    icon: Shield,
    cardClass: 'text-[#165DFF] bg-[#E8F3FF] dark:text-[#6E97FF] dark:bg-[#162746]',
    sidebar: {
      active: 'bg-[#165DFF] shadow-[#165DFF]/20 text-white',
      inactive: 'text-[#165DFF] hover:bg-[#E8F3FF] dark:text-[#6E97FF] dark:hover:bg-[#162746]',
    },
  },
  Pwn: {
    label: 'Pwn',
    icon: Bomb,
    cardClass: 'text-[#F53F3F] bg-[#FFE8E8] dark:text-[#FF7D7D] dark:bg-[#411414]',
    sidebar: {
      active: 'bg-[#F53F3F] shadow-[#F53F3F]/20 text-white',
      inactive: 'text-[#F53F3F] hover:bg-[#FFE8E8] dark:text-[#FF7D7D] dark:hover:bg-[#411414]',
    },
  },
  Mobile: {
    label: 'Mobile',
    icon: Smartphone,
    cardClass: 'text-[#F9925A] bg-[#FFF3E8] dark:text-[#FFA970] dark:bg-[#462A16]',
    sidebar: {
      active: 'bg-[#F9925A] shadow-[#F9925A]/20 text-white',
      inactive: 'text-[#F9925A] hover:bg-[#FFF3E8] dark:text-[#FFA970] dark:hover:bg-[#462A16]',
    },
  },
  Blockchain: {
    label: 'Blockchain',
    icon: Binary,
    cardClass: 'text-[#F7BA1E] bg-[#FFFBE8] dark:text-[#F9D04B] dark:bg-[#453A14]',
    sidebar: {
      active: 'bg-[#F7BA1E] shadow-[#F7BA1E]/20 text-white',
      inactive: 'text-[#F7BA1E] hover:bg-[#FFFBE8] dark:text-[#F9D04B] dark:hover:bg-[#453A14]',
    },
  },
  Reverse: {
    label: 'Reverse',
    icon: ChevronsLeft,
    cardClass: 'text-[#27C346] bg-[#E8FFEA] dark:text-[#37D67A] dark:bg-[#143A1E]',
    sidebar: {
      active: 'bg-[#27C346] shadow-[#27C346]/20 text-white',
      inactive: 'text-[#27C346] hover:bg-[#E8FFEA] dark:text-[#37D67A] dark:hover:bg-[#143A1E]',
    },
  },
  AI: {
    label: 'AI',
    icon: Brain,
    cardClass: 'text-[#14C9C9] bg-[#E8FFFF] dark:text-[#5ADADA] dark:bg-[#143939]',
    sidebar: {
      active: 'bg-[#14C9C9] shadow-[#14C9C9]/20 text-white',
      inactive: 'text-[#14C9C9] hover:bg-[#E8FFFF] dark:text-[#5ADADA] dark:hover:bg-[#143939]',
    },
  },
  Web: {
    label: 'Web',
    icon: Globe,
    cardClass: 'text-[#3491FA] bg-[#E8F3FF] dark:text-[#68B5FF] dark:bg-[#162746]',
    sidebar: {
      active: 'bg-[#3491FA] shadow-[#3491FA]/20 text-white',
      inactive: 'text-[#3491FA] hover:bg-[#E8F3FF] dark:text-[#68B5FF] dark:hover:bg-[#162746]',
    },
  },
  Crypto: {
    label: 'Crypto',
    icon: Lock,
    cardClass: 'text-[#722ED1] bg-[#F5E8FF] dark:text-[#B37FEB] dark:bg-[#261345]',
    sidebar: {
      active: 'bg-[#722ED1] shadow-[#722ED1]/20 text-white',
      inactive: 'text-[#722ED1] hover:bg-[#F5E8FF] dark:text-[#B37FEB] dark:hover:bg-[#261345]',
    },
  },
  Misc: {
    label: 'Misc',
    icon: FileQuestion,
    cardClass: 'text-[#86909C] bg-[#F2F3F5] dark:text-[#A9AEB8] dark:bg-[#2A2F37]',
    sidebar: {
      active: 'bg-[#86909C] shadow-[#86909C]/20 text-white',
      inactive: 'text-[#86909C] hover:bg-[#F2F3F5] dark:text-[#A9AEB8] dark:hover:bg-[#2A2F37]',
    },
  },
};

export const CATEGORIES = Object.values(CATEGORY_MAP);