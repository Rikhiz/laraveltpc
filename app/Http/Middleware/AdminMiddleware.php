<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check() || !Auth::user()->role == 'admin') {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Access denied'], 403);
            }

            return redirect()->route('login')->with('error', 'Access denied. Admin only.');
        }

        return $next($request);
    }
}
