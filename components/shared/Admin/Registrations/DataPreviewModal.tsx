'use client'

import { createPortal } from 'react-dom'
import { X, Download } from 'lucide-react'
import { Registration } from './types'

interface DataPreviewModalProps {
  isOpen: boolean
  registrations: Registration[]
  onClose: () => void
  onExportExcel: () => void
}

// Modal popup tabel preview seluruh data pendaftar sebelum diunduh
export default function DataPreviewModal({
  isOpen,
  registrations,
  onClose,
  onExportExcel,
}: DataPreviewModalProps) {
  if (!isOpen || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-[95vw] max-h-[95vh] flex flex-col shadow-2xl">
        {/* Header modal */}
        <div className="flex items-center justify-between p-4 border-b bg-[#4B061A] text-white rounded-t-lg">
          <h2 className="text-xl font-bold">Preview Data Pendaftaran</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Kontainer tabel data dengan scroll horizontal dan vertikal */}
        <div className="flex-1 overflow-auto p-4">
          <div className="min-w-max">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-[#4B061A] text-white z-10">
                <tr>
                  <th className="border border-gray-300 px-3 py-3 text-center font-bold text-sm">No</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm">Nama Lengkap</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm">Email</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm">Telepon</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm">NPM</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm">Angkatan</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm">Status</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm">Instansi</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm">Fakultas</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm">Jurusan</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm">Kegiatan</th>
                  <th className="border border-gray-300 px-3 py-3 text-center font-bold text-sm">Status</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm">Tanggal Daftar</th>
                </tr>
              </thead>
              <tbody className="text-black">
                {registrations.map((reg, index) => (
                  <tr key={reg.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="border border-gray-300 px-3 py-2 text-center text-sm">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{reg.fullName}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{reg.email}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{reg.phone}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{reg.npm || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-[#4B061A]">{reg.yearClass || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{reg.academicStatus || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{reg.institution || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{reg.faculty || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{reg.major || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{reg.instagramHandle || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{reg.activity.title}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          reg.status === 'APPROVED'
                            ? 'bg-green-100 text-green-700'
                            : reg.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : reg.status === 'REJECTED'
                            ? 'bg-red-100 text-red-700'
                            : reg.status === 'ATTENDED'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm whitespace-nowrap">
                      {new Date(reg.createdAt).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer modal dengan informasi total dan tombol unduh */}
        <div className="border-t p-4 bg-gray-50 rounded-b-lg flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Total: <strong>{registrations.length}</strong> pendaftaran
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                onClose()
                onExportExcel()
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#4B061A] hover:bg-[#3A0514] transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Excel
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
