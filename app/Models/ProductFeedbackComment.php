<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductFeedbackComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_feedback_id',
        'user_id',
        'comment',
        'parent_id',
        'mentioned_users',
    ];

    protected $casts = [
        'mentioned_users' => 'array',
    ];

    public function productFeedback(): BelongsTo
    {
        return $this->belongsTo(ProductFeedback::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(ProductFeedbackComment::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(ProductFeedbackComment::class, 'parent_id');
    }

    public function mentions(): HasMany
    {
        return $this->hasMany(CommentMention::class, 'comment_id');
    }

    public function mentionedUsers()
    {
        if (!$this->mentioned_users) {
            return collect();
        }
        
        return User::whereIn('id', $this->mentioned_users)->get();
    }
}
