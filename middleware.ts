import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Proteksi mutlak rute /pendaftaran/selesai dari akses langsung URL bar
  if (
    pathname === '/pendaftaran/selesai' ||
    pathname === '/pendaftaran/selesai/' ||
    pathname.startsWith('/pendaftaran/selesai/')
  ) {
    const token = request.cookies.get('reg_success_token')?.value

    // Jika tidak memiliki cookie token pendaftaran yang sah, alihkan langsung ke /pendaftaran
    if (!token) {
      const redirectUrl = new URL('/pendaftaran', request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/pendaftaran/selesai', '/pendaftaran/selesai/:path*'],
}
