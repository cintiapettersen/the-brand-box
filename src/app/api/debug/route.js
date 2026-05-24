export async function GET() {
  return Response.json({
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    serviceKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10) : null,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasGemini: !!process.env.GEMINI_API_KEY,
    envKeys: Object.keys(process.env).filter(k => k.includes('SUPA') || k.includes('NEXT'))
  });
}
