# Product Feedback App

A Laravel-based product feedback application that allows users to submit feedback, comment on feedback items, and engage in discussions with mentions and replies.

## Features

- User authentication and management
- Submit product feedback with categories (feature, enhancement, bug)
- Comment system with threaded replies
- User mentions in comments
- Responsive design with React frontend
- Real-time interactions

## Requirements

- PHP 8.2 or higher
- Composer
- Node.js 22+ and npm
- MySQL 8.0+
- Git

## Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd product-feedback-app
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node.js Dependencies

```bash
npm install
```

### 4. Environment Configuration

Copy the environment file and configure your settings:

```bash
cp .env.example .env
```

Edit the `.env` file and configure your database and other settings:

```env
APP_NAME="Product Feedback App"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=product_feedback_app
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Add other configuration as needed
```

### 5. Generate Application Key

```bash
php artisan key:generate
```

### 6. Database Setup

Create your database and run migrations:

```bash
# Create database (MySQL example)
mysql -u your_username -p -e "CREATE DATABASE product_feedback_app;"

# Run migrations
php artisan migrate
```

### 7. Seed the Database (Optional)

To populate the database with dummy data including 3 users and 20 feedback items:

```bash
php artisan db:seed
```

This will create:
- 3 test users (password: 12345678)
  - john@example.com
  - jane@example.com  
  - mike@example.com
- 20 product feedback items with various categories
- Comments and replies with user mentions

### 8. Build Frontend Assets

```bash
# For development
npm run dev

# For production
npm run build
```

### 9. Start the Development Server

```bash
php artisan serve
```

The application will be available at `http://localhost:8000`

### 10. Start Vite Development Server (for hot reloading)

In a separate terminal, run:

```bash
npm run dev
```

## Usage

1. Visit `http://localhost:8000` in your browser
2. Register a new account or use one of the seeded accounts
3. Submit feedback, browse existing feedback, and participate in discussions
4. Use the @username syntax to mention other users in comments

## Development

### Running Tests

```bash
php artisan test
```

### Code Style

This project follows PSR-12 coding standards. You can check and fix code style using:

```bash
./vendor/bin/pint
```

### Database Reset

To reset the database and re-seed with fresh data:

```bash
php artisan migrate:fresh --seed
```

## Project Structure

- `app/Models/` - Eloquent models for User, ProductFeedback, ProductFeedbackComment, CommentMention
- `app/Http/Controllers/` - API controllers
- `resources/js/` - React frontend components
- `database/migrations/` - Database schema migrations
- `database/seeders/` - Database seeders for dummy data
- `routes/api.php` - API routes
- `routes/web.php` - Web routes

## API Endpoints

The application provides RESTful API endpoints for:
- User authentication
- Feedback management (CRUD operations)
- Comment management with threading
- User mentions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).