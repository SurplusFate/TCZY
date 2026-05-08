import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  ...DefaultTheme,
  setup() {
    // 只在首页添加随机壁纸
    if (typeof window !== 'undefined') {
      const addWallpaper = () => {
        const hero = document.querySelector('.VPHero')
        if (hero && document.querySelector('.home')) {
          // 创建壁纸元素
          let wallpaper = document.getElementById('random-wallpaper')
          if (!wallpaper) {
            wallpaper = document.createElement('div')
            wallpaper.id = 'random-wallpaper'
            wallpaper.style.cssText = `
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-image: url('https://picsum.photos/1920/1080');
              background-size: cover;
              background-position: center;
              opacity: 0.1;
              z-index: -1;
              pointer-events: none;
              border-radius: 16px;
            `
            hero.style.position = 'relative'
            hero.insertBefore(wallpaper, hero.firstChild)
          }
        }
      }
      
      // 页面加载时添加
      addWallpaper()
      
      // 路由切换时重新添加
      window.addEventListener('hashchange', () => {
        setTimeout(addWallpaper, 100)
      })
    }
  }
}
