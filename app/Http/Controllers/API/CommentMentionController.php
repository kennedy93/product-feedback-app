<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CommentMention;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CommentMentionController extends Controller
{
    /**
     * Display a listing of mentions for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $mentions = CommentMention::where('mentioned_user_id', $request->user()->id)
            ->with([
                'comment.productFeedback:id,title',
                'comment.user:id,name,email',
                'mentionedByUser:id,name,email'
            ])
            ->latest()
            ->paginate(15);

        return response()->json($mentions);
    }

    /**
     * Display unread mentions for the authenticated user.
     */
    public function unread(Request $request): JsonResponse
    {
        $mentions = CommentMention::where('mentioned_user_id', $request->user()->id)
            ->where('is_read', false)
            ->with([
                'comment.productFeedback:id,title',
                'comment.user:id,name,email',
                'mentionedByUser:id,name,email'
            ])
            ->latest()
            ->paginate(15);

        return response()->json($mentions);
    }

    /**
     * Mark a mention as read.
     */
    public function markAsRead(Request $request, CommentMention $mention): JsonResponse
    {
        // Check if the mention belongs to the authenticated user
        if ($mention->mentioned_user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $mention->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return response()->json([
            'message' => 'Mention marked as read',
            'data' => $mention
        ]);
    }

    /**
     * Mark all mentions as read for the authenticated user.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $updated = CommentMention::where('mentioned_user_id', $request->user()->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json([
            'message' => "Marked {$updated} mentions as read"
        ]);
    }

    /**
     * Get mention statistics for the authenticated user.
     */
    public function stats(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        
        $stats = [
            'total_mentions' => CommentMention::where('mentioned_user_id', $userId)->count(),
            'unread_mentions' => CommentMention::where('mentioned_user_id', $userId)
                ->where('is_read', false)
                ->count(),
            'read_mentions' => CommentMention::where('mentioned_user_id', $userId)
                ->where('is_read', true)
                ->count(),
        ];

        return response()->json($stats);
    }

    /**
     * Display the specified mention.
     */
    public function show(Request $request, CommentMention $mention): JsonResponse
    {
        // Check if the mention belongs to the authenticated user
        if ($mention->mentioned_user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $mention->load([
            'comment.productFeedback:id,title',
            'comment.user:id,name,email',
            'mentionedByUser:id,name,email'
        ]);

        return response()->json($mention);
    }
}
