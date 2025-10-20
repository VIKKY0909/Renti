"use client"

import { useState, useEffect } from "react"
import { TrendingUp, DollarSign, Calendar, Loader2 } from "lucide-react"
import { getOwnerEarnings } from "@/lib/actions/earnings"
import { SkeletonLoader } from "@/components/ui/skeleton-loader"
import { formatDate } from "@/lib/utils"

export function MyEarnings() {
  const [earnings, setEarnings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEarnings() {
      try {
        const { earnings: data, error } = await getOwnerEarnings()
        if (error) {
          console.error("Error fetching earnings:", error)
        } else {
          setEarnings(data || [])
        }
      } catch (error) {
        console.error("Error fetching earnings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEarnings()
  }, [])

  // Calculate stats from earnings data
  const totalEarnings = earnings.reduce((sum, earning) => sum + (earning.amount || 0), 0)
  const pendingPayouts = earnings
    .filter(earning => earning.status === 'pending')
    .reduce((sum, earning) => sum + (earning.amount || 0), 0)
  
  const thisMonth = earnings
    .filter(earning => {
      const earningDate = new Date(earning.created_at)
      const now = new Date()
      return earningDate.getMonth() === now.getMonth() && earningDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, earning) => sum + (earning.amount || 0), 0)

  const nextPayoutDate = earnings
    .filter(earning => earning.status === 'pending')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0]

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-3xl font-bold mb-2">My Earnings</h2>
          <p className="text-muted-foreground">Track your rental income and payouts</p>
        </div>
        <SkeletonLoader type="grid" count={3} />
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-bold mb-2">My Earnings</h2>
        <p className="text-muted-foreground">Track your rental income and payouts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Total Earnings</p>
          </div>
          <p className="text-3xl font-bold">₹{totalEarnings.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">This Month</p>
          </div>
          <p className="text-3xl font-bold">₹{thisMonth.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-sm text-muted-foreground">Pending Payout</p>
          </div>
          <p className="text-3xl font-bold">₹{pendingPayouts.toLocaleString()}</p>
          {nextPayoutDate && (
            <p className="text-xs text-muted-foreground mt-1">Next payout: {formatDate(nextPayoutDate.created_at)}</p>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-semibold text-xl mb-6">Recent Transactions</h3>
        
        {earnings.length === 0 ? (
          <div className="text-center py-20">
            <DollarSign className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-xl mb-2">No earnings yet</h3>
            <p className="text-muted-foreground">Start renting out your dresses to see earnings here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {earnings.slice(0, 10).map((earning) => (
              <div
                key={earning.id}
                className="flex items-center justify-between pb-4 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium">{earning.order?.product?.title || "Product Rental"}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(earning.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">₹{earning.amount}</p>
                  <p className={`text-xs ${
                    earning.status === "paid" ? "text-green-600" : 
                    earning.status === "pending" ? "text-yellow-600" : "text-gray-600"
                  }`}>
                    {earning.status === "paid" ? "Paid" : 
                     earning.status === "pending" ? "Pending" : "Processing"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
