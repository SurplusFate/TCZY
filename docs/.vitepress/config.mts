import { defineConfig } from 'vitepress'

export default defineConfig({
  base：'/TCZY/',
  title: '我的笔记',
  description: '基于 Obsidian 的知识库',
  lang: 'zh-CN',
  cleanUrls: true,

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '笔记', link: '/docs/notes/' },
    ],

    sidebar: {
      '/notes/': [
        {
          text: '笔记目录',
          items: [
            { text: '所有笔记', link: '/docs/notes/' },
          ],
        },
      ],
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

