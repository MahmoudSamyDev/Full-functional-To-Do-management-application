import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import authUtils from "../utils/authUtils";
import Loading from "../components/common/Loading";
import Sidebar from "../components/common/Sidebar";
// import { useDispatch } from "react-redux";
// import { setUser } from "../../redux/features/userSlice";

function AppLayout() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    // const dispatch = useDispatch();

    useEffect(() => {
        const checkAuth = async () => {
            const user = await authUtils.isAuthenticated();
            if (!user) {
                navigate("/login");
            } else {
                // save user
                // dispatch(setUser(user));
                setLoading(false);
            }
        };
        checkAuth();
    }, [navigate]);

    return loading ? (
        <Loading fullHeight />
    ) : (
        <Box
            sx={{
                display: "flex",
            }}
        >
            <Sidebar />
            <Box
                sx={{
                    flexGrow: 1,
                    p: 1,
                    width: "max-content",
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default AppLayout;
