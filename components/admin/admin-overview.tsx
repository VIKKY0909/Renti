"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Users, Package, DollarSign, ShoppingCart, Star, Loader2 } from "lucide-react"
import { getAdminStats } from "@/lib/actions/admin"
import { AdminBanners } from "@/components/admin/admin-banners"

interface AdminStats {
  totalRevenue: number
  activeUsers: number
  totalProducts: number
  ordersThisMonth: number
  averageRating: number
  pendingReviews: number
  revenueChange: number
  usersChange: number
  productsChange: number
  ordersChange: number
  ratingChange: number
  reviewsChange: number
}

interface RecentActivity {
  type: string
  message: string
  time: string
}

export function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAdminStats()
        console.log("[Admin Overview] Stats response:", response)
        
        // Handle both response formats
        const statsData = response?.stats || response
        
        setStats(statsData || {
          totalRevenue: 0,
          activeUsers: 0,
          totalProducts: 0,
          ordersThisMonth: 0,
          averageRating: 0,
          pendingReviews: 0,
          revenueChange: 0,
          usersChange: 0,
          productsChange: 0,
          ordersChange: 0,
          ratingChange: 0,
          reviewsChange: 0,
        })
        
        // Fetch real recent activity
        const activityResponse = await fetch('/api/admin/activity?limit=5')
        if (activityResponse.ok) {
          const activityData = await activityResponse.json()
          setRecentActivity(activityData.activities || [])
        } else {
          // Fallback to empty array if API fails
          setRecentActivity([])
        }
      } catch (error) {
        console.error("Error fetching admin data:", error)
        // Set default stats if fetch fails
        setStats({
          totalRevenue: 0,
          activeUsers: 0,
          totalProducts: 0,
          ordersThisMonth: 0,
          averageRating: 0,
          pendingReviews: 0,
          revenueChange: 0,
          usersChange: 0,
          productsChange: 0,
          ordersChange: 0,
          ratingChange: 0,
          reviewsChange: 0,
        })
        setRecentActivity([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-4xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-4xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">Error loading dashboard data</p>
        </div>
      </div>
    )
  }

  const statsData = [
    { label: "Total Revenue", value: `₹${stats?.totalRevenue?.toLocaleString() || '0'}`, change: `${(stats?.revenueChange || 0) > 0 ? '+' : ''}${stats?.revenueChange || 0}%`, icon: DollarSign, color: "text-green-600" },
    { label: "Active Users", value: stats?.activeUsers?.toLocaleString() || '0', change: `${(stats?.usersChange || 0) > 0 ? '+' : ''}${stats?.usersChange || 0}%`, icon: Users, color: "text-blue-600" },
    { label: "Total Products", value: stats?.totalProducts?.toLocaleString() || '0', change: `${(stats?.productsChange || 0) > 0 ? '+' : ''}${stats?.productsChange || 0}%`, icon: Package, color: "text-purple-600" },
    { label: "Orders This Month", value: stats?.ordersThisMonth?.toLocaleString() || '0', change: `${(stats?.ordersChange || 0) > 0 ? '+' : ''}${stats?.ordersChange || 0}%`, icon: ShoppingCart, color: "text-orange-600" },
    { label: "Average Rating", value: stats?.averageRating?.toFixed(1) || '0.0', change: `${(stats?.ratingChange || 0) > 0 ? '+' : ''}${stats?.ratingChange || 0}%`, icon: Star, color: "text-yellow-600" },
    { label: "Pending Reviews", value: stats?.pendingReviews?.toString() || '0', change: `${(stats?.reviewsChange || 0) > 0 ? '+' : ''}${stats?.reviewsChange || 0}%`, icon: TrendingUp, color: "text-red-600" },
  ]
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-card rounded-xl sm:rounded-2xl border border-border p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-shadow animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-muted flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              </div>
              <span
                className={`text-xs sm:text-sm font-medium ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
              >
                {stat.change}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-lg sm:text-xl lg:text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6">
        <h2 className="font-semibold text-lg sm:text-xl mb-4 sm:mb-6">Recent Activity</h2>
        <div className="space-y-3 sm:space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-border last:border-0 last:pb-0">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm sm:text-base break-words">{activity.message}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Banner Management */}
      <AdminBanners />
    </div>
  )
}
