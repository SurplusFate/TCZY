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

    onMounted(() => {
      fetchHitokoto()
      watch(() => route.path, () => nextTick(() => setTimeout(fetchHitokoto, 100)))
    })
  }
}
