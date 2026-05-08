import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    if (typeof document !== 'undefined') {
      router.onAfterRouteChanged = () => {
        setTimeout(() => {
          const hero = document.querySelector('.VPHero')
          const isHome = document.querySelector('.home')
          
          if (hero && isHome) {
            const old = document.getElementById('random-wallpaper')
            if (old) old.remove()
            
            const wallpaper = document.createElement('div')
            wallpaper.id = 'random-wallpaper'
            const randomId = Math.floor(Math.random() * 1000)
            
            // 检测是否为移动端
            const isMobile = window.innerWidth < 768
            
            wallpaper.style.cssText = `
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-image: url('https://picsum.photos/${isMobile ? '800/1200' : '1920/1080'}?random=${randomId}');
              background-size: cover;
              background-position: center;
              opacity: ${isMobile ? '0.08' : '0.12'};
              z-index: -1;
              pointer-events: none;
            `
            
            hero.style.position = 'relative'
            hero.appendChild(wallpaper)
          }
        }, 100)
      }
    }
  }
}
            hero.style.position = 'relative'
            hero.appendChild(wallpaper)
          }
        }, 100)
      }
    }
  }
}
