
 
export default function Unauthorized() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-serif text-[clamp(2.5rem,2rem+3vw,4rem)] leading-none tracking-tight text-ink">401 - Unauthorized</h1>
      <p className="text-muted">Please log in to access this page.</p>

    </main>
  )
}
