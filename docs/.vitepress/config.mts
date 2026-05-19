import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

// 递归扫描目录生成笔记数据
function scanNotes() {
  const notesPath = path.resolve(__dirname, '../notes')
  const result: any[] = []
  
  function scanDir(dirPath: string, basePath: string): any[] {
    const items: any[] = []
    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        if (entry.name.startsWith('.') || entry.name === 'index.md') continue
        
        if (entry.isDirectory()) {
          const subDirPath = path.join(dirPath, entry.name)
          const subItems = scanDir(subDirPath, `${basePath}/${entry.name}`)
          const hasFiles = fs.readdirSync(subDirPath).some(f => f.endsWith('.md'))
          
          if (hasFiles || subItems.length > 0) {
            items.push({
              name: entry.name,
              path: `${basePath}/${entry.name}/`,
              children: subItems.length > 0 ? subItems : undefined
            })
          }
        }
      }
    } catch (e) {}
    return items
  }
  
  try {
    const dirs = fs.readdirSync(notesPath, { withFileTypes: true })
    for (const dir of dirs) {
      if (!dir.isDirectory() || dir.name.startsWith('.')) continue
      
      const folderPath = path.join(notesPath, dir.name)
      const children = scanDir(folderPath, `/notes/${dir.name}`)
      
      // 统计文章数
      let count = 0
      function countFiles(p: string) {
        const entries = fs.readdirSync(p, { withFileTypes: true })
        for (const e of entries) {
          if (e.name.endsWith('.md') && e.name !== 'index.md') count++
          if (e.isDirectory() && !e.name.startsWith('.')) countFiles(path.join(p, e.name))
        }
      }
      countFiles(folderPath)
      
      result.push({
        name: dir.name,
        path: `/notes/${dir.name}/`,
        count: count,
        children: children.length > 0 ? children : undefined
      })
    }
  } catch (e) {}
  
  return result
}

// 导出笔记数据供组件使用
const noteData = scanNotes()

export default defineConfig({
  base: '/TCZY/',
  title: '首页',
  description: '基于 Obsidian 的知识库',
  lang: 'zh-CN',
  cleanUrls: true,
  vite: {
    define: {
      __NOTE_DATA__: JSON.stringify(noteData)
    }
  },
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '笔记', link: '/notes/' },
    ],
    sidebar: { 
      '/notes/': autoSidebar() 
    },
    outlineTitle: '本页内容',
    docFooter: { prev: '上一页', next: '下一页' },
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    socialLinks: [{ icon: 'github', link: 'https://github.com/SurplusFate/TCZY' }],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
      }
    },
    footer: { message: '基于 VitePress 搭建', copyright: '© 2025' },
  },
  markdown: { math: true },
})

// 自动侧边栏（复用之前的函数）
function autoSidebar() {
  const notesPath = path.resolve(__dirname, '../notes')
  const result: any[] = [{ text: '所有笔记', link: '/notes/' }]
  
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
          if (hasMdFiles) subDirs.push(entry.name)
        } else if (entry.name.endsWith('.md') && entry.name !== 'index.md') {
          files.push(entry.name.replace('.md', ''))
        }
      }
      
      for (const file of files) {
        items.push({ text: file, link: `${basePath}/${file}` })
      }
      for (const subDir of subDirs) {
        const subDirPath = path.join(dirPath, subDir)
        const subItems = scanDir(subDirPath, `${basePath}/${subDir}`)
        if (subItems.length > 0) {
          items.push({ text: subDir, collapsed: false, items: subItems })
        }
      }
    } catch (e) {}
    return items
  }
  
  try {
    const dirs = fs.readdirSync(notesPath, { withFileTypes: true })
    for (const dir of dirs) {
      if (!dir.isDirectory()) continue
      const folderName = dir.name
      const folderPath = path.join(notesPath, folderName)
      const items = scanDir(folderPath, `/notes/${folderName}`)
      if (items.length > 0) {
        result.push({ text: folderName, collapsed: false, items: items })
      }
    }
  } catch (e) {}
  return [{ text: '笔记目录', items: result }]
}
