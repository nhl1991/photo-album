
 
export default function Unauthorized() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-serif text-[clamp(2.5rem,2rem+3vw,4rem)] leading-none tracking-tight text-ink">401 - 권한 없음</h1>
      <p className="text-muted">이 페이지에 접근하려면 로그인하세요.</p>

    </main>
  )
}
