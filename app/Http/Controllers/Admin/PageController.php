<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PageController extends Controller
{
    public function index()
    {
        $pages = Page::orderBy('type')->orderBy('sort_order')->get();

        return inertia('admin/pages/index', [
            'pages' => $pages,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:pages,slug',
            'content' => 'nullable|string',
            'type' => 'required|in:default,about,contact,terms,privacy,faq',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $data = $request->only(['title', 'content', 'type', 'meta_title', 'meta_description', 'sort_order', 'is_active']);
        $data['slug'] = $request->slug ?: Str::slug($request->title);

        Page::create($data);

        return redirect()->route('admin.pages.index')->with('success', 'Page created successfully!');
    }

    public function update(Request $request, Page $page)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:pages,slug,' . $page->id,
            'content' => 'nullable|string',
            'type' => 'required|in:default,about,contact,terms,privacy,faq',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $data = $request->only(['title', 'content', 'type', 'meta_title', 'meta_description', 'sort_order', 'is_active']);
        $data['slug'] = $request->slug ?: Str::slug($request->title);

        $page->update($data);

        return redirect()->route('admin.pages.index')->with('success', 'Page updated successfully!');
    }

    public function destroy(Page $page)
    {
        $page->delete();

        return redirect()->route('admin.pages.index')->with('success', 'Page deleted successfully!');
    }
}