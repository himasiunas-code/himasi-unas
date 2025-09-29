import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database untuk 1 kegiatan saja...')

  // Hapus data lama (optional)
  await prisma.registration.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.admin.deleteMany()

  console.log('🧹 Data lama dibersihkan')

  // Buat 1 kegiatan utama
  const activity = await prisma.activity.create({
    data: {
      title: "Workshop Web Development HIMASI 2025",
      slug: "workshop-web-development-himasi-2025",
      description: "Workshop web development menggunakan Next.js dan database PostgreSQL untuk mahasiswa HIMASI",
      content: `
        <h2>Workshop Web Development HIMASI 2025</h2>
        <p>Workshop ini akan mengajarkan mahasiswa cara membangun aplikasi web modern.</p>
        
        <h3>Materi:</h3>
        <ul>
          <li>Pengenalan Next.js dan React</li>
          <li>Database dengan PostgreSQL dan Prisma</li>
          <li>API Development</li>
          <li>Deployment ke Vercel</li>
        </ul>
        
        <h3>Persyaratan:</h3>
        <ul>
          <li>Mahasiswa aktif Fakultas Teknologi</li>
          <li>Basic knowledge HTML, CSS, JavaScript</li>
          <li>Laptop dengan Node.js terinstall</li>
        </ul>
      `,
      image: "/image/Home/Banner 1.png",
      category: "Workshop",
      startDate: new Date('2025-10-15T09:00:00'),
      endDate: new Date('2025-10-15T17:00:00'),
      location: "Lab FTKI UNAS",
      maxParticipants: 50,
      registrationOpen: false,
      registrationStartDate: new Date('2025-10-01T00:00:00'), // 1 Oktober 2025
      registrationDeadline: new Date('2025-10-10T23:59:59'),
      requiresApproval: false,
      isPublished: true
    }
  })

  console.log(`✅ Created activity: ${activity.title}`)

  // Buat admin
  const admin = await prisma.admin.create({
    data: {
      email: "admin@himasi.unas.ac.id",
      name: "Admin HIMASI",
      role: "ADMIN"
    }
  })

  console.log(`✅ Created admin: ${admin.name}`)

  // Buat sample registrations untuk testing
  const sampleRegistrations = [
    {
      activityId: activity.id,
      email: "john.doe@student.unas.ac.id",
      fullName: "John Doe",
      phone: "08123456789",
      yearClass: "2020",
      faculty: "FTKI",
      major: "Sistem Informasi",
      instagramHandle: "@johndoe",
      motivation: "Ingin belajar web development untuk tugas akhir"
    },
    {
      activityId: activity.id,
      email: "jane.smith@student.unas.ac.id", 
      fullName: "Jane Smith",
      phone: "08123456790",
      yearClass: "2021",
      faculty: "FTKI", 
      major: "Teknik Informatika",
      instagramHandle: "@janesmith",
      motivation: "Ingin mengembangkan skill programming"
    }
  ]

  for (const regData of sampleRegistrations) {
    const registration = await prisma.registration.create({
      data: regData
    })
    console.log(`✅ Created registration: ${registration.fullName}`)
  }

  console.log('🎉 Seeding completed!')
  console.log('\n📊 Summary:')
  console.log(`- 1 Activity: ${activity.title}`)
  console.log(`- 1 Admin: ${admin.name}`)
  console.log(`- ${sampleRegistrations.length} Sample Registrations`)
  console.log('\n🌐 Next Steps:')
  console.log('1. Start server: npm run dev')
  console.log('2. Open: http://localhost:3000/kegiatan')
  console.log('3. Test registration: http://localhost:3000/pendaftaran')
  console.log('4. View data: http://localhost:5556 (Prisma Studio)')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })