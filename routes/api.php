<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProductFeedbackController;
use App\Http\Controllers\API\ProductFeedbackCommentController;
use App\Http\Controllers\API\CommentMentionController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
ROute::get('/product-feedbacks', [ProductFeedbackController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    
    Route::post('/product-feedbacks', [ProductFeedbackController::class, 'store']);
    Route::get('/product-feedbacks/{productFeedback}', [ProductFeedbackController::class, 'show']);
    Route::put('/product-feedbacks/{productFeedback}', [ProductFeedbackController::class, 'update']);
    Route::delete('/product-feedbacks/{productFeedback}', [ProductFeedbackController::class, 'destroy']);
    
    Route::prefix('product-feedbacks/{productFeedback}')->group(function () {
        Route::get('comments', [ProductFeedbackCommentController::class, 'index']);
        Route::post('comments', [ProductFeedbackCommentController::class, 'store']);
        Route::get('comments/{comment}', [ProductFeedbackCommentController::class, 'show']);
    });
    
    Route::prefix('mentions')->group(function () {
        Route::get('/', [CommentMentionController::class, 'index']);
        Route::get('/unread', [CommentMentionController::class, 'unread']);
        Route::get('/stats', [CommentMentionController::class, 'stats']);
        Route::post('/mark-all-read', [CommentMentionController::class, 'markAllAsRead']);
        Route::get('/{mention}', [CommentMentionController::class, 'show']);
        Route::patch('/{mention}/read', [CommentMentionController::class, 'markAsRead']);
    });
});
