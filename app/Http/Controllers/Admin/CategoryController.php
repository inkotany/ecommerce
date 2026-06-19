<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with(['parent', 'children'])
            ->root()
            ->orderBy('sort_order')
            ->get();

        return inertia('admin/categories/index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $data = $request->only(['name', 'parent_id', 'description', 'icon', 'sort_order', 'is_active']);
        $data['slug'] = Str::slug($request->name);

        Category::create($data);
        Cache::forget('categories_tree');

        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully!');
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $data = $request->only(['name', 'parent_id', 'description', 'icon', 'sort_order', 'is_active']);
        $data['slug'] = Str::slug($request->name);

        $category->update($data);
        Cache::forget('categories_tree');

        return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully!');
    }

    public function destroy(Category $category)
    {
        if ($category->products()->exists()) {
            return back()->with('error', 'Cannot delete category with products!');
        }

        $category->delete();
        Cache::forget('categories_tree');

        return redirect()->route('admin.categories.index')->with('success', 'Category deleted successfully!');
    }
}