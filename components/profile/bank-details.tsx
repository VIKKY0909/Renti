"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Building2, User } from "lucide-react"
import { getBankDetails, updateBankDetails } from "@/lib/actions/bank-details"
import { toast } from "sonner"

export function BankDetails() {
  const [isLoading, setIsLoading] = useState(false)
  const [bankDetails, setBankDetails] = useState<any>(null)

  useEffect(() => {
    async function fetchBankDetails() {
      try {
        const { bankDetails: data } = await getBankDetails()
        setBankDetails(data)
      } catch (error) {
        console.error("Error fetching bank details:", error)
      }
    }

    fetchBankDetails()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const { success, error } = await updateBankDetails(formData)
      
      if (success) {
        toast.success("Bank details saved successfully!")
      } else {
        toast.error(error || "Failed to save bank details")
      }
    } catch (error) {
      console.error("Error saving bank details:", error)
      toast.error("Failed to save bank details")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-bold mb-2">Bank Details</h2>
        <p className="text-muted-foreground">Add your bank account for receiving payouts</p>
      </div>

      <form onSubmit={handleSave} className="bg-card rounded-2xl border border-border p-6 space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="account-holder">Account Holder Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="account_holder_name" defaultValue={bankDetails?.account_holder_name || ""} placeholder="As per bank records" className="pl-10 bg-transparent" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="account-number">Account Number</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="account_number"
              type="text"
              defaultValue={bankDetails?.account_number || ""}
              placeholder="Enter account number"
              className="pl-10 bg-transparent"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-account">Confirm Account Number</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirm-account"
              type="text"
              placeholder="Re-enter account number"
              className="pl-10 bg-transparent"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ifsc">IFSC Code</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="ifsc_code" defaultValue={bankDetails?.ifsc_code || ""} placeholder="e.g., SBIN0001234" className="pl-10 bg-transparent" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bank-name">Bank Name</Label>
          <Input id="bank_name" defaultValue={bankDetails?.bank_name || ""} placeholder="e.g., State Bank of India" className="bg-transparent" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="branch">Branch Name</Label>
          <Input id="branch_name" defaultValue={bankDetails?.branch_name || ""} placeholder="e.g., Mumbai Main Branch" className="bg-transparent" required />
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
          <p className="font-medium mb-2">Important:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Ensure all details match your bank records exactly</li>
            <li>Payouts are processed within 3-5 business days</li>
            <li>You can update these details anytime</li>
          </ul>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Bank Details"}
        </Button>
      </form>
    </div>
  )
}
