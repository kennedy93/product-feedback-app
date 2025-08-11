<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductFeedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ProductFeedbackController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse {
        $feedbacks = ProductFeedback::with(['user:id,name,email', 'comments.user:id,name,email'])
            ->latest()
            ->paginate(15);

        return response()->json($feedbacks);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse {
        try {
            $validated = $request->validate([
                'title'       => 'required|string|max:255',
                'description' => 'required|string',
                'category'    => 'required|string|max:100',
            ]);

            $feedback = ProductFeedback::create([
                 ...$validated,
                'user_id' => $request->user()->id,
            ]);

            $feedback->load(['user:id,name,email']);

            return response()->json([
                'message' => 'Product feedback created successfully',
                'data'    => $feedback,
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductFeedback $productFeedback): JsonResponse {
        $productFeedback->load([
            'user:id,name,email',
            'rootComments.user:id,name,email',
            'rootComments.replies.user:id,name,email',
        ]);

        return response()->json($productFeedback);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductFeedback $productFeedback): JsonResponse {
        // Check if user owns this feedback
        if ($productFeedback->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        try {
            $validated = $request->validate([
                'title'       => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'category'    => 'sometimes|required|string|max:100',
            ]);

            $productFeedback->update($validated);
            $productFeedback->load(['user:id,name,email']);

            return response()->json([
                'message' => 'Product feedback updated successfully',
                'data'    => $productFeedback,
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, ProductFeedback $productFeedback): JsonResponse {
        // Check if user owns this feedback
        if ($productFeedback->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $productFeedback->delete();

        return response()->json([
            'message' => 'Product feedback deleted successfully',
        ]);
    }
}
