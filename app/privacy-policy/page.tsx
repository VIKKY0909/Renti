import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { redirect } from "next/navigation"

export default function PrivacyPolicyPage() {
  // Redirect to privacy page
  redirect("/privacy")
}
