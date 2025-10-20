import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { redirect } from "next/navigation"

export default function MyOrdersPage() {
  // Redirect to profile page with orders tab
  redirect("/profile")
}
