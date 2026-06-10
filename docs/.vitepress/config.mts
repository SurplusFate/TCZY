import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

// 递归获取所有markdown文件
function getMarkdownFiles(dirPath: string, basePath: string = ''): any[] {
  const result: any[] = []
  
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true })
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name)
      const relativePath = basePath ? `${basePath}/${item.name}` : item.name
      
      if (item.isDirectory() && item.name !== 'images') {
        // 递归扫描子文件夹
        const children = getMarkdownFiles(fullPath, relativePath)
        if (children.length > 0) {
          result.push({
            name: item.name,
            path: relativePath,
            isDir: true,
            children: children
          })
        }
      } else if (item.isFile() && item.name.endsWith('.md') && item.name !== 'index.md') {
        // 添加markdown文件
        result.push({
          name: item.name.replace('.md', ''),
          path: relativePath.replace('.md', ''),
          isDir: false
        })
      }
    }
  } catch (e) {
    console.error('扫描失败:', e)
  }
  
  return result
}

// 自动扫描生成侧边栏
function autoSidebar() {
  const notesPath = path.resolve(__dirname, '../notes')
  const result: any[] = [{ text: '所有笔记', link: '/notes/' }]
  
  try {
    const dirs = fs.readdirSync(notesPath, { withFileTypes: true })
    
    for (const dir of dirs) {
      if (!dir.isDirectory() || dir.name === 'images') continue
      
      const folderName = dir.name
      const folderPath = path.join(notesPath, folderName)
      const items = getMarkdownFiles(folderPath)
      
      // 转换文件结构为侧边栏格式
      function convertToSidebar(items: any[], parentPath: string = ''): any[] {
        return items.map(item => {
          const fullPath = parentPath ? `${parentPath}/${item.name}` : item.name
          if (item.isDir) {
            return {
              text: item.name,
              collapsed: false,
              items: convertToSidebar(item.children, fullPath)
            }
          } else {
            return {
              text: item.name,
              link: `/notes/${folderName}/${fullPath}`
            }
          }
        })
      }
      
      if (items.length > 0) {
        result.push({
          text: folderName,
          collapsed: false,
          items: convertToSidebar(items)
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
      if (!dir.isDirectory() || dir.name === 'images') continue
      
      const folderName = dir.name
      const folderPath = path.join(notesPath, folderName)
      const items = getMarkdownFiles(folderPath)
      
      // 计算总文件数（递归）
      function countFiles(items: any[]): number {
        let count = 0
        for (const item of items) {
          if (item.isDir) {
            count += countFiles(item.children)
          } else {
            count++
          }
        }
        return count
      }
      
      // 获取所有文件列表（平铺）
      function getAllFiles(items: any[], parentPath: string = ''): any[] {
        const files: any[] = []
        for (const item of items) {
          const fullPath = parentPath ? `${parentPath}/${item.name}` : item.name
          if (item.isDir) {
            files.push(...getAllFiles(item.children, fullPath))
          } else {
            files.push({
              name: item.name,
              path: `/TCZY/notes/${folderName}/${fullPath}`
            })
          }
        }
        return files
      }
      
      const allFiles = getAllFiles(items)
      
      if (items.length > 0) {
        result.push({
          name: folderName,
          path: `/TCZY/notes/${folderName}`,
          count: countFiles(items),
          children: allFiles.slice(0, 5)
        })
      }
    }
  } catch (e) {
    console.error('扫描笔记失败:', e)
  }
  
  return result
}

export default defineConfig({
  base: '/TCZY/',
  title: '首页',
  ignoreDeadLinks: true,    // ← 忽略死链接检查
  description: '基于 Obsidian 的知识库',
  lang: 'zh-CN',
  cleanUrls: true,

  head: [
    // 强制刷新缓存
    ['meta', { 'http-equiv': 'Cache-Control', content: 'no-cache, no-store, must-revalidate' }],
    ['meta', { 'http-equiv': 'Pragma', content: 'no-cache' }],
    ['meta', { 'http-equiv': 'Expires', content: '0' }],
    // 横屏适配：电脑模式下横屏自动放大 110%
    ['script', {}, `
(function(){
  function fix(){
    var w=window.innerWidth,h=window.innerHeight;
    if(w>h&&h<900){
      document.body.style.transform='scale(1.1)';
      document.body.style.transformOrigin='top left';
      document.body.style.width=(100/1.1)+'%';
    }else{
      document.body.style.transform='';
      document.body.style.transformOrigin='';
      document.body.style.width='';
    }
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',fix);
  }else{
    fix();
  }
  window.addEventListener('resize',fix);
  window.addEventListener('orientationchange',fix);
})();`],
  ],
  
  vite: {
    define: {
      __NOTE_DATA__: JSON.stringify(scanNotes())
    }
  },
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '笔记', link: '/notes/' },
    ],
    
    sidebar: {
      '/notes/': autoSidebar(),
    },
    
    outlineTitle: '本页内容',
    
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    
    lastUpdatedText: '最后更新',
    
    darkModeSwitchLabel: '外观',
    
    sidebarMenuLabel: '菜单',
    
    returnToTopLabel: '返回顶部',
    
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
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/SurplusFate/TCZY' },
    ],
    
    footer: {
      message: '基于 VitePress 搭建',
      copyright: '© 2025',
    },
  },
  
  markdown: {
    math: true,
    html: true,
  },
})