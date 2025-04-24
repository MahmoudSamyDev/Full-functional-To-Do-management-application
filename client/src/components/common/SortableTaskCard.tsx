import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, TextField } from "@mui/material";
import { Task } from "../../api/Types";

interface Props {
    task: Task;
    onEditTitle: (task: Task) => void;
}

const SortableTaskCard = ({ task, onEditTitle }: Props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        marginBottom: "10px",
        padding: "10px",
    };

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <Card
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            sx={style}
            onDoubleClick={() => onEditTitle(task)} // 👈 Double click to edit
        >
            <TextField
                value={task.title}
                onClick={stopPropagation} // ✅ prevent opening modal when editing
                placeholder="Untitled"
                variant="standard"
                fullWidth
                InputProps={{
                    disableUnderline: true,
                    sx: {
                        fontWeight: 600,
                        fontSize: "0.9rem",
                    },
                }}
            />
        </Card>
    );
};

export default SortableTaskCard;
