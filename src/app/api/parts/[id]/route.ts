import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const part = await prisma.electronicPart.findUnique({
      where: { id: parseInt(params.id) },
    })

    if (!part) {
      return NextResponse.json({ error: 'Part not found' }, { status: 404 })
    }

    return NextResponse.json(part)
  } catch (error) {
    console.error('Error fetching part:', error)
    return NextResponse.json({ error: 'Failed to fetch part' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const part = await prisma.electronicPart.update({
      where: { id: parseInt(params.id) },
      data: {
        partNumber: body.partNumber,
        name: body.name,
        description: body.description,
        manufacturer: body.manufacturer,
        category: body.category,
        quantity: parseInt(body.quantity) || 0,
        unitPrice: parseFloat(body.unitPrice) || 0,
        location: body.location,
        datasheetUrl: body.datasheetUrl,
        specifications: body.specifications || {},
      },
    })

    return NextResponse.json(part)
  } catch (error) {
    console.error('Error updating part:', error)
    return NextResponse.json({ error: 'Failed to update part' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.electronicPart.delete({
      where: { id: parseInt(params.id) },
    })

    return NextResponse.json({ message: 'Part deleted successfully' })
  } catch (error) {
    console.error('Error deleting part:', error)
    return NextResponse.json({ error: 'Failed to delete part' }, { status: 500 })
  }
}
