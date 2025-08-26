import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        response = NextResponse.next({ request: { headers: request.headers } });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, {
            ...options,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
          });
        }
      },
    },
  });

  try {
    const { data: { user } } = await supabase.auth.getUser();

    const authPaths = ['/login', '/auth/callback', '/auth/setup'];
    const isAuthPath = authPaths.some((path) => request.nextUrl.pathname.startsWith(path));

    if (!user && !isAuthPath) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (user && request.nextUrl.pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } catch (_error) {
    const authPaths = ['/login', '/auth/callback', '/auth/setup'];
    const isAuthPath = authPaths.some((path) => request.nextUrl.pathname.startsWith(path));
    if (!isAuthPath) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return response;
}


