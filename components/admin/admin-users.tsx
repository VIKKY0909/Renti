"use client"

import { useState, useEffect } from "react"
import { Users, Mail, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getAllUsers } from "@/lib/actions/admin"
import { SkeletonLoader } from "@/components/ui/skeleton-loader"
import { formatDate } from "@/lib/utils"

export function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { users: data, error } = await getAllUsers()
        if (error) {
          console.error("Error fetching users:", error)
        } else {
          setUsers(data || [])
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-4xl font-bold mb-2">Users Management</h1>
          <p className="text-muted-foreground">Manage platform users</p>
        </div>
        <SkeletonLoader type="grid" count={4} />
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Users Management</h1>
        <p className="text-sm sm:text-base text-muted-foreground">View and manage all platform users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-card rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-full">
              <Users className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Total Users</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-green-500/10 rounded-full">
              <Mail className="h-4 w-4 sm:h-6 sm:w-6 text-green-500" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Active Users</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{users.filter(user => user.email_confirmed_at).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-blue-500/10 rounded-full">
              <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">New This Month</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold">
                {users.filter(user => {
                  const userDate = new Date(user.created_at)
                  const now = new Date()
                  return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear()
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12 sm:py-20">
          <Users className="h-16 w-16 sm:h-24 sm:w-24 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg sm:text-xl mb-2">No users found</h3>
          <p className="text-sm sm:text-base text-muted-foreground">No users have registered yet.</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {users.map((user) => (
            <div key={user.id} className="bg-card rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 mx-auto sm:mx-0">
                  <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>
                    {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h4 className="font-semibold text-base sm:text-lg">{user.full_name || "No Name"}</h4>
                    <div className="flex justify-center sm:justify-start gap-2">
                      {user.is_admin && (
                        <Badge variant="default" className="text-xs">Admin</Badge>
                      )}
                      {user.email_confirmed_at && (
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground break-all">{user.email}</p>
                  {user.phone && (
                    <p className="text-xs sm:text-sm text-muted-foreground">{user.phone}</p>
                  )}
                  {user.city && user.state && (
                    <p className="text-xs sm:text-sm text-muted-foreground">{user.city}, {user.state}</p>
                  )}
                </div>

                <div className="text-center sm:text-right">
                  <p className="text-xs sm:text-sm text-muted-foreground">Joined</p>
                  <p className="text-xs sm:text-sm font-medium">{formatDate(user.created_at)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}