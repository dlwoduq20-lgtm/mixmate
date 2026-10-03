// Hidden debug page — not linked from any nav or button, reached only by
// going to #/debug/errors directly. Shows the local error log (see
// lib/errorLog.ts) so a real bug hit on a real phone can be read off the
// device itself, without waiting on GA4 (which can take up to 48h and only
// keeps a truncated message, not a stack trace).

import { useState } from 'react'
import { getLoggedErrors, clearLoggedErrors, type LoggedError } from '../lib/errorLog'

const SOURCE_LABEL: Record<LoggedError['source'], string> = {
  react: '화면 렌더링',
  window: '실행 오류',
  promise: '비동기 오류',
}

function formatTimestamp(ts: number) {
  return new Date(ts).toLocaleString('ko-KR')
}

export default function ErrorLog() {
  const [errors, setErrors] = useState(() => getLoggedErrors())

  const handleClear = () => {
    clearLoggedErrors()
    setErrors([])
  }

  return (
    <div className="pt-6 pb-10 px-5">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display font-extrabold text-2xl text-[var(--color-ink)]">오류 기록</h1>
        {errors.length > 0 && (
          <button
            onClick={handleClear}
            className="px-3.5 py-1.5 rounded-full text-[13px] font-semibold border border-[var(--color-border)] text-[var(--color-ink-soft)] bg-white"
          >
            전체 삭제
          </button>
        )}
      </div>
      <p className="text-[13px] text-[var(--color-ink-soft)] mb-5">
        이 기기에 최근 기록된 오류 {errors.length}건 (최대 30건 보관)
      </p>

      {errors.length === 0 ? (
        <div className="text-center py-16 text-[var(--color-ink-soft)] text-[14px]">
          기록된 오류가 없습니다.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {errors.map((e) => (
            <div key={e.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--color-coral-light)] text-[var(--color-coral-dark)]">
                  {SOURCE_LABEL[e.source]}
                </span>
                <span className="text-[12px] text-[var(--color-ink-soft)]">{formatTimestamp(e.timestamp)}</span>
              </div>
              <p className="text-[14px] text-[var(--color-ink)] font-medium break-words">{e.message}</p>
              <p className="text-[12px] text-[var(--color-ink-soft)] mt-1">위치: {e.path || '(알 수 없음)'}</p>
              {e.stack && (
                <details className="mt-2">
                  <summary className="text-[12px] text-[var(--color-ink-soft)] cursor-pointer">스택 트레이스</summary>
                  <pre className="mt-1.5 text-[11px] text-[var(--color-ink-soft)] whitespace-pre-wrap break-words bg-[var(--color-bg-soft)] rounded-lg p-2.5 overflow-x-auto">
                    {e.stack}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
