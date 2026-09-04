import ExcelJS from 'exceljs'
import { Registration } from './types'

// Fungsi pembantu untuk mengunduh rekap data pendaftaran dalam format file Excel (.xlsx)
export async function exportRegistrationsToExcel(registrations: Registration[]) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Pendaftaran', {
    properties: { tabColor: { argb: 'FF4B061A' } }
  })

  // Definisi kolom tabel Excel
  worksheet.columns = [
    { header: 'No', key: 'no', width: 5 },
    { header: 'Nama Lengkap', key: 'fullName', width: 25 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Telepon', key: 'phone', width: 18 },
    { header: 'NPM', key: 'npm', width: 15 },
    { header: 'Angkatan', key: 'yearClass', width: 12 },
    { header: 'Status', key: 'academicStatus', width: 15 },
    { header: 'Asal Instansi', key: 'institution', width: 25 },
    { header: 'Fakultas', key: 'faculty', width: 25 },
    { header: 'Jurusan', key: 'major', width: 25 },
    { header: 'Instagram Handle', key: 'instagram', width: 20 },
    { header: 'Kegiatan', key: 'activity', width: 30 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Tanggal Daftar', key: 'date', width: 20 }
  ]

  // Format baris header
  const headerRow = worksheet.getRow(1)
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4B061A' }
  }
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
  headerRow.height = 25

  // Tambahkan baris data pendaftaran
  registrations.forEach((reg, index) => {
    const row = worksheet.addRow({
      no: index + 1,
      fullName: reg.fullName,
      email: reg.email,
      phone: reg.phone,
      npm: reg.npm || '-',
      yearClass: reg.yearClass || '-',
      academicStatus: reg.academicStatus || '-',
      institution: reg.institution || '-',
      faculty: reg.faculty || '-',
      major: reg.major || '-',
      instagram: reg.instagramHandle || '-',
      activity: reg.activity.title,
      status: reg.status,
      date: new Date(reg.createdAt).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    })

    // Warna baris selang-seling (zebra pattern)
    if (index % 2 === 0) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF9FAFB' }
      }
    }

    // Warna teks status
    const statusCell = row.getCell('status')
    statusCell.font = { bold: true }
    switch (reg.status) {
      case 'APPROVED':
        statusCell.font = { ...statusCell.font, color: { argb: 'FF10B981' } }
        break
      case 'PENDING':
        statusCell.font = { ...statusCell.font, color: { argb: 'FFF59E0B' } }
        break
      case 'REJECTED':
        statusCell.font = { ...statusCell.font, color: { argb: 'FFEF4444' } }
        break
      case 'ATTENDED':
        statusCell.font = { ...statusCell.font, color: { argb: 'FF3B82F6' } }
        break
      case 'ABSENT':
        statusCell.font = { ...statusCell.font, color: { argb: 'FF6B7280' } }
        break
    }

    row.getCell('no').alignment = { horizontal: 'center', vertical: 'middle' }
    row.getCell('status').alignment = { horizontal: 'center', vertical: 'middle' }
    row.height = 20
  })

  // Tambahkan garis pembatas (border) tipis ke setiap sel
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
      }
    })
  })

  // Unduh dokumen ke browser
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `Pendaftaran_${new Date().toISOString().split('T')[0]}.xlsx`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
