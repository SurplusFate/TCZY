import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

// 自动扫描 notes 目录生成侧边栏
function getNotesSidebar() {
  const notesDir = path.resolve(__dirname, '../notes')
  const items = [{ text: '所有笔记', link: '/notes/' }]
  
  try {
    const files = fs.readdirSync(notesDir)
    files
      .filter(file => file.endsWith('.md') && file !== 'index.md')
      .sort()
      .forEach(file => {
        const name = file.replace('index.md', '')
        // 将文件名作为标题（可以改成读取文件中的第一个标题）
        const title = name
        items.push({ text: title, link: `/notes/${name}` })
      })
  } catch (e) {
    // 目录不存在时忽略
  }
  
  return [
    {
      text: '笔记目录',
      items: items,
    },
  ]
}

export default defineConfig({
  base: '/TCZY/',
  title: '我的笔记',
  description: '基于 Obsidian 的知识库',
  lang: 'zh-CN',
  cleanUrls: true,

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '笔记', link: '/notes/' },
    ],

    sidebar: {
      '/notes/': getNotesSidebar(),
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/SurplusFate/TCZY' },
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message: '基于 VitePress 搭建',
      copyright: '© 2025',
    },
  },

  markdown: {
    math: true,
  },
})
