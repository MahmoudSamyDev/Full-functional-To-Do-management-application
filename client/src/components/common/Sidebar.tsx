import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import assets from "../../assets/index";
import boardApi from "../../api/boardApi";
import { RootState, AppDispatch } from "../../redux/store";
import { setBoards } from "../../redux/features/boardSlice";
import {
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    Typography,
} from "@mui/material";
import SortableBoardItem from "./SortableBoardItem";
import { Board_TP } from "../../Types";

function Sidebar() {
    const user = useSelector(
        (state: RootState) => state.user.value as { username: string }
    );
    const boards = useSelector(
        (state: RootState) => state.board.value
    ) as Board_TP[];
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { boardId } = useParams<{ boardId: string }>();
    const [activeIndex, setActiveIndex] = useState(0);

    const sidebarWidth = 250;

    useEffect(() => {
        const getBoards = async () => {
            try {
                const res: Board_TP[] = await boardApi.getAll();
                dispatch(setBoards(res));
            } catch (err) {
                alert(err);
            }
        };
        getBoards();
    }, [dispatch]);

    useEffect(() => {
        const activeItem = boards?.findIndex((e) => e._id === boardId);
        if (boards?.length > 0 && boardId === undefined) {
            navigate(`/boards/${boards[0]?._id}`);
        }
        setActiveIndex(activeItem);
    }, [boards, boardId, navigate]);

    function logout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    async function addBoard() {
        try {
            const res: Board_TP = await boardApi.create();
            console.log(res);
            const newList = [res, ...boards];
            dispatch(setBoards(newList));
            navigate(`/boards/${res._id}`);
        } catch (err) {
            alert(err);
        }
    }

    return (
        <Drawer
            container={window.document.body}
            variant="permanent"
            open={true}
            sx={{
                width: sidebarWidth,
                height: "100vh",
                "& > div": { borderRight: "none" },
            }}
        >
            <List
                disablePadding
                sx={{
                    width: sidebarWidth,
                    height: "100vh",
                    backgroundColor: assets.color.secondary,
                }}
            >
                <ListItem>
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography variant="body2" fontWeight="700">
                            {user.username}
                        </Typography>
                        <IconButton onClick={logout}>
                            <LogoutOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </ListItem>
                <ListItem>
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography variant="body2" fontWeight="700">
                            Private
                        </Typography>
                        <IconButton onClick={addBoard}>
                            <AddBoxOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </ListItem>
                {boards?.map((item, index) => (
                    <SortableBoardItem
                        key={item._id}
                        item={item}
                        isActive={index === activeIndex}
                    />
                ))}
            </List>
        </Drawer>
    );
}

export default Sidebar;
