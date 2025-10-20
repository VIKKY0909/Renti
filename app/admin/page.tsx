import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AdminDashboard />
      </main>
      <Footer />
    </div>
  )
}
