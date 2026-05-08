import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // 客户端挂载后添加壁纸
    if (typeof document !== 'undefined') {
      router.onAfterRouteChanged = () => {
        setTimeout(() => {
          const hero = document.querySelector('.VPHero')
          const isHome = document.querySelector('.home')
          
          if (hero && isHome) {
            // 移除旧的壁纸
            const old = document.getElementById('random-wallpaper')
            if (old) old.remove()
            
            // 创建新壁纸
            const wallpaper = document.createElement('div')
            wallpaper.id = 'random-wallpaper'
            const randomId = Math.floor(Math.random() * 1000)
            wallpaper.style.cssText = `
              position: absolute;
              top: -50px;
              left: -50px;
              right: -50px;
              bottom: -50px;
              background-image: url('https://picsum.photos/1920/1080?random=${randomId}');
              background-size: cover;
              background-position: center;
              opacity: 0.12;
              z-index: -1;
              pointer-events: none;
              border-radius: 24px;
            `
            hero.style.position = 'relative'
            hero.appendChild(wallpaper)
          }
        }, 100)
      }
    }
  }
}
