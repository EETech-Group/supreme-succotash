import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { partNumber: { contains: search, mode: 'insensitive' as const } },
          { manufacturer: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(category && { category }),
    }

    const parts = await prisma.electronicPart.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(parts)
  } catch (error) {
    console.error('Error fetching parts:', error)
    return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const part = await prisma.electronicPart.create({
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

    return NextResponse.json(part, { status: 201 })
  } catch (error) {
    console.error('Error creating part:', error)
    return NextResponse.json({ error: 'Failed to create part' }, { status: 500 })
  }
}
