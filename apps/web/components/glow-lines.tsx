export function GlowLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Cyan glowing line */}
      <div className="absolute top-1/3 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50 blur-lg animate-pulse"></div>
      
      {/* Purple glowing line */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-40 blur-lg animate-pulse delay-700"></div>
      
      {/* Green accent line */}
      <div className="absolute top-2/3 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-30 blur-lg animate-pulse delay-1000"></div>
    </div>
  )
}
