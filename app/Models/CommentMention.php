<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommentMention extends Model
{
    use HasFactory;

    protected $fillable = [
        'comment_id',
        'mentioned_user_id',
        'mentioned_by_user_id',
        'is_read',
        'read_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    public function comment(): BelongsTo
    {
        return $this->belongsTo(ProductFeedbackComment::class);
    }

    public function mentionedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentioned_user_id');
    }

    public function mentionedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentioned_by_user_id');
    }
}
