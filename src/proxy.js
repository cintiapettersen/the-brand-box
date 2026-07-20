import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextResponse } from 'next/server'

let locales = ['pt', 'pt-BR', 'en']
let defaultLocale = 'pt'

function getLocale(request) {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }

  const headers = { 'accept-language': request.headers.get('accept-language') || '' }
  let languages = new Negotiator({ headers }).languages()
  return match(languages, locales, defaultLocale)
}

export function proxy(request) {
  const { pathname } = request.nextUrl
  
  // Exclude api, _next/static, _next/image, favicon.ico, etc.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|.*\\.).*)',
  ],
}
