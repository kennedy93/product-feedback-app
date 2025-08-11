<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductFeedback extends Model
{
    use HasFactory;

    protected $table = 'product_feedbacks';

    protected $fillable = [
        'title',
        'description',
        'category',
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(ProductFeedbackComment::class);
    }

    public function rootComments(): HasMany
    {
        return $this->hasMany(ProductFeedbackComment::class)->whereNull('parent_id');
    }
}
