import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function PageLoadingBar() {
  const location = useLocation()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    setProgress(18)
    const t1 = setTimeout(() => setProgress(72), 50)
    const t2 = setTimeout(() => setProgress(100), 260)
    const t3 = setTimeout(() => setVisible(false), 520)
    const t4 = setTimeout(() => setProgress(0), 620)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [location.pathname])

  return (
    <div
      className="fixed left-0 right-0 z-90 h-[3px] transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0, maxWidth: 480, margin: '0 auto', top: 'env(safe-area-inset-top, 0px)' }}
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#FFA94D] to-[#FF6B4A] transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
