import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import SplashScreen from './components/SplashScreen'
import PageLoadingBar from './components/PageLoadingBar'
import BottomNavigation from './components/BottomNavigation'
import Home from './pages/Home'
import MyBar from './pages/MyBar'
import CocktailDiscovery from './pages/CocktailDiscovery'
import CocktailDetail from './pages/CocktailDetail'
import MixingMode from './pages/MixingMode'
import Favorites from './pages/Favorites'
import ShoppingList from './pages/ShoppingList'
import NextIngredient from './pages/NextIngredient'
import ErrorLog from './pages/ErrorLog'
import { APP_CONFIG } from './config/app'
import { trackPageView } from './lib/analytics'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    trackPageView(pathname)
  }, [pathname])
  return null
}

function AppShell() {
  const location = useLocation()
  const isFullscreen = location.pathname.includes('/mix')

  return (
    <div className="min-h-dvh flex flex-col animate-fade-in">
      <PageLoadingBar />
      <ScrollToTop />
      <div className={isFullscreen ? 'flex-1' : 'flex-1 pb-24'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-bar" element={<MyBar />} />
          <Route path="/cocktails" element={<CocktailDiscovery />} />
          <Route path="/cocktail/:id" element={<CocktailDetail />} />
          <Route path="/cocktail/:id/mix" element={<MixingMode />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
          <Route path="/next-ingredient/:id" element={<NextIngredient />} />
          <Route path="/debug/errors" element={<ErrorLog />} />
        </Routes>
      </div>
      {!isFullscreen && <BottomNavigation />}
    </div>
  )
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    document.title = APP_CONFIG.name
  }, [])

  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />
  }

  return <AppShell />
}
