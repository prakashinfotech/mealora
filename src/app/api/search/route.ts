import { NextResponse } from 'next/server'
import { restaurantService } from '@server/services/restaurant.service'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() ?? ''
  const data = await restaurantService.search(q)
  return NextResponse.json({ success: true, data })
}
