import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Seed sample activities
  console.log('📅 Seeding sample activities...')
  
  const activities = [
    {
      title: "Workshop Web Development with Next.js",
      slug: "workshop-nextjs-2024",
      description: "Belajar membuat aplikasi web modern menggunakan Next.js dari dasar hingga deployment",
      content: `
        <h2>Workshop Web Development dengan Next.js</h2>
        <p>Workshop ini akan mengajarkan Anda cara membangun aplikasi web modern menggunakan Next.js, framework React yang powerful.</p>
        
        <h3>Materi yang akan dipelajari:</h3>
        <ul>
          <li>Pengenalan Next.js dan setup project</li>
          <li>Routing dan Navigation</li>
          <li>Components dan Styling dengan Tailwind CSS</li>
          <li>API Routes dan Server Components</li>
          <li>Database integration dengan Prisma</li>
          <li>Deployment ke Vercel</li>
        </ul>
        
        <h3>Persyaratan:</h3>
        <ul>
          <li>Basic knowledge HTML, CSS, JavaScript</li>
          <li>Laptop dengan Node.js terinstall</li>
          <li>Text editor (VS Code recommended)</li>
        </ul>
      `,
      image: "/image/Home/BannerV1.png",
      category: "Workshop",
      startDate: new Date('2024-10-15T09:00:00'),
      endDate: new Date('2024-10-15T17:00:00'),
      location: "Lab FTKI UNAS",
      maxParticipants: 30,
      registrationOpen: true,
      registrationDeadline: new Date('2024-10-10T23:59:59'),
      requiresApproval: false,
      isPublished: true
    },
    {
      title: "Seminar Teknologi AI dan Machine Learning",
      slug: "seminar-ai-ml-2024",
      description: "Memahami perkembangan terbaru AI dan Machine Learning serta aplikasinya di industri",
      content: `
        <h2>Seminar AI & Machine Learning</h2>
        <p>Seminar ini akan membahas perkembangan terbaru dalam bidang Artificial Intelligence dan Machine Learning.</p>
        
        <h3>Topik Pembahasan:</h3>
        <ul>
          <li>Introduction to AI & ML</li>
          <li>Current Trends in AI Industry</li>
          <li>Career Opportunities in AI/ML</li>
          <li>Hands-on Demo: Building Simple ML Model</li>
        </ul>
        
        <h3>Speaker:</h3>
        <ul>
          <li>Dr. Ahmad Santoso - Senior AI Engineer at Gojek</li>
          <li>Sarah Wijaya - ML Research Scientist</li>
        </ul>
      `,
      image: "/image/Home/BannerV1.png",
      category: "Seminar",
      startDate: new Date('2024-11-05T13:00:00'),
      endDate: new Date('2024-11-05T16:00:00'),
      location: "Auditorium UNAS",
      maxParticipants: 100,
      registrationOpen: true,
      registrationDeadline: new Date('2024-11-01T23:59:59'),
      requiresApproval: true,
      isPublished: true
    },
    {
      title: "Kompetisi Programming HIMASI Cup 2024",
      slug: "himasi-cup-programming-2024",
      description: "Kompetisi programming tahunan HIMASI untuk mahasiswa se-Indonesia",
      content: `
        <h2>HIMASI Cup Programming Competition 2024</h2>
        <p>Kompetisi programming bergengsi tingkat nasional yang diselenggarakan oleh HIMASI UNAS.</p>
        
        <h3>Kategori Lomba:</h3>
        <ul>
          <li>Competitive Programming (Individual)</li>
          <li>Web Development (Team of 3)</li>
          <li>Mobile App Development (Team of 3)</li>
        </ul>
        
        <h3>Hadiah:</h3>
        <ul>
          <li>Juara 1: Rp 5.000.000 + Trophy + Certificate</li>
          <li>Juara 2: Rp 3.000.000 + Trophy + Certificate</li>
          <li>Juara 3: Rp 2.000.000 + Trophy + Certificate</li>
        </ul>
        
        <h3>Timeline:</h3>
        <ul>
          <li>Pendaftaran: 1-30 November 2024</li>
          <li>Babak Penyisihan: 5 Desember 2024</li>
          <li>Final: 15 Desember 2024</li>
        </ul>
      `,
      image: "/image/Home/BannerV1.png",
      category: "Competition",
      startDate: new Date('2024-12-15T08:00:00'),
      endDate: new Date('2024-12-15T18:00:00'),
      location: "FTKI UNAS",
      maxParticipants: 150,
      registrationOpen: false, // Belum dibuka
      registrationDeadline: new Date('2024-11-30T23:59:59'),
      requiresApproval: true,
      isPublished: true
    }
  ]

  for (const activityData of activities) {
    const activity = await prisma.activity.create({
      data: activityData
    })
    console.log(`✅ Created activity: ${activity.title}`)
  }

  // Seed sample admin
  console.log('👤 Seeding sample admin...')
  const admin = await prisma.admin.create({
    data: {
      email: "admin@himasi.unas.ac.id",
      name: "Admin HIMASI",
      role: "ADMIN"
    }
  })
  console.log(`✅ Created admin: ${admin.name}`)

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })