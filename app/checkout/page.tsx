import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { redirect } from "next/navigation"

export default function CheckoutPage() {
  // Redirect to payment page since checkout is handled there
  redirect("/payment")
}
