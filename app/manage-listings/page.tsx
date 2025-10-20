import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ManageListingsContent } from "@/components/manage-listings/manage-listings-content"

export default async function ManageListingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user's listings
  const { data: listings, error } = await supabase
    .from("products")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching listings:", error)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <ManageListingsContent listings={listings || []} userId={user.id} />
      </main>
      <Footer />
    </div>
  )
}
