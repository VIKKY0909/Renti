import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { redirect } from "next/navigation"

export default function ForgotPasswordPage() {
  // Redirect to login page since forgot password is not implemented
  redirect("/login")
}
