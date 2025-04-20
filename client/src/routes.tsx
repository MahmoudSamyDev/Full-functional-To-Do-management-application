import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import AppLayout from "./layout/AppLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Board from "./pages/Board";

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Signup />,
            },
        ],
    },
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "/boards",
                element: <Home />,
            },
            { path: "/boards/:boardId", element: <Board /> },
        ],
    },
]);

export default appRouter;
