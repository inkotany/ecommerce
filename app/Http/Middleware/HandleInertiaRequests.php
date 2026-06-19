<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'website_name' => config('ecommerce.website_name'),
            'website_tagline' => config('ecommerce.website_tagline'),
            'website' => [
                'name' => config('ecommerce.website_name'),
                'tagline' => config('ecommerce.website_tagline'),
            ],
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}