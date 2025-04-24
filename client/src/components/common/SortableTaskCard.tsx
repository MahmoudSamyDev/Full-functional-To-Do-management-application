// SortableTaskCard.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, Typography } from "@mui/material";
import { Task } from "../../api/Types";

interface Props {
    task: Task;
    onClick: () => void;
}

const SortableTaskCard = ({ task, onClick }: Props) => {
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

    return (
        <Card
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            sx={style}
            onClick={onClick}
        >
            <Typography>{task.title || "Untitled"}</Typography>
        </Card>
    );
};

export default SortableTaskCard;
