<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_feedback_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_feedback_id')->constrained('product_feedbacks')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('comment');
            $table->foreignId('parent_id')->nullable()->constrained('product_feedback_comments')->onDelete('cascade');
            $table->json('mentioned_users')->nullable();
            $table->index(['product_feedback_id', 'created_at']);
            $table->index(['parent_id']);
            $table->index(['user_id']);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_feedback_comments');
    }
};
