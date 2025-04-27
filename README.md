# Task Manager Application

Welcome to the **Task Manager**, a full-featured web application designed to streamline task organization and productivity. With an intuitive Kanban-style board, users can create boards, manage sections, and organize tasks efficiently. The application includes robust user authentication to ensure secure access. Built with a modern tech stack, it offers a seamless experience for personal and team-based task management.

## Table of Contents

-   [Overview](#overview)
-   [Features](#features)
-   [Tech Stack](#tech-stack)
-   [Project Structure](#project-structure)
-   [Setup and Installation](#setup-and-installation)
-   [API Endpoints](#api-endpoints)
-   [How to use](#how-to-use)
-   [Challenges and Solutions](#challenges-and-solutions)
-   [Future Enhancements](#future-enhancements)
-   [Contributing](#contributing)
-   [License](#license)

## Overview

The Task Manager is a web-based application that empowers users to organize tasks using a Kanban board interface. Users can sign up or log in to create boards, add sections (columns), and manage tasks within those sections. Each board, section, and task supports full CRUD (Create, Read, Update, Delete) operations, making it a versatile tool for personal productivity or team collaboration.

The application is designed with a clean, user-friendly interface powered by Material-UI and a robust backend that ensures data persistence and security. Whether you're managing daily tasks or planning complex projects, the Task Manager provides an intuitive and efficient solution.

## Features

-   **User Authentication**:
    -   Sign up with a username and password.
    -   Log in with registered credentials.
    -   Token-based authentication for secure access.
-   **Board Management**:
    -   Create, edit, and delete boards.
    -   Update board names and details.
-   **Section Management**:
    -   Add, edit, or delete sections (columns) within a board.
    -   Update section titles dynamically.
-   **Task Management**:
    -   Create, edit, or delete tasks within sections.
    -   Update task titles via a modal interface.
-   **Kanban Interface**:
    -   Visualize tasks in a Kanban board layout with sections as columns.
    -   Responsive design for seamless use across devices.
-   **State Management**:
    -   Real-time UI updates for task and section changes using React and Redux.
-   **Secure API**:
    -   RESTful API endpoints for all CRUD operations, secured with JWT tokens.

## Tech Stack

The Task Manager is built with a modern, scalable tech stack:

-   **Frontend**:
    -   **React.js** (18.x) with **Vite** for fast development and bundling.
    -   **TypeScript** for type-safe development.
    -   **Material-UI (MUI)** for a polished, responsive UI.
    -   **React Router** for client-side routing.
    -   **Redux Toolkit** for state management.
    -   **Axios** for API requests.
-   **Backend**:
    -   **Node.js** (18.x) with **Express** for the server framework.
    -   **MongoDB** (5.x) for NoSQL database storage, containerized with **Docker**.
-   **Additional Tools**:
    -   **Dnd-kit** (planned for future drag-and-drop functionality).
    -   **ESLint** for code linting.
    -   **Vercel** for deployment configuration.

## Project Structure

The project is organized into two main directories: `client` (frontend) and `server` (backend).

```
├── client
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   └── vite.svg
│   ├── README.md
│   ├── src
│   │   ├── api
│   │   │   ├── authApi.ts
│   │   │   ├── axiosClient.ts
│   │   │   ├── boardApi.ts
│   │   │   ├── sectionApi.ts
│   │   │   ├── taskApi.ts
│   │   │   └── Types.ts
│   │   ├── App.tsx
│   │   ├── assets
│   │   │   ├── images
│   │   │   │   ├── favicon.png
│   │   │   │   ├── logo-dark.png
│   │   │   │   └── logo-light.png
│   │   │   ├── index.ts
│   │   │   └── react.svg
│   │   ├── components
│   │   │   └── common
│   │   │       ├── Kanban.tsx
│   │   │       ├── Loading.tsx
│   │   │       ├── Sidebar.tsx
│   │   │       ├── SortableBoardItem.tsx
│   │   │       ├── SortableTaskCard.tsx
│   │   │       └── TaskTitleModal.tsx
│   │   ├── layout
│   │   │   ├── AppLayout.tsx
│   │   │   └── AuthLayout.tsx
│   │   ├── main.tsx
│   │   ├── pages
│   │   │   ├── Board.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   └── Types.ts
│   │   ├── redux
│   │   │   ├── features
│   │   │   │   ├── boardSlice.ts
│   │   │   │   └── userSlice.ts
│   │   │   └── store.ts
│   │   ├── routes.tsx
│   │   ├── Types.ts
│   │   ├── utils
│   │   │   └── authUtils.ts
│   │   └── vite-env.d.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── README.md
└── server
    ├── app.js
    ├── bin
    │   └── www.js
    ├── package.json
    ├── package-lock.json
    ├── public
    │   ├── index.html
    │   └── stylesheets
    │       └── style.css
    ├── src
    │   └── v1
    │       ├── controllers
    │       │   ├── board.js
    │       │   ├── section.js
    │       │   ├── task.js
    │       │   └── user.js
    │       ├── handlers
    │       │   ├── tokenHandler.js
    │       │   └── validation.js
    │       ├── models
    │       │   ├── board.js
    │       │   ├── modelOptions.js
    │       │   ├── section.js
    │       │   ├── task.js
    │       │   └── user.js
    │       └── routes
    │           ├── auth.js
    │           ├── board.js
    │           ├── index.js
    │           ├── section.js
    │           └── task.js
    └── vercel.json

```

## Setup and Installation

### Prerequisites

-   **Node.js** (18.x or higher)
-   **Docker** (for MongoDB)
-   **MongoDB** (if not using Docker)
-   **npm** (8.x or higher)

### Backend Setup

1. Navigate to the `server` directory:
    ```bash
    cd server
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up environment variables by creating a `.env` file in the `server` directory:
    ```
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/task-manager
    JWT_SECRET=your_jwt_secret_key
    ```
4. Run MongoDB using Docker:

    ```bash
    sudo docker run --name todo-app -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin mongo

    ```
5. Run the docker container:
    ```bash
    sudo docker start todo-app
    ```

    Alternatively, ensure a local MongoDB instance is running.


6. Start the backend server:
    ```bash
    npm run start
    ```
    The server will run on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the `client` directory:
    ```bash
    cd client
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up environment variables by creating a `.env` file in the `client` directory:
    ```
    VITE_API_BASE_URL=http://localhost:5000/api
    ```
4. Start the frontend development server:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173` (or the port specified by Vite).

### Running the Application

1. Ensure the backend server and MongoDB are running.
2. Start the frontend development server.
3. Open `http://localhost:5173` in your browser.
4. Sign up or log in to start managing tasks.

Note: You can run the appliation easily using docker compoose file, just make sure of your desigred enviromant variables, and than run command

```
sudo docker-compose up --build
```

and then, open the application and try it optimistiaclly.

## API Endpoints

The backend provides RESTful API endpoints for authentication and task management. Below are key endpoints:

### Authentication

-   **POST /api/auth/signup**

    -   **Request**:
        ```json
        {
            "username": "user1",
            "password": "Password123",
            "confirmPassword": "Password123"
        }
        ```
    -   **Response** (Success):
        ```json
        {
            "data": {
                "token": "jwt_token"
            }
        }
        ```
    -   **Response** (Error):
        ```json
        {
            "errors": [
                { "param": "username", "msg": "Username already exists" }
            ]
        }
        ```

-   **POST /api/auth/login**
    -   **Request**:
        ```json
        {
            "username": "user1",
            "password": "Password123"
        }
        ```
    -   **Response** (Success):
        ```json
        {
            "data": {
                "token": "jwt_token"
            }
        }
        ```

### Boards

-   **POST /api/boards**: Create a new board.
-   **GET /api/boards**: Retrieve all boards for the user.
-   **PUT /api/boards/:id**: Update board details.
-   **DELETE /api/boards/:id**: Delete a board.

### Sections

-   **POST /api/sections**: Create a section in a board.
-   **PUT /api/sections/:id**: Update section title.
-   **DELETE /api/sections/:id**: Delete a section.

### Tasks

-   **POST /api/tasks**: Create a task in a section.
-   **PUT /api/tasks/:id**: Update task title.
-   **DELETE /api/tasks/:id**: Delete a task.

All endpoints except `/auth/signup` and `/auth/login` require a JWT token in the `Authorization` header.


## How to use
1. Start the application
2. Sign up for an account
3. Login with recorded creditials ( Username and password )
4. Start using the application.
## Challenges and Solutions

Building the Task Manager presented a few challenges, which we addressed to ensure a smooth user experience:

-   **Challenge**: Task titles in the Kanban board didn’t update in the UI after editing until a page reload.
    -   **Solution**: Implemented optimistic updates in the `Kanban.tsx` component by updating the local state immediately and reverting on backend failure. Modified the `useEffect` hook to prevent overwriting local state with stale data.
-   **Challenge**: Signup errors caused a `TypeError` and prevented navigation to the login page.
    -   **Solution**: Improved error handling in `Signup.tsx` by safely checking the error structure and adding TypeScript interfaces for response types. Added debugging logs to inspect API responses.
-   **Challenge**: Ensuring type safety with TypeScript across frontend and backend.
    -   **Solution**: Defined clear interfaces (e.g., `Task`, `Section`, `SignupParams`) in `Types.ts` files to enforce consistent data structures.

These solutions enhanced the application’s reliability and user experience, reflecting our commitment to quality.

## Future Enhancements

The Task Manager has a solid foundation, with exciting opportunities for growth:

-   **Drag-and-Drop Functionality**: Integrate `dnd-kit` to enable dragging tasks between sections and reordering sections within boards.
-   **Task Details**: Add support for task descriptions, due dates, and priority levels.
-   **User Roles**: Implement admin and member roles for collaborative boards.
-   **Notifications**: Add in-app or email notifications for task updates.
-   **Improved Error Handling**: Replace `alert` with MUI `Snackbar` for a polished user experience.
-   **Testing**: Introduce unit and integration tests using Jest and React Testing Library.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Please ensure your code follows the project’s ESLint rules and includes relevant tests.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it as needed.

---

Thank you for exploring the Task Manager! We hope it helps you stay organized and productive. For questions or feedback, please reach out via the repository’s issue tracker.
