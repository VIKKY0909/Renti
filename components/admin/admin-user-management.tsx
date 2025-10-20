"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  Shield, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Eye, 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Activity,
  Package,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface User {
  id: string
  email: string
  full_name: string
  phone: string
  city: string
  state: string
  pincode: string
  avatar_url?: string
  role: 'user' | 'admin' | 'super_admin'
  is_active: boolean
  is_admin: boolean
  last_login?: string
  login_count: number
  created_at: string
  total_products: number
  total_orders: number
  last_activity?: string
  activity_status: 'active' | 'recent' | 'inactive'
  notes?: string
}

export function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const [editForm, setEditForm] = useState({
    role: 'user' as 'user' | 'admin' | 'super_admin',
    is_active: true,
    notes: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      if (response.ok) {
        setUsers(data.users || [])
      } else {
        toast.error('Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Error fetching users')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        toast.success('User updated successfully')
        fetchUsers()
        setIsEditDialogOpen(false)
        setSelectedUser(null)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Error updating user')
    }
  }

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !isActive })
      })

      if (response.ok) {
        toast.success(`User ${!isActive ? 'activated' : 'deactivated'} successfully`)
        fetchUsers()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update user status')
      }
    } catch (error) {
      console.error('Error updating user status:', error)
      toast.error('Error updating user status')
    }
  }

  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setEditForm({
      role: user.role,
      is_active: user.is_active,
      notes: user.notes || ''
    })
    setIsEditDialogOpen(true)
  }

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      user: { label: 'User', variant: 'secondary' as const, icon: Users, color: 'text-gray-600' },
      admin: { label: 'Admin', variant: 'default' as const, icon: Shield, color: 'text-blue-600' },
      super_admin: { label: 'Super Admin', variant: 'default' as const, icon: ShieldCheck, color: 'text-purple-600' }
    }

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {config.label}
      </Badge>
    )
  }

  const getActivityBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Active', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      recent: { label: 'Recent', variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
      inactive: { label: 'Inactive', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {config.label}
      </Badge>
    )
  }

  const getStats = () => {
    const stats = {
      total: users.length,
      users: users.filter(u => u.role === 'user').length,
      admins: users.filter(u => u.role === 'admin').length,
      super_admins: users.filter(u => u.role === 'super_admin').length,
      active: users.filter(u => u.is_active).length,
      inactive: users.filter(u => !u.is_active).length
    }
    return stats
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.is_active) ||
                         (statusFilter === 'inactive' && !user.is_active)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const stats = getStats()

  if (loading && users.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold mb-2">User Management</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Manage users, roles, and permissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Users</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Regular Users</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.users}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Admins</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.admins}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Super Admins</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.super_admins}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <UserX className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Inactive</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40 text-sm">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">Users</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="super_admin">Super Admins</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 text-sm">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users List */}
          <div className="space-y-3 sm:space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="hover-lift">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* User Avatar */}
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-muted flex-shrink-0 mx-auto sm:mx-0">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* User Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                        <h3 className="font-semibold text-base sm:text-lg text-center sm:text-left">{user.full_name}</h3>
                        <div className="flex gap-2 justify-center sm:justify-start">
                          {getRoleBadge(user.role)}
                          {getActivityBadge(user.activity_status)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm mb-3 sm:mb-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <span className="truncate break-all">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <span>{user.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <span>{user.city}, {user.state}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Activity Stats */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
                        <div className="text-center p-2 sm:p-3 bg-muted rounded-lg">
                          <Package className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 mx-auto mb-1" />
                          <p className="text-xs sm:text-sm text-muted-foreground">Products</p>
                          <p className="text-sm sm:text-base font-semibold">{user.total_products}</p>
                        </div>
                        <div className="text-center p-2 sm:p-3 bg-muted rounded-lg">
                          <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mx-auto mb-1" />
                          <p className="text-xs sm:text-sm text-muted-foreground">Orders</p>
                          <p className="text-sm sm:text-base font-semibold">{user.total_orders}</p>
                        </div>
                        <div className="text-center p-2 sm:p-3 bg-muted rounded-lg">
                          <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 mx-auto mb-1" />
                          <p className="text-xs sm:text-sm text-muted-foreground">Logins</p>
                          <p className="text-sm sm:text-base font-semibold">{user.login_count}</p>
                        </div>
                      </div>

                      {/* Last Activity */}
                      {user.last_activity && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm font-medium text-blue-800 mb-1">Last Activity</p>
                          <p className="text-sm text-blue-700">
                            {new Date(user.last_activity).toLocaleString()}
                          </p>
                        </div>
                      )}

                      {/* Admin Notes */}
                      {user.notes && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm font-medium text-yellow-800 mb-1">Admin Notes</p>
                          <p className="text-sm text-yellow-700">{user.notes}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(user)}
                          className="text-xs sm:text-sm"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="hidden sm:inline">Edit User</span>
                          <span className="sm:hidden">Edit</span>
                        </Button>
                        
                        <Button
                          size="sm"
                          variant={user.is_active ? "destructive" : "default"}
                          onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                          className="text-xs sm:text-sm"
                        >
                          {user.is_active ? (
                            <>
                              <UserX className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="hidden sm:inline">Deactivate</span>
                              <span className="sm:hidden">Deactivate</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="hidden sm:inline">Activate</span>
                              <span className="sm:hidden">Activate</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No users found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || roleFilter !== 'all' || statusFilter !== 'all'
                    ? 'No users match your current filters.'
                    : 'No users have been registered yet.'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User: {selectedUser?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select value={editForm.role} onValueChange={(value: 'user' | 'admin' | 'super_admin') => setEditForm({...editForm, role: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_active" className="text-right">
                Active
              </Label>
              <Select value={editForm.is_active.toString()} onValueChange={(value) => setEditForm({...editForm, is_active: value === 'true'})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right pt-2">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={editForm.notes}
                onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                className="col-span-3"
                placeholder="Add admin notes about this user..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => selectedUser && handleUpdateUser(selectedUser.id)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}




