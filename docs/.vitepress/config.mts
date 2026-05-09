import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

// 递归扫描 notes 目录生成侧边栏
function getNotesSidebar() {
  const notesDir = path.resolve(__dirname, '../notes')
  
  function scanDir(dir, basePath = '') {
    const items = []
    
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      
      // 先处理文件夹
      const folders = entries.filter(e => e.isDirectory()).sort()
      const files = entries.filter(e => e.isFile() && e.name.endsWith('.md')).sort()
      
      // 处理文件（排除 index.md）
      files.forEach(file => {
        const name = file.name.replace('.md', '')
        if (name !== 'index') {
          const link = basePath ? `/notes/${basePath}/${name}` : `/notes/${name}`
          items.push({ text: name, link: link })
        }
      })
      
      // 递归处理子文件夹
      folders.forEach(folder => {
        const folderPath = path.join(dir, folder.name)
        const children = scanDir(folderPath, basePath ? `${basePath}/${folder.name}` : folder.name)
        
        if (children.length > 0) {
          items.push({
            text: folder.name,
            collapsed: false,
            items: children
          })
        }
      })
    } catch (e) {
      // 忽略错误
    }
    
    return items
  }
  
  const allItems = scanDir(notesDir)
  
  return [
    {
      text: '笔记目录',
      items: [{ text: '所有笔记', link: '/notes/' }, ...allItems],
    },
  ]
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
