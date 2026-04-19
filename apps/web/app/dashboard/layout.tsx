import { Sidebar } from '@/components/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 bg-background">
        {children}
      </main>
    </div>
  )
}
