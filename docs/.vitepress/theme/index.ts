import DefaultTheme from 'vitepress/theme'

export default {
  ...DefaultTheme,
  enhanceApp({ router }) {
    if (typeof document === 'undefined') return

    const addWallpaper = () => {
      // 延迟执行确保 DOM 已更新
      setTimeout(() => {
        const hero = document.querySelector('.VPHero')
        const isHome = document.querySelector('.home')
        
        // 不是首页则移除壁纸
        if (!hero || !isHome) {
          const old = document.getElementById('random-wallpaper')
          if (old) old.remove()
          return
        }

        // 已存在则不再添加
        if (document.getElementById('random-wallpaper')) return

        const wallpaper = document.createElement('div')
        wallpaper.id = 'random-wallpaper'
        const randomId = Math.floor(Math.random() * 1000)
        const isMobile = window.innerWidth < 768

        wallpaper.style.cssText = [
          'position:absolute',
          'top:0',
          'left:0',
          'width:100%',
          'height:100%',
          'background-image:url(https://picsum.photos/' + (isMobile ? '800/1200' : '1920/1080') + '?random=' + randomId + ')',
          'background-size:cover',
          'background-position:center',
          'opacity:' + (isMobile ? '0.08' : '0.12'),
          'z-index:-1',
          'pointer-events:none'
        ].join(';')

        hero.style.position = 'relative'
        hero.appendChild(wallpaper)
      }, 100)
    }

    // 初始加载
    addWallpaper()

    // 路由切换后
    router.onAfterRouteChanged = () => {
      addWallpaper()
    }
  }
}
