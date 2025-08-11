<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductFeedbackCommentResource extends JsonResource {
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array {
        return [
            'id'              => $this->id,
            'comment'         => $this->comment,
            'created_at'      => $this->created_at,
            'updated_at'      => $this->updated_at,
            'parent_id'       => $this->parent_id,
            'mentioned_users' => $this->mentioned_users,
            'user'            => [
                'id'    => $this->user->id,
                'name'  => $this->user->name,
                'email' => $this->user->email,
            ],
            'replies'         => ProductFeedbackCommentResource::collection($this->whenLoaded('replies')),
            'parent'          => new ProductFeedbackCommentResource($this->whenLoaded('parent')),
        ];
    }
}
