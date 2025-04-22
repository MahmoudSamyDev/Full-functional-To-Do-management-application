import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import { LoginForm } from "./Types";

function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [usernameErrText, setUsernameErrText] = useState<string>("");
    const [passwordErrText, setPasswordErrText] = useState<string>("");

    async function handleSubmit(e: React.FormEvent<LoginForm>) {
        e.preventDefault();
        setUsernameErrText("");
        setPasswordErrText("");

        const data = new FormData(e.currentTarget);
        const username = (data.get("username") as string).trim();
        const password = (data.get("password") as string).trim();

        let err = false;

        // Form validations
        if (username === "") {
            err = true;
            setUsernameErrText("Please fill this field");
        }
        if (password === "") {
            err = true;
            setPasswordErrText("Please fill this field");
        }

        if (err) return;

        setLoading(true);

        try {
            console.log("Logging in...");
            const res = await authApi.login({ username, password });
            console.log(res);
            setLoading(false);
            localStorage.setItem("token", res.data.token);
            navigate("/boards");
        } catch (err) {
            const errors = (
                err as { data: { errors: { param: string; msg: string }[] } }
            ).data.errors;
            errors.forEach((e) => {
                if (e.param === "username") {
                    setUsernameErrText(e.msg);
                }
                if (e.param === "password") {
                    setPasswordErrText(e.msg);
                }
            });
            setLoading(false);
        }
    }

    return (
        <>
            <Box
                component="form"
                sx={{ mt: 1 }}
                onSubmit={handleSubmit}
                noValidate
            >
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    disabled={loading}
                    error={usernameErrText !== ""}
                    helperText={usernameErrText}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    disabled={loading}
                    error={passwordErrText !== ""}
                    helperText={passwordErrText}
                />
                <Button
                    sx={{ mt: 3, mb: 2 }}
                    variant="outlined"
                    fullWidth
                    color="success"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </Button>
            </Box>
            <Button
                component={Link}
                to="/signup"
                sx={{ textTransform: "none" }}
            >
                Don't have an account? Signup
            </Button>
        </>
    );
}

export default Login;
