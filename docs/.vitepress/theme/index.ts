import DefaultTheme from 'vitepress/theme'
import './custom.css'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

export default {
  ...DefaultTheme,
  setup() {
    const route = useRoute()
    
    // 获取一言
    async function fetchHitokoto() {
      try {
        const res = await fetch('https://v1.hitokoto.cn/')
        const data = await res.json()
        const hitokoto = data.hitokoto
        const from = data.from ? ` —— ${data.from}` : ''
        
        // 更新页脚
        const footer = document.querySelector('.VPFooter .message') as HTMLElement
        if (footer) {
          footer.textContent = hitokoto + from
        }
      } catch (e) {
        console.log('获取一言失败')
      }
    }
    
    onMounted(() => {
      // 初始加载
      fetchHitokoto()
      
      // 监听路由变化
      watch(
        () => route.path,
        () => nextTick(() => {
          setTimeout(fetchHitokoto, 100)
        })
      )
    })
  }
}
