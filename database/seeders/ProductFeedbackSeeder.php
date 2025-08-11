<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ProductFeedback;
use App\Models\ProductFeedbackComment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ProductFeedbackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 3 dummy users
        $users = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => Hash::make('12345678'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'password' => Hash::make('12345678'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Mike Johnson',
                'email' => 'mike@example.com',
                'password' => Hash::make('12345678'),
                'email_verified_at' => now(),
            ],
        ];

        $createdUsers = [];
        foreach ($users as $userData) {
            $createdUsers[] = User::create($userData);
        }

        // Create dummy product feedback
        $feedbackData = [
            [
                'title' => 'Add dark mode support',
                'description' => 'It would be great to have a dark mode option for the application. This would help users who work in low-light environments and prefer darker interfaces.',
                'category' => 'feature',
                'user_id' => $createdUsers[0]->id,
            ],
            [
                'title' => 'Improve search functionality',
                'description' => 'The current search feature is quite basic. It would be helpful to have advanced search options like filtering by date, category, and user.',
                'category' => 'enhancement',
                'user_id' => $createdUsers[1]->id,
            ],
            [
                'title' => 'Fix mobile responsiveness issues',
                'description' => 'The application doesn\'t display properly on mobile devices. Some buttons are too small and text overlaps in certain sections.',
                'category' => 'bug',
                'user_id' => $createdUsers[2]->id,
            ],
            [
                'title' => 'Add user profile management',
                'description' => 'Users should be able to edit their profile information, change passwords, and manage their account settings from a dedicated profile page.',
                'category' => 'feature',
                'user_id' => $createdUsers[0]->id,
            ],
            [
                'title' => 'Implement notification system',
                'description' => 'Users should receive notifications when their feedback receives comments or when they are mentioned in discussions.',
                'category' => 'feature',
                'user_id' => $createdUsers[1]->id,
            ],
            [
                'title' => 'Performance optimization needed',
                'description' => 'The application loads slowly, especially when there are many feedback items. We need to optimize the database queries and implement pagination.',
                'category' => 'enhancement',
                'user_id' => $createdUsers[2]->id,
            ],
            [
                'title' => 'Export feedback data',
                'description' => 'It would be useful to have an option to export feedback data in various formats like CSV, PDF, or Excel for reporting purposes.',
                'category' => 'feature',
                'user_id' => $createdUsers[0]->id,
            ],
            [
                'title' => 'Sorting options for feedback list',
                'description' => 'Add sorting options for the feedback list such as by date created, number of comments, category, or user rating.',
                'category' => 'enhancement',
                'user_id' => $createdUsers[1]->id,
            ],
            [
                'title' => 'Login form validation error',
                'description' => 'When entering invalid credentials, the error message doesn\'t display correctly and the form doesn\'t retain the entered email address.',
                'category' => 'bug',
                'user_id' => $createdUsers[2]->id,
            ],
            [
                'title' => 'Add tagging system',
                'description' => 'Implement a tagging system that allows users to add custom tags to their feedback for better organization and searchability.',
                'category' => 'feature',
                'user_id' => $createdUsers[0]->id,
            ],
            [
                'title' => 'Add voting system for feedback',
                'description' => 'Users should be able to upvote or downvote feedback items to help prioritize the most important features and bug fixes.',
                'category' => 'feature',
                'user_id' => $createdUsers[1]->id,
            ],
            [
                'title' => 'Implement real-time chat support',
                'description' => 'Add a live chat feature where users can get immediate help and support from administrators or other users.',
                'category' => 'feature',
                'user_id' => $createdUsers[2]->id,
            ],
            [
                'title' => 'Fix memory leak in comments section',
                'description' => 'There appears to be a memory leak when loading comments on feedback items with many replies. The browser becomes unresponsive after viewing several items.',
                'category' => 'bug',
                'user_id' => $createdUsers[0]->id,
            ],
            [
                'title' => 'Add email digest notifications',
                'description' => 'Users should receive daily or weekly email digests summarizing new feedback, comments, and mentions they received.',
                'category' => 'feature',
                'user_id' => $createdUsers[1]->id,
            ],
            [
                'title' => 'Improve file attachment system',
                'description' => 'Allow users to attach images, documents, and other files to their feedback to better illustrate issues or feature requests.',
                'category' => 'enhancement',
                'user_id' => $createdUsers[2]->id,
            ],
            [
                'title' => 'Add keyboard shortcuts',
                'description' => 'Implement keyboard shortcuts for common actions like creating new feedback, navigating between items, and submitting comments.',
                'category' => 'enhancement',
                'user_id' => $createdUsers[0]->id,
            ],
            [
                'title' => 'Database connection timeout errors',
                'description' => 'Users are experiencing frequent database connection timeout errors, especially during peak usage hours. This needs immediate attention.',
                'category' => 'bug',
                'user_id' => $createdUsers[1]->id,
            ],
            [
                'title' => 'Add feedback status tracking',
                'description' => 'Implement a status system (e.g., open, in progress, completed, rejected) so users can track the progress of their submitted feedback.',
                'category' => 'feature',
                'user_id' => $createdUsers[2]->id,
            ],
            [
                'title' => 'Optimize image loading performance',
                'description' => 'Images in the application load very slowly. Consider implementing lazy loading, image compression, or CDN integration.',
                'category' => 'enhancement',
                'user_id' => $createdUsers[0]->id,
            ],
            [
                'title' => 'Add multi-language support',
                'description' => 'The application should support multiple languages to cater to our international user base. Start with Spanish, French, and German.',
                'category' => 'feature',
                'user_id' => $createdUsers[1]->id,
            ],

        ];

        $createdFeedback = [];
        foreach ($feedbackData as $feedback) {
            $createdFeedback[] = ProductFeedback::create($feedback);
        }

        // Create some comments for the feedback
        $comments = [
            [
                'product_feedback_id' => $createdFeedback[0]->id,
                'user_id' => $createdUsers[1]->id,
                'comment' => 'This is a great idea! Dark mode would definitely improve the user experience.',
                'parent_id' => null,
            ],
            [
                'product_feedback_id' => $createdFeedback[0]->id,
                'user_id' => $createdUsers[2]->id,
                'comment' => 'I agree with @jane. Dark mode is essential for modern applications.',
                'parent_id' => null,
                'mentioned_users' => [$createdUsers[1]->id],
            ],
            [
                'product_feedback_id' => $createdFeedback[1]->id,
                'user_id' => $createdUsers[0]->id,
                'comment' => 'Good point about the search functionality. We should also consider adding autocomplete.',
                'parent_id' => null,
            ],
            [
                'product_feedback_id' => $createdFeedback[2]->id,
                'user_id' => $createdUsers[0]->id,
                'comment' => 'I\'ve noticed this issue too. The mobile layout needs significant improvements.',
                'parent_id' => null,
            ],
            [
                'product_feedback_id' => $createdFeedback[2]->id,
                'user_id' => $createdUsers[1]->id,
                'comment' => 'Maybe we should prioritize this since mobile usage is increasing.',
                'parent_id' => null,
            ],
            [
                'product_feedback_id' => $createdFeedback[3]->id,
                'user_id' => $createdUsers[2]->id,
                'comment' => 'Profile management is definitely needed. Users should also be able to upload profile pictures.',
                'parent_id' => null,
            ],
            [
                'product_feedback_id' => $createdFeedback[4]->id,
                'user_id' => $createdUsers[0]->id,
                'comment' => 'Email notifications would be great, but we should also have in-app notifications.',
                'parent_id' => null,
            ],
            [
                'product_feedback_id' => $createdFeedback[5]->id,
                'user_id' => $createdUsers[1]->id,
                'comment' => 'Performance is crucial. Have you considered implementing caching?',
                'parent_id' => null,
            ],
        ];

        $createdComments = [];
        foreach ($comments as $comment) {
            $createdComments[] = ProductFeedbackComment::create($comment);
        }

        // Create some reply comments
        $replies = [
            [
                'product_feedback_id' => $createdFeedback[0]->id,
                'user_id' => $createdUsers[0]->id,
                'comment' => 'Thanks for the feedback! I\'ll start working on the dark mode implementation.',
                'parent_id' => $createdComments[0]->id,
            ],
            [
                'product_feedback_id' => $createdFeedback[1]->id,
                'user_id' => $createdUsers[1]->id,
                'comment' => 'Autocomplete is a fantastic addition to the search feature. Great suggestion @john!',
                'parent_id' => $createdComments[2]->id,
                'mentioned_users' => [$createdUsers[0]->id],
            ],
            [
                'product_feedback_id' => $createdFeedback[5]->id,
                'user_id' => $createdUsers[2]->id,
                'comment' => 'Yes, Redis caching would definitely help with the performance issues.',
                'parent_id' => $createdComments[7]->id,
            ],
        ];

        foreach ($replies as $reply) {
            ProductFeedbackComment::create($reply);
        }

        $this->command->info('Product feedback seeder completed successfully!');
        $this->command->info('Created 3 users, 20 feedback items, and multiple comments with replies.');
    }
}
