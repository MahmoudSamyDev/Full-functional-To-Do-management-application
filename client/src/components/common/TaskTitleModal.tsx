import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (title: string) => void;
    initialTitle: string;
}

const TaskTitleModal = ({ open, onClose, onSave, initialTitle }: Props) => {
    const [title, setTitle] = useState(initialTitle);

    useEffect(() => {
        setTitle(initialTitle);
        console.log("Modal opened");
    }, [initialTitle]);

    const handleSave = () => {
        onSave(title.trim() || "Untitled");
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    p: 4,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    width: 400,
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <Typography fontWeight={600} mb={2}>
                    Edit Task Title
                </Typography>
                <TextField
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title"
                    autoFocus
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleSave}
                >
                    Save
                </Button>
            </Box>
        </Modal>
    );
};

export default TaskTitleModal;
