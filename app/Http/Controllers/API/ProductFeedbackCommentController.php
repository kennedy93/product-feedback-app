<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductFeedbackCommentResource;
use App\Models\ProductFeedbackComment;
use App\Models\ProductFeedback;
use App\Models\CommentMention;
use App\Models\User;
use App\Utilities\Sanitizer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class ProductFeedbackCommentController extends Controller
{
    /**
     * Display a listing of comments for a product feedback.
     */
    public function index(Request $request, ProductFeedback $productFeedback): JsonResponse
    {
        // Recursively eager-load all nested replies
        $with = $this->getRepliesWith('replies', 10); // 10 levels deep
        $comments = $productFeedback->rootComments()
            ->with(array_merge(['user:id,name,email'], $with))
            ->latest()
            ->get();

        return ProductFeedbackCommentResource::collection($comments)->response();
    }

    /**
     * Helper to build nested with() array for replies recursion.
     */
    private function getRepliesWith($relation, $depth)
    {
        if ($depth === 0) return [];
        return [
            $relation . '.user:id,name,email',
            ...$this->getRepliesWith($relation . '.replies', $depth - 1)
        ];
    }

    /**
     * Store a newly created comment.
     */
    public function store(Request $request, ProductFeedback $productFeedback): JsonResponse
    {
        try {
            $validated = $request->validate([
                'comment' => 'required|string',
                'parent_id' => 'nullable|exists:product_feedback_comments,id',
            ]);

            $cleanComment = Sanitizer::sanitizeHtml($validated['comment']);

            // Extract mentioned users from comment
            $mentionedUsers = $this->extractMentions(strip_tags($validated['comment']));

            $comment = ProductFeedbackComment::create([
                'product_feedback_id' => $productFeedback->id,
                'user_id' => $request->user()->id,
                'comment' => $cleanComment,
                'parent_id' => $validated['parent_id'] ?? null,
                'mentioned_users' => $mentionedUsers,
            ]);

            // Create mention records
            $this->createMentionRecords($comment, $mentionedUsers, $request->user()->id);

            $comment->load(['user:id,name,email', 'replies.user:id,name,email']);

            return response()->json([
                'message' => 'Comment created successfully',
                'data' => $comment
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Display the specified comment.
     */
    public function show(ProductFeedback $productFeedback, ProductFeedbackComment $comment): JsonResponse
    {
        // Ensure comment belongs to the feedback
        if ($comment->product_feedback_id !== $productFeedback->id) {
            return response()->json([
                'message' => 'Comment not found for this feedback'
            ], 404);
        }

        $comment->load([
            'user:id,name,email',
            'replies.user:id,name,email',
            'parent.user:id,name,email'
        ]);

        return response()->json($comment);
    }

    /**
     * Extract mentioned usernames from comment text.
     */
    private function extractMentions(string $comment): array
    {
        preg_match_all('/\[([^\[\]]+)\]/u', $comment, $matches);

        if (empty($matches[1])) {
            return [];
        }

        $mentionedUserIds = [];
        foreach ($matches[1] as $mention) {
            $mention = trim($mention);
            $user = User::whereRaw('LOWER(name) = ?', [strtolower($mention)])->first();
            if ($user) {
                $mentionedUserIds[] = $user->id;
            }
        }

        return $mentionedUserIds;
    }

    /**
     * Create mention records for mentioned users.
     */
    private function createMentionRecords(ProductFeedbackComment $comment, array $mentionedUserIds, int $mentionedByUserId): void
    {
        foreach ($mentionedUserIds as $userId) {
            CommentMention::create([
                'comment_id' => $comment->id,
                'mentioned_user_id' => $userId,
                'mentioned_by_user_id' => $mentionedByUserId,
            ]);
        }
    }
}
