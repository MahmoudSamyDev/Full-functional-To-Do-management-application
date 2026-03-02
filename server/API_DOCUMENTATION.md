# To-Do Management API Documentation

This is a comprehensive RESTful API for a To-Do management application with Kanban board functionality. The API supports user authentication, board management, section organization, and task manipulation with drag-and-drop capabilities.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

```bash
cd server
npm install
```

### Environment Setup

Create a `.env` file in the server directory with the following variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/todo-app
PASSWORD_SECRET_KEY=your-password-secret-key
TOKEN_SECRET_KEY=your-jwt-secret-key
NODE_ENV=development
```

### Running the Server

```bash
npm run dev      # Development mode with nodemon
npm start        # Production mode
```

### Accessing API Documentation

Once the server is running, you can access the interactive Swagger documentation at:

```
http://localhost:3000/api-docs
```

## 📋 API Overview

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication

The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Data Models

#### User

- **username**: string (min 8 characters, unique)
- **password**: string (min 8 characters, AES encrypted)

#### Board

- **user**: ObjectId (reference to User)
- **icon**: string (emoji, default: 📃)
- **title**: string (default: "Untitled")
- **description**: string (default description provided)
- **position**: number (for ordering)
- **favourite**: boolean (optional)
- **favouritePosition**: number (for favorite ordering)

#### Section

- **board**: ObjectId (reference to Board)
- **title**: string (e.g., "To Do", "In Progress", "Done")

#### Task

- **section**: ObjectId (reference to Section)
- **title**: string
- **content**: string (task description)
- **position**: number (for ordering within section)

## 🔐 Authentication Endpoints

### POST /auth/signup

Register a new user

- **Body**: `{ username, password, confirmPassword }`
- **Response**: User object and JWT token

### POST /auth/login

Authenticate user

- **Body**: `{ username, password }`
- **Response**: User object and JWT token

### POST /auth/verify-token

Verify JWT token validity

- **Headers**: `Authorization: Bearer <token>`
- **Response**: User object

## 📊 Board Management

### POST /boards

Create a new board (requires authentication)

### GET /boards

Get all boards for authenticated user (sorted by position)

### PUT /boards

Update board positions (reorder boards)

### GET /boards/{boardId}

Get specific board with sections and tasks populated

### PUT /boards/{boardId}

Update board details (title, description, icon, favorite status)

### DELETE /boards/{boardId}

Delete board and all its sections/tasks (cascade delete)

## 📑 Section Management

### POST /boards/{boardId}/sections

Create new section in a board

### PUT /boards/{boardId}/sections/{sectionId}

Update section details

### DELETE /boards/{boardId}/sections/{sectionId}

Delete section and all its tasks

## ✅ Task Management

### POST /boards/{boardId}/tasks

Create new task in a section

- **Body**: `{ sectionId }`

### PUT /boards/{boardId}/tasks/{taskId}

Update task details (title, content)

### DELETE /boards/{boardId}/tasks/{taskId}

Delete task and reorder remaining tasks

### PUT /boards/{boardId}/tasks/update-position

Handle drag-and-drop task movement between sections

- **Body**: `{ resourceList, destinationList, resourceColumnId, destinationColumnId }`

## 🎯 Key Features

### 1. Hierarchical Structure

- **User** → **Boards** → **Sections** → **Tasks**
- Proper cascade deletion maintaining data integrity

### 2. Position Management

- Custom ordering for boards and tasks
- Automatic position assignment and reordering

### 3. Favorites System

- Mark boards as favorites
- Separate positioning for favorite boards

### 4. Kanban Drag-and-Drop

- Move tasks between sections
- Reorder tasks within sections
- Bulk position updates for efficiency

### 5. Security Features

- JWT-based authentication
- Password encryption with AES
- Input validation on all endpoints
- MongoDB ObjectId validation

### 6. Validation & Error Handling

- Comprehensive input validation using express-validator
- Consistent error response format
- Proper HTTP status codes

## 📚 API Response Formats

### Success Response

```json
{
  "data": {
    "user": { ... },
    "token": "jwt-token-here"
  }
}
```

### Error Response

```json
{
  "errors": [
    {
      "param": "username",
      "msg": "username must be at least 8 characters"
    }
  ]
}
```

## 🔧 Development Notes

### Database Design

- MongoDB with Mongoose ODM
- References between models using ObjectIds
- Timestamps automatically managed
- Virtual fields for JSON serialization

### Middleware Stack

- **CORS**: Configured for `localhost:5000`
- **Morgan**: HTTP request logging
- **Express Validator**: Input validation
- **JWT Verification**: Protected route middleware

### API Versioning

- Current version: `/api/v1`
- Prepared for future versioning

## 🐳 Deployment

### Docker Support

The application includes Docker configuration:

```bash
docker build -t todo-api .
docker run -p 3000:3000 todo-api
```

### Vercel Deployment

Configured for serverless deployment on Vercel platform.

## 📖 Interactive Documentation

For detailed endpoint documentation with examples and testing capabilities, visit the Swagger UI at `/api-docs` when the server is running.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the existing code style and patterns
4. Update documentation if needed
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
