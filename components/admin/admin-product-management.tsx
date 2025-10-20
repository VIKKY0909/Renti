"use client"

import { useState, useEffect } from "react"
import { Eye, CheckCircle, XCircle, Clock, AlertTriangle, User, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Image from "next/image"

interface Product {
  id: string
  title: string
  description: string
  admin_description?: string
  brand?: string
  color?: string
  fabric?: string
  occasion?: string
  rental_price: number
  security_deposit: number
  original_price?: number
  images: string[]
  status: string
  rejection_reason?: string
  admin_notes?: string
  availability_status: string
  is_available: boolean
  created_at: string
  approved_at?: string
  rejected_at?: string
  profiles: {
    id: string
    full_name: string
    email: string
    phone: string
    city: string
    state: string
  }
  categories: {
    id: string
    name: string
    slug: string
  }
  approved_by_profile?: {
    id: string
    full_name: string
  }
  rejected_by_profile?: {
    id: string
    full_name: string
  }
}

interface ProductManagementProps {
  initialProducts?: Product[]
}

export function AdminProductManagement({ initialProducts = [] }: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [allProducts, setAllProducts] = useState<Product[]>([]) // For stats
  const [loading, setLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false)
  const [adminDescription, setAdminDescription] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [activeTab])

  useEffect(() => {
    fetchAllProducts() // Fetch all products for stats once on mount
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/products?status=${activeTab === 'all' ? '' : activeTab}`)
      const data = await response.json()
      if (response.ok) {
        setProducts(data.products || [])
      } else {
        toast.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Error fetching products')
    } finally {
      setLoading(false)
    }
  }

  const fetchAllProducts = async () => {
    try {
      const response = await fetch('/api/admin/products?status=all')
      const data = await response.json()
      if (response.ok) {
        setAllProducts(data.products || [])
      }
    } catch (error) {
      console.error('Error fetching all products:', error)
    }
  }

  const handleProductAction = async (productId: string, action: string, notes?: string, adminDescription?: string) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action,
          admin_notes: notes,
          admin_description: adminDescription
        })
      })

      if (response.ok) {
        toast.success(`Product ${action} successfully`)
        fetchProducts()
        setSelectedProduct(null)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Error updating product')
    }
  }

  const handleApproveProduct = async () => {
    if (!selectedProduct || !adminDescription.trim()) {
      toast.error('Admin description is required to approve a product')
      return
    }

    setActionLoading(true)
    try {
      await handleProductAction(selectedProduct.id, 'approved', adminNotes, adminDescription)
      setApprovalDialogOpen(false)
      setAdminDescription("")
      setAdminNotes("")
    } finally {
      setActionLoading(false)
    }
  }

  const openApprovalDialog = (product: Product) => {
    setSelectedProduct(product)
    setAdminDescription("")
    setAdminNotes("")
    setApprovalDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending Review', variant: 'secondary' as const, icon: Clock },
      under_review: { label: 'Under Review', variant: 'default' as const, icon: Eye },
      approved: { label: 'Approved', variant: 'default' as const, icon: CheckCircle },
      rejected: { label: 'Rejected', variant: 'destructive' as const, icon: XCircle },
      suspended: { label: 'Suspended', variant: 'destructive' as const, icon: AlertTriangle },
      unavailable: { label: 'Unavailable', variant: 'secondary' as const, icon: XCircle }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getStats = () => {
    const stats = {
      pending: allProducts.filter(p => p.status === 'pending').length,
      under_review: allProducts.filter(p => p.status === 'under_review').length,
      approved: allProducts.filter(p => p.status === 'approved').length,
      rejected: allProducts.filter(p => p.status === 'rejected').length,
      total: allProducts.length
    }
    return stats
  }

  const stats = getStats()

  if (loading && products.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold mb-2">Product Management</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Review and manage product listings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Pending</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Under Review</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.under_review}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Approved</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Rejected</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="overflow-x-auto">
              <TabsList className="grid w-full grid-cols-5 min-w-[500px]">
                <TabsTrigger value="all" className="text-xs sm:text-sm">
                  <span className="hidden sm:inline">All</span>
                  <span className="sm:hidden">All</span>
                  <span className="ml-1">({stats.total})</span>
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-xs sm:text-sm">
                  <span className="hidden sm:inline">Pending</span>
                  <span className="sm:hidden">Pend</span>
                  <span className="ml-1">({stats.pending})</span>
                </TabsTrigger>
                <TabsTrigger value="under_review" className="text-xs sm:text-sm">
                  <span className="hidden sm:inline">Under Review</span>
                  <span className="sm:hidden">Review</span>
                  <span className="ml-1">({stats.under_review})</span>
                </TabsTrigger>
                <TabsTrigger value="approved" className="text-xs sm:text-sm">
                  <span className="hidden sm:inline">Approved</span>
                  <span className="sm:hidden">Appr</span>
                  <span className="ml-1">({stats.approved})</span>
                </TabsTrigger>
                <TabsTrigger value="rejected" className="text-xs sm:text-sm">
                  <span className="hidden sm:inline">Rejected</span>
                  <span className="sm:hidden">Rej</span>
                  <span className="ml-1">({stats.rejected})</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-4 sm:mt-6">
              <div className="space-y-3 sm:space-y-4">
                {products.map((product) => (
                  <Card key={product.id} className="hover-lift">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        {/* Product Image */}
                        <div className="w-full sm:w-24 h-32 sm:h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0 mx-auto sm:mx-0">
                          {product.images && product.images.length > 0 ? (
                            <Image
                              src={product.images[0]}
                              alt={product.title}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <AlertTriangle className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                            <h3 className="font-semibold text-base sm:text-lg truncate">{product.title}</h3>
                            {getStatusBadge(product.status)}
                          </div>
                          
                          <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                            {product.description}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                            <div>
                              <p className="text-muted-foreground">Category</p>
                              <p className="font-medium">{product.categories?.name}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Rental Price</p>
                              <p className="font-medium">₹{product.rental_price}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Security Deposit</p>
                              <p className="font-medium">₹{product.security_deposit}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Listed On</p>
                              <p className="font-medium">
                                {new Date(product.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Owner Details */}
                          <div className="mt-3 sm:mt-4 p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                              <span className="font-medium text-xs sm:text-sm">Owner Details</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                              <div>
                                <p className="text-muted-foreground">Name</p>
                                <p className="font-medium break-words">{product.profiles?.full_name}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Email</p>
                                <p className="font-medium break-all">{product.profiles?.email}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Phone</p>
                                <p className="font-medium">{product.profiles?.phone}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs sm:text-sm">
                                  {product.profiles?.city}, {product.profiles?.state}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Admin Notes */}
                          {product.admin_notes && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-sm font-medium text-blue-800 mb-1">Admin Notes</p>
                              <p className="text-sm text-blue-700">{product.admin_notes}</p>
                            </div>
                          )}

                          {/* Rejection Reason */}
                          {product.status === 'rejected' && product.rejection_reason && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason</p>
                              <p className="text-sm text-red-700">{product.rejection_reason}</p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedProduct(product)}
                              className="text-xs sm:text-sm"
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="hidden sm:inline">View Details</span>
                              <span className="sm:hidden">View</span>
                            </Button>
                            
                            {product.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                                  onClick={() => openApprovalDialog(product)}
                                >
                                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                  <span className="hidden sm:inline">Approve</span>
                                  <span className="sm:hidden">✓</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    const reason = prompt('Rejection reason:')
                                    if (reason) {
                                      handleProductAction(product.id, 'rejected', reason)
                                    }
                                  }}
                                  className="text-xs sm:text-sm"
                                >
                                  <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                  <span className="hidden sm:inline">Reject</span>
                                  <span className="sm:hidden">✗</span>
                                </Button>
                              </>
                            )}

                            {product.status === 'approved' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleProductAction(product.id, 'suspended')}
                                className="text-xs sm:text-sm"
                              >
                                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                <span className="hidden sm:inline">Suspend</span>
                                <span className="sm:hidden">Suspend</span>
                              </Button>
                            )}

                            {product.status === 'suspended' && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                                onClick={() => handleProductAction(product.id, 'approved')}
                              >
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                <span className="hidden sm:inline">Reactivate</span>
                                <span className="sm:hidden">Reactivate</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {products.length === 0 && (
                  <div className="text-center py-12">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No products found</h3>
                    <p className="text-muted-foreground">
                      {activeTab === 'all' 
                        ? 'No products have been listed yet.' 
                        : `No products with status "${activeTab}" found.`
                      }
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{selectedProduct.title}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Images */}
              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Product Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedProduct.images.map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={image}
                          alt={`${selectedProduct.title} ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Details */}
              <div>
                <h4 className="font-semibold mb-3">Product Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Brand</p>
                    <p className="font-medium">{selectedProduct.brand || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Color</p>
                    <p className="font-medium">{selectedProduct.color || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fabric</p>
                    <p className="font-medium">{selectedProduct.fabric || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Occasion</p>
                    <p className="font-medium">{selectedProduct.occasion || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Original Price</p>
                    <p className="font-medium">₹{selectedProduct.original_price || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Availability</p>
                    <p className="font-medium">
                      {selectedProduct.is_available ? 'Available' : 'Unavailable'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Full Description */}
              <div>
                <h4 className="font-semibold mb-3">Description</h4>
                <p className="text-sm leading-relaxed">{selectedProduct.description}</p>
              </div>

              {/* Owner Information */}
              <div>
                <h4 className="font-semibold mb-3">Owner Information</h4>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Full Name</p>
                      <p className="font-medium">{selectedProduct.profiles?.full_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedProduct.profiles?.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedProduct.profiles?.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium">
                        {selectedProduct.profiles?.city}, {selectedProduct.profiles?.state}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div>
                <h4 className="font-semibold mb-3">Admin Actions</h4>
                <div className="flex gap-2">
                  {selectedProduct.status === 'pending' && (
                    <>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => openApprovalDialog(selectedProduct)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve Product
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          const reason = prompt('Rejection reason:')
                          if (reason) {
                            handleProductAction(selectedProduct.id, 'rejected', reason)
                            setSelectedProduct(null)
                          }
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject Product
                      </Button>
                    </>
                  )}
                  
                  {selectedProduct.status === 'approved' && (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleProductAction(selectedProduct.id, 'suspended')
                        setSelectedProduct(null)
                      }}
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Suspend Product
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Product Approval Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Approve Product</DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-6">
              {/* Product Info */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{selectedProduct.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">by {selectedProduct.profiles.full_name}</p>
                <p className="text-sm">Category: {selectedProduct.categories.name}</p>
              </div>

              {/* Current Description */}
              <div>
                <Label className="text-sm font-medium">Current Description (User)</Label>
                <div className="mt-2 p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm">{selectedProduct.description}</p>
                </div>
              </div>

              {/* Admin Description */}
              <div className="space-y-2">
                <Label htmlFor="admin-description" className="text-sm font-medium">
                  Admin Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="admin-description"
                  value={adminDescription}
                  onChange={(e) => setAdminDescription(e.target.value)}
                  placeholder="Write a professional description that will be shown to customers. This will replace the user's description."
                  className="min-h-32"
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  This description will be shown to all customers instead of the user's description.
                </p>
              </div>

              {/* Admin Notes */}
              <div className="space-y-2">
                <Label htmlFor="admin-notes" className="text-sm font-medium">
                  Admin Notes (Optional)
                </Label>
                <Textarea
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any internal notes about this product (not visible to customers)..."
                  className="min-h-20"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  These notes are only visible to admins and will not be shown to customers.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setApprovalDialogOpen(false)
                setAdminDescription("")
                setAdminNotes("")
              }}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApproveProduct}
              disabled={actionLoading || !adminDescription.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {actionLoading ? 'Approving...' : 'Approve Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
