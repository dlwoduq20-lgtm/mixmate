import { Component, type ErrorInfo, type ReactNode } from 'react'
import { reportError } from '../lib/errorTracking'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportError(
      info.componentStack ? new Error(`${error.message}\n${info.componentStack}`) : error,
      'react',
      true,
    )
  }

  handleReload = () => {
    this.setState({ hasError: false })
    window.location.hash = '#/'
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center bg-[var(--color-bg)]">
          <div className="text-5xl mb-4">🍹💥</div>
          <h1 className="font-display font-extrabold text-xl text-[var(--color-ink)] mb-2">
            문제가 발생했어요
          </h1>
          <p className="text-[15px] text-[var(--color-ink-soft)] mb-6 max-w-xs">
            예상치 못한 오류가 생겼어요. 기록은 자동으로 남겨졌으니, 아래 버튼으로 다시 시작해 주세요.
          </p>
          <button
            onClick={this.handleReload}
            className="px-6 py-3 rounded-full bg-[var(--color-coral)] text-white font-semibold text-[15px] active:scale-95 transition-transform"
          >
            처음으로 돌아가기
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
