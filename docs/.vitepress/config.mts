import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

// 自动扫描生成侧边栏
function autoSidebar() {
  const notesPath = path.resolve(__dirname, '../notes')
  const result: any[] = [{ text: '所有笔记', link: '/notes/' }]

  try {
    const dirs = fs.readdirSync(notesPath, { withFileTypes: true })
    
    for (const dir of dirs) {
      if (!dir.isDirectory()) continue
      
      const folderName = dir.name
      const folderPath = path.join(notesPath, folderName)
      const files = fs.readdirSync(folderPath)
        .filter(f => f.endsWith('.md') && f !== 'index.md' && !f.startsWith('.'))
        .map(f => f.replace('.md', ''))
      
      if (files.length > 0) {
        result.push({
          text: folderName,
          collapsed: false,
          items: files.map(name => ({
            text: name,
            link: `/notes/${folderName}/${name}`
          }))
        })
      }
    }
  } catch (e) {
    console.error('扫描失败:', e)
  }

  return [{ text: '笔记目录', items: result }]
}

export default defineConfig({
  base: '/TCZY/',
  title: '首页',
  description: '基于 Obsidian 的知识库',
  lang: 'zh-CN',
  cleanUrls: true,

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '笔记', link: '/notes/' },
    ],

    sidebar: {
      '/notes/': autoSidebar(),
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
