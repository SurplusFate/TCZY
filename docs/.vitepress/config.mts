import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

// 递归扫描生成侧边栏
function autoSidebar() {
  const notesPath = path.resolve(__dirname, '../notes')
  const result: any[] = [{ text: '所有笔记', link: '/notes/' }]
  
  // 递归扫描目录
  function scanDir(dirPath: string, basePath: string): any[] {
    const items: any[] = []
    
    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true })
      
      const files: string[] = []
      const subDirs: string[] = []
      
      for (const entry of entries) {
        if (entry.name.startsWith('.')) continue
        
        if (entry.isDirectory()) {
          const subDirPath = path.join(dirPath, entry.name)
          const hasMdFiles = fs.readdirSync(subDirPath).some(f => f.endsWith('.md') && !f.startsWith('.'))
          if (hasMdFiles) {
            subDirs.push(entry.name)
          }
        } else if (entry.name.endsWith('.md') && entry.name !== 'index.md') {
          files.push(entry.name.replace('.md', ''))
        }
      }
      
      for (const file of files) {
        items.push({
          text: file,
          link: `${basePath}/${file}`
        })
      }
      
      for (const subDir of subDirs) {
        const subDirPath = path.join(dirPath, subDir)
        const subItems = scanDir(subDirPath, `${basePath}/${subDir}`)
        
        if (subItems.length > 0) {
          result.push({
            text: subDir,
            collapsed: false,
            items: subItems
          })
        }
      }
    } catch (e) {
      console.error('扫描失败:', e)
    }
    
    return items
  }
  
  try {
    const dirs = fs.readdirSync(notesPath, { withFileTypes: true })
    
    for (const dir of dirs) {
      if (!dir.isDirectory()) continue
      
      const folderName = dir.name
      const folderPath = path.join(notesPath, folderName)
      
      const items = scanDir(folderPath, `/notes/${folderName}`)
      
      const hasDirectFiles = items.length > 0
      const subDirs = fs.readdirSync(folderPath, { withFileTypes: true })
        .filter(e => e.isDirectory() && !e.name.startsWith('.'))
        .map(e => e.name)
      
      if (hasDirectFiles || subDirs.length > 0) {
        result.push({
          text: folderName,
          collapsed: false,
          items: items.length > 0 ? items : undefined
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
