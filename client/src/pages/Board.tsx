import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { Box, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import boardApi from "../api/boardApi";
import Kanban from "../components/common/Kanban";
import { setBoards } from "../redux/features/boardSlice";
import { RootState } from "../redux/store";
import { Board as Board_TP, Section } from "../api/Types";

let timer: ReturnType<typeof setTimeout>;
const timeout = 500;

function Board() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { boardId } = useParams<{ boardId: string }>();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(false);

    const boards = useSelector(
        (state: RootState) => state.board.value
    ) as Board_TP[];

    // Get all fetched board data
    useEffect(() => {
        setSections([]);
        setLoading(true);
        setTitle("");
        setDescription("");
        const getBoard = async () => {
            try {
                const res = await boardApi.getOne(`${boardId}`);
                setTitle(res?.title);
                setDescription(res?.description || "");
                setSections(res?.sections);
            } catch {
                alert("Failed to fetch board data.");
            } finally {
                setLoading(false);
            }
        };
        getBoard();
    }, [boardId]);

    function updateTitle(e: React.ChangeEvent<HTMLInputElement>) {
        clearTimeout(timer);
        const newTitle = e.target.value;
        setTitle(newTitle);

        const updatedBoards = [...boards];
        const index = updatedBoards.findIndex((e) => e._id === boardId);
        if (index !== -1) {
            updatedBoards[index] = { ...updatedBoards[index], title: newTitle };
            dispatch(setBoards(updatedBoards));
        }

        timer = setTimeout(async () => {
            try {
                await boardApi.update(`${boardId}`, { title: newTitle });
            } catch {
                alert("Failed to update title.");
            }
        }, timeout);
    }

    function updateDescription(e: React.ChangeEvent<HTMLInputElement>) {
        clearTimeout(timer);
        const newDescription = e.target.value;
        setDescription(newDescription);

        timer = setTimeout(async () => {
            try {
                await boardApi.update(`${boardId}`, {
                    description: newDescription,
                });
            } catch {
                alert("Failed to update description.");
            }
        }, timeout);
    }

    async function deleteBoard() {
        try {
            await boardApi.delete(`${boardId}`);
            const newList = boards.filter((e) => e._id !== boardId);
            if (newList.length === 0) {
                navigate("/boards");
            } else {
                navigate(`/boards/${newList[0]._id}`);
            }
            dispatch(setBoards(newList));
        } catch {
            alert("Failed to delete board.");
        }
    }

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    width: "100%",
                }}
            >
                <IconButton color="error" onClick={deleteBoard}>
                    <DeleteOutlinedIcon />
                </IconButton>
            </Box>
            <Box sx={{ padding: "10px 50px" }}>
                <Box>
                    <TextField
                        value={title}
                        onChange={updateTitle}
                        placeholder="Untitled"
                        variant="outlined"
                        fullWidth
                        sx={{
                            "& .MuiOutlinedInput-input": { padding: 0 },
                            "& .MuiOutlinedInput-notchedOutline": {
                                border: "unset ",
                            },
                            "& .MuiOutlinedInput-root": {
                                fontSize: "2rem",
                                fontWeight: "700",
                            },
                        }}
                    />
                    <TextField
                        value={description}
                        onChange={updateDescription}
                        placeholder="Add a description"
                        variant="outlined"
                        multiline
                        fullWidth
                        sx={{
                            "& .MuiOutlinedInput-input": { padding: 0 },
                            "& .MuiOutlinedInput-notchedOutline": {
                                border: "unset ",
                            },
                            "& .MuiOutlinedInput-root": { fontSize: "0.8rem" },
                        }}
                    />
                </Box>
                <Box>
                    {/* Show loading or Kanban */}
                    {loading ? (
                        <div>Loading board...</div>
                    ) : (
                        <Kanban data={sections} boardId={boardId!} />
                    )}
                </Box>
            </Box>
        </>
    );
}

export default Board;
