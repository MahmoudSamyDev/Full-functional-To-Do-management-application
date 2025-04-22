import {
    Backdrop,
    Fade,
    IconButton,
    Modal,
    Box,
    TextField,
    Typography,
    Divider,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Moment from "moment";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import taskApi from "../../api/taskApi";
import { Task } from "../../api/Types";

const modalStyle = {
    outline: "none",
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    bgcolor: "background.paper",
    border: "0px solid #000",
    boxShadow: 24,
    p: 1,
    height: "80%",
};

let timer: ReturnType<typeof setTimeout>;
let isModalClosed = false;

interface TaskModalProps {
    boardId: string;
    task?: Task;
    onClose: () => void;
    onUpdate: (task: Task) => void;
    onDelete: (task: Task) => void;
}

const TaskModal = ({
    boardId,
    task: initialTask,
    onClose,
    onUpdate,
    onDelete,
}: TaskModalProps) => {
    const [task, setTask] = useState<Task | undefined>(initialTask);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const editorWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTask(initialTask);
        setTitle(initialTask?.title || "");
        setContent(initialTask?.content || "");

        if (initialTask) {
            isModalClosed = false;
            updateEditorHeight();
        }
    }, [initialTask]);

    const updateEditorHeight = () => {
        setTimeout(() => {
            if (editorWrapperRef.current) {
                const box = editorWrapperRef.current;
                const editor = box.querySelector(
                    ".ck-editor__editable_inline"
                ) as HTMLElement;
                if (editor) editor.style.height = box.offsetHeight - 50 + "px";
            }
        }, 500);
    };

    const handleClose = () => {
        isModalClosed = true;
        if (task) onUpdate(task);
        onClose();
    };

    const handleDelete = async () => {
        if (!task) return;
        try {
            await taskApi.delete(boardId, task._id);
            onDelete(task);
            setTask(undefined);
        } catch {
            alert("Failed to delete task");
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        clearTimeout(timer);
        const newTitle = e.target.value;
        setTitle(newTitle);

        if (!task) return;

        const updatedTask = { ...task, title: newTitle };
        setTask(updatedTask);
        onUpdate(updatedTask);

        timer = setTimeout(async () => {
            try {
                await taskApi.update(boardId, task._id, { title: newTitle });
            } catch {
                alert("Failed to update task title");
            }
        }, 500);
    };

    const handleContentChange = async (_: unknown, editor: ClassicEditor) => {
        clearTimeout(timer);
        const newContent = editor.getData();

        if (!task || isModalClosed) return;

        const updatedTask = { ...task, content: newContent };
        setTask(updatedTask);
        setContent(newContent);
        onUpdate(updatedTask);

        timer = setTimeout(async () => {
            try {
                await taskApi.update(boardId, task._id, {
                    content: newContent,
                });
            } catch {
                alert("Failed to update content");
            }
        }, 500);
    };

    return (
        <Modal
            open={!!task}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
            <Fade in={!!task}>
                <Box sx={modalStyle}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            width: "100%",
                        }}
                    >
                        <IconButton color="error" onClick={handleDelete}>
                            <DeleteOutlinedIcon />
                        </IconButton>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            height: "100%",
                            flexDirection: "column",
                            padding: "2rem 5rem 5rem",
                        }}
                    >
                        <TextField
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Untitled"
                            variant="outlined"
                            fullWidth
                            sx={{
                                width: "100%",
                                "& .MuiOutlinedInput-input": { padding: 0 },
                                "& .MuiOutlinedInput-notchedOutline": {
                                    border: "unset",
                                },
                                "& .MuiOutlinedInput-root": {
                                    fontSize: "2.5rem",
                                    fontWeight: "700",
                                },
                                marginBottom: "10px",
                            }}
                        />

                        <Typography variant="body2" fontWeight="700">
                            {task?.createdAt
                                ? Moment(task.createdAt).format("YYYY-MM-DD")
                                : ""}
                        </Typography>

                        <Divider sx={{ margin: "1.5rem 0" }} />

                        <Box
                            ref={editorWrapperRef}
                            sx={{
                                position: "relative",
                                height: "80%",
                                overflowX: "hidden",
                                overflowY: "auto",
                            }}
                        >
                            <CKEditor
                                editor={ClassicEditor as any}
                                data={content}
                                onChange={handleContentChange}
                                onFocus={updateEditorHeight}
                                onBlur={updateEditorHeight}
                            />
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default TaskModal;
