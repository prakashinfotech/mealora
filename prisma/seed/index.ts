import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { seedRestaurants } from './helpers'
import { bangaloreRestaurants } from './bangalore'
import { mumbaiRestaurants } from './mumbai'
import { delhiRestaurants } from './delhi'
import { hyderabadRestaurants } from './hyderabad'
import { chennaiRestaurants } from './chennai'
import { puneRestaurants } from './pune'
import { ahmedabadRestaurants } from './ahmedabad'

const prisma = new PrismaClient()

export async function main() {
  console.log('🌱 Seeding database...\n')

  // ─── Demo User ───────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('password123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'demo@swiggy.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@swiggy.com',
      password: hashedPassword,
      phone: '+91 98765 43210',
    },
  })
  console.log(`✅ User: ${user.email}\n`)

  // ─── Restaurants by city ─────────────────────────────────────────────────────
  const allCities = [
    { label: 'Bangalore', data: bangaloreRestaurants },
    { label: 'Mumbai',    data: mumbaiRestaurants },
    { label: 'Delhi',     data: delhiRestaurants },
    { label: 'Hyderabad', data: hyderabadRestaurants },
    { label: 'Chennai',   data: chennaiRestaurants },
    { label: 'Pune',      data: puneRestaurants },
    { label: 'Ahmedabad', data: ahmedabadRestaurants },
  ]

  let totalRestaurants = 0
  let totalMenuItems = 0

  for (const { label, data } of allCities) {
    console.log(`📍 ${label} (${data.length} restaurants)`)
    const count = await seedRestaurants(prisma, data)
    totalRestaurants += data.length
    totalMenuItems += count
    console.log()
  }

  console.log('─'.repeat(50))
  console.log(`✨ Seeding complete!`)
  console.log(`   ${totalRestaurants} restaurants across ${allCities.length} cities`)
  console.log(`   ${totalMenuItems} menu items total`)
  console.log(`   Demo login: demo@swiggy.com / password123`)
}
