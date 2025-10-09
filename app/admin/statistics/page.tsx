'use client'

import { useEffect, useState } from 'react'
import {
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  UserCheck,
  UserX,
  Clock,
  Target,
  CreditCard,
  Smartphone,
  BarChart3,
  PieChart,
  RefreshCw,
  Download
} from 'lucide-react'

interface Statistics {
  totalRegistrations: number
  totalRevenue: number
  pendingRegistrations: number
  approvedRegistrations: number
  rejectedRegistrations: number
  attendedRegistrations: number
  absentRegistrations: number
  paymentMethodStats: {
    bca: number
    dana: number
    unpaid: number
  }
  revenueByMonth: Array<{
    month: string
    revenue: number
    registrations: number
  }>
  facultyStats: Array<{
    faculty: string
    count: number
  }>
  yearClassStats: Array<{
    yearClass: string
    count: number
  }>
  recentActivity: Array<{
    id: string
    type: 'registration' | 'approval' | 'payment'
    message: string
    timestamp: string
  }>
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/admin/statistics')
      if (response.ok) {
        const data = await response.json()
        setStats(data.statistics)
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'rejected':
        return 'text-red-600 bg-red-100'
      case 'attended':
        return 'text-blue-600 bg-blue-100'
      case 'absent':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const exportStatistics = () => {
    if (!stats) return

    const reportData = {
      'Total Pendaftar': stats.totalRegistrations,
      'Total Pendapatan': formatCurrency(stats.totalRevenue),
      'Status Pending': stats.pendingRegistrations,
      'Status Approved': stats.approvedRegistrations,
      'Status Rejected': stats.rejectedRegistrations,
      'Hadir': stats.attendedRegistrations,
      'Tidak Hadir': stats.absentRegistrations,
      'Pembayaran BCA': stats.paymentMethodStats.bca,
      'Pembayaran DANA': stats.paymentMethodStats.dana,
      'Belum Bayar': stats.paymentMethodStats.unpaid,
      'Tanggal Generate': new Date().toLocaleDateString('id-ID')
    }

    const csvContent = Object.entries(reportData)
      .map(([key, value]) => `${key},${value}`)
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `statistics_report_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B061A]"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Gagal memuat statistik</h3>
        <p className="mt-1 text-sm text-gray-500">Silakan refresh halaman</p>
      </div>
    )
  }

  const conversionRate = stats.totalRegistrations > 0 ? (stats.approvedRegistrations / stats.totalRegistrations * 100) : 0
  const attendanceRate = stats.approvedRegistrations > 0 ? (stats.attendedRegistrations / stats.approvedRegistrations * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Statistik & Analytics</h1>
            <p className="mt-2 text-gray-600">Dashboard analytics dan laporan keuangan HIMASI</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={fetchStatistics}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={exportStatistics}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#4B061A] to-[#6B0B2A] hover:from-[#3A0514] hover:to-[#5A0B24] transition-all duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-green-600">Total Pendapatan</p>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-xs text-green-600 mt-1">
                {stats.totalRegistrations} pendaftar × Rp 30.000
              </p>
            </div>
          </div>
        </div>

        {/* Total Registrations */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-blue-600">Total Pendaftar</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalRegistrations}</p>
              <p className="text-xs text-blue-600 mt-1">
                Sejak awal kegiatan
              </p>
            </div>
          </div>
        </div>

        {/* Approval Rate */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200 shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-purple-600">Tingkat Persetujuan</p>
              <p className="text-2xl font-bold text-purple-900">{conversionRate.toFixed(1)}%</p>
              <p className="text-xs text-purple-600 mt-1">
                {stats.approvedRegistrations} dari {stats.totalRegistrations} pendaftar
              </p>
            </div>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200 shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-orange-600">Tingkat Kehadiran</p>
              <p className="text-2xl font-bold text-orange-900">{attendanceRate.toFixed(1)}%</p>
              <p className="text-xs text-orange-600 mt-1">
                {stats.attendedRegistrations} dari {stats.approvedRegistrations} yang disetujui
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-[#4B061A]" />
            Status Pendaftaran
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-yellow-600 mr-3" />
                <span className="font-medium text-yellow-900">Menunggu Review</span>
              </div>
              <span className="text-xl font-bold text-yellow-900">{stats.pendingRegistrations}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center">
                <UserCheck className="w-5 h-5 text-green-600 mr-3" />
                <span className="font-medium text-green-900">Disetujui</span>
              </div>
              <span className="text-xl font-bold text-green-900">{stats.approvedRegistrations}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center">
                <UserX className="w-5 h-5 text-red-600 mr-3" />
                <span className="font-medium text-red-900">Ditolak</span>
              </div>
              <span className="text-xl font-bold text-red-900">{stats.rejectedRegistrations}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <UserCheck className="w-5 h-5 text-blue-600 mr-3" />
                <span className="font-medium text-blue-900">Hadir</span>
              </div>
              <span className="text-xl font-bold text-blue-900">{stats.attendedRegistrations}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <UserX className="w-5 h-5 text-gray-600 mr-3" />
                <span className="font-medium text-gray-900">Tidak Hadir</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{stats.absentRegistrations}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-[#4B061A]" />
            Metode Pembayaran
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <span className="font-medium text-blue-900">Transfer BCA</span>
                  <p className="text-xs text-blue-600">{formatCurrency(stats.paymentMethodStats.bca * 30000)}</p>
                </div>
              </div>
              <span className="text-xl font-bold text-blue-900">{stats.paymentMethodStats.bca}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center">
                <Smartphone className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <span className="font-medium text-green-900">DANA E-wallet</span>
                  <p className="text-xs text-green-600">{formatCurrency(stats.paymentMethodStats.dana * 30000)}</p>
                </div>
              </div>
              <span className="text-xl font-bold text-green-900">{stats.paymentMethodStats.dana}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-red-600 mr-3" />
                <div>
                  <span className="font-medium text-red-900">Belum Bayar</span>
                  <p className="text-xs text-red-600">Potensi: {formatCurrency(stats.paymentMethodStats.unpaid * 30000)}</p>
                </div>
              </div>
              <span className="text-xl font-bold text-red-900">{stats.paymentMethodStats.unpaid}</span>
            </div>
          </div>

          {/* Payment Method Chart */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>BCA</span>
                <span>{((stats.paymentMethodStats.bca / stats.totalRegistrations) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(stats.paymentMethodStats.bca / stats.totalRegistrations) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>DANA</span>
                <span>{((stats.paymentMethodStats.dana / stats.totalRegistrations) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(stats.paymentMethodStats.dana / stats.totalRegistrations) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Faculty and Year Class Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty Distribution */}
        {stats.facultyStats.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-[#4B061A]" />
              Distribusi Fakultas
            </h3>
            <div className="space-y-3">
              {stats.facultyStats.map((faculty, index) => (
                <div key={faculty.faculty} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{faculty.faculty}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#4B061A] h-2 rounded-full" 
                        style={{ width: `${(faculty.count / stats.totalRegistrations) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 min-w-8">{faculty.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Year Class Distribution */}
        {stats.yearClassStats.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-[#4B061A]" />
              Distribusi Angkatan
            </h3>
            <div className="space-y-3">
              {stats.yearClassStats.map((yearClass, index) => (
                <div key={yearClass.yearClass} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Angkatan {yearClass.yearClass}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${(yearClass.count / stats.totalRegistrations) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 min-w-8">{yearClass.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Key Performance Indicators */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-[#4B061A]" />
          Key Performance Indicators (KPI)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-2xl font-bold text-blue-900">{stats.totalRegistrations}</p>
            <p className="text-xs text-blue-600 mt-1">Total Pendaftar</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-2xl font-bold text-green-900">{conversionRate.toFixed(1)}%</p>
            <p className="text-xs text-green-600 mt-1">Approval Rate</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-2xl font-bold text-purple-900">{attendanceRate.toFixed(1)}%</p>
            <p className="text-xs text-purple-600 mt-1">Attendance Rate</p>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-2xl font-bold text-yellow-900">{stats.pendingRegistrations}</p>
            <p className="text-xs text-yellow-600 mt-1">Pending Review</p>
          </div>
          
          <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="text-2xl font-bold text-indigo-900">
              {(((stats.paymentMethodStats.bca + stats.paymentMethodStats.dana) / stats.totalRegistrations) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-indigo-600 mt-1">Payment Rate</p>
          </div>
          
          <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-2xl font-bold text-emerald-900">Rp{Math.round(stats.totalRevenue / 1000)}K</p>
            <p className="text-xs text-emerald-600 mt-1">Revenue (K)</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-br from-[#4B061A] to-[#6B0B2A] rounded-xl shadow-sm p-6 text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Ringkasan Executive
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="opacity-90">Total pendaftar:</p>
            <p className="text-xl font-bold">{stats.totalRegistrations} orang</p>
          </div>
          <div>
            <p className="opacity-90">Pendapatan terkonfirmasi:</p>
            <p className="text-xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
          </div>
          <div>
            <p className="opacity-90">Tingkat konversi:</p>
            <p className="text-xl font-bold">{conversionRate.toFixed(1)}%</p>
          </div>
          <div>
            <p className="opacity-90">Metode pembayaran terpopuler:</p>
            <p className="text-xl font-bold">
              {stats.paymentMethodStats.bca > stats.paymentMethodStats.dana ? 'BCA' : 'DANA'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}