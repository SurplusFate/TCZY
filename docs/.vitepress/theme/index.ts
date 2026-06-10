import DefaultTheme from 'vitepress/theme'
import './custom.css'
import NoteList from './components/NoteList.vue'
import NoteStats from './components/NoteStats.vue'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('NoteList', NoteList)
    app.component('NoteStats', NoteStats)
  },
  setup() {
    const route = useRoute()

    async function fetchHitokoto() {
      try {
        const res = await fetch('https://v1.hitokoto.cn/')
        const data = await res.json()
        const hitokoto = data.hitokoto
        const from = data.from ? ` —— ${data.from}` : ''
        const footer = document.querySelector('.VPFooter .message') as HTMLElement
        if (footer) {
          footer.textContent = hitokoto + from
        }
      } catch (e) {}
    }

    function updateLandscapeClass() {
      const isLandscape = window.innerWidth > window.innerHeight && window.innerHeight < 700
      document.documentElement.classList.toggle('tc-landscape', isLandscape)
      // 横屏时强制让 VitePress 认为屏幕宽度只有 768px（触发移动布局）
      if (isLandscape) {
        const meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement
        if (meta) {
          meta.content = 'width=768, initial-scale=' + (window.innerWidth / 768)
        }
      } else {
        const meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement
        if (meta) {
          meta.content = 'width=device-width, initial-scale=1'
        }
      }
    }

    onMounted(() => {
      fetchHitokoto()
      watch(() => route.path, () => nextTick(() => setTimeout(fetchHitokoto, 100)))

      updateLandscapeClass()
      window.addEventListener('resize', updateLandscapeClass)
      window.addEventListener('orientationchange', updateLandscapeClass)
    })
  }
}
