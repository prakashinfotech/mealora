import { NextResponse } from 'next/server'
import { restaurantService } from '@server/services/restaurant.service'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const restaurant = await restaurantService.findByIdWithMenu(params.id)
    if (!restaurant) {
      return NextResponse.json({ success: false, error: 'Restaurant not found.' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: restaurant })
  } catch {
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
