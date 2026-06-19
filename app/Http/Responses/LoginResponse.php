<?php

namespace App\Http\Responses;

use App\Enums\UserRole;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Fortify;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $user = $request->user();

        // Redirect based on user role
        if ($user->role === UserRole::ADMIN) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->role === UserRole::SELLER) {
            return redirect()->route('seller.dashboard');
        }

        // Default for customers
        return redirect()->intended(Fortify::redirects('login', '/'));
    }
}
