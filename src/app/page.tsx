'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'

interface ElectronicPart {
  id: number
  partNumber: string
  name: string
  description?: string
  manufacturer?: string
  category?: string
  quantity: number
  unitPrice: number
  location?: string
  datasheetUrl?: string
  specifications?: any
  createdAt: string
  updatedAt: string
}

export default function Home() {
  const [parts, setParts] = useState<ElectronicPart[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPart, setEditingPart] = useState<ElectronicPart | null>(null)
  const [formData, setFormData] = useState({
    partNumber: '',
    name: '',
    description: '',
    manufacturer: '',
    category: '',
    quantity: 0,
    unitPrice: 0,
    location: '',
    datasheetUrl: '',
    specifications: {}
  })

  const categories = [
    'Resistor', 'Capacitor', 'IC', 'Transistor', 'Diode', 'Connector',
    'Switch', 'Relay', 'Transformer', 'Crystal', 'Oscillator', 'Other'
  ]

  useEffect(() => {
    fetchParts()
  }, [searchTerm, categoryFilter])

  const fetchParts = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (categoryFilter) params.append('category', categoryFilter)
      
      const response = await fetch(`/api/parts?${params}`)
      const data = await response.json()
      setParts(data)
    } catch (error) {
      console.error('Error fetching parts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingPart ? `/api/parts/${editingPart.id}` : '/api/parts'
      const method = editingPart ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchParts()
        setIsDialogOpen(false)
        setEditingPart(null)
        setFormData({
          partNumber: '',
          name: '',
          description: '',
          manufacturer: '',
          category: '',
          quantity: 0,
          unitPrice: 0,
          location: '',
          datasheetUrl: '',
          specifications: {}
        })
      }
    } catch (error) {
      console.error('Error saving part:', error)
    }
  }

  const handleEdit = (part: ElectronicPart) => {
    setEditingPart(part)
    setFormData({
      partNumber: part.partNumber,
      name: part.name,
      description: part.description || '',
      manufacturer: part.manufacturer || '',
      category: part.category || '',
      quantity: part.quantity,
      unitPrice: part.unitPrice,
      location: part.location || '',
      datasheetUrl: part.datasheetUrl || '',
      specifications: part.specifications || {}
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this part?')) {
      try {
        await fetch(`/api/parts/${id}`, { method: 'DELETE' })
        fetchParts()
      } catch (error) {
        console.error('Error deleting part:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      partNumber: '',
      name: '',
      description: '',
      manufacturer: '',
      category: '',
      quantity: 0,
      unitPrice: 0,
      location: '',
      datasheetUrl: '',
      specifications: {}
    })
    setEditingPart(null)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Electronic Parts Database</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Part
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPart ? 'Edit Part' : 'Add New Part'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="partNumber">Part Number *</Label>
                  <Input
                    id="partNumber"
                    value={formData.partNumber}
                    onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="unitPrice">Unit Price</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="datasheetUrl">Datasheet URL</Label>
                <Input
                  id="datasheetUrl"
                  type="url"
                  value={formData.datasheetUrl}
                  onChange={(e) => setFormData({ ...formData, datasheetUrl: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPart ? 'Update' : 'Create'} Part
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search parts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter || "all"} onValueChange={(value) => setCategoryFilter(value === "all" ? "" : value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Part Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parts.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell className="font-mono">{part.partNumber}</TableCell>
                    <TableCell>{part.name}</TableCell>
                    <TableCell>{part.manufacturer || '-'}</TableCell>
                    <TableCell>{part.category || '-'}</TableCell>
                    <TableCell>{part.quantity}</TableCell>
                    <TableCell>${Number(part.unitPrice).toFixed(2)}</TableCell>
                    <TableCell>{part.location || '-'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(part)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructiveOutline"
                          onClick={() => handleDelete(part.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {parts.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No parts found. Add your first part to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
