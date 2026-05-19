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

// 扫描笔记目录数据（用于首页组件）
function scanNotes() {
  const notesPath = path.resolve(__dirname, '../notes')
  const result: any[] = []
  
  try {
    const dirs = fs.readdirSync(notesPath, { withFileTypes: true })
    
    for (const dir of dirs) {
      if (!dir.isDirectory()) continue
      
      const folderName = dir.name
      const folderPath = path.join(notesPath, folderName)
      const files = fs.readdirSync(folderPath)
        .filter(f => f.endsWith('.md') && f !== 'index.md' && !f.startsWith('.'))
      
      const children = files.map(f => {
        const name = f.replace('.md', '')
        return {
          name,
          path: `/TCZY/notes/${folderName}/${name}`
        }
      })
      
      result.push({
        name: folderName,
        path: `/TCZY/notes/${folderName}`,
        count: files.length,
        children: children.slice(0, 5)
      })
    }
  } catch (e) {
    console.error('扫描笔记失败:', e)
  }
  
  return result
}

export default defineConfig({
  base: '/TCZY/',
  title: '首页',
  description: '基于 Obsidian 的知识库',
  lang: 'zh-CN',
  cleanUrls: true,
  
  vite: {
    define: {
      __NOTE_DATA__: JSON.stringify(scanNotes())
    }
  },
  
  themeConfig: {
    // 导航
    nav: [
      { text: '首页', link: '/' },
      { text: '笔记', link: '/notes/' },
    ],
    
    // 侧边栏
    sidebar: {
      '/notes/': autoSidebar(),
    },
    
    // 目录标题
    outlineTitle: '本页内容',
    
    // 文档页脚
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    
    // 最后更新时间
    lastUpdatedText: '最后更新',
    
    // 暗黑模式切换
    darkModeSwitchLabel: '外观',
    
    // 侧边栏菜单标签
    sidebarMenuLabel: '菜单',
    
    // 返回顶部标签
    returnToTopLabel: '返回顶部',
    
    // 搜索
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },
    
    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/SurplusFate/TCZY' },
    ],
    
    // 页脚
    footer: {
      message: '基于 VitePress 搭建',
      copyright: '© 2025',
    },
  },
  
  markdown: {
    math: true,
  },
})
