import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, IconButton } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { Task } from "../../api/Types";

interface Props {
    task: Task;
    onEditTitle: (task: Task) => void;
    onDelete: (taskId: string) => void;
}

const SortableTaskCard = ({ task, onEditTitle, onDelete }: Props) => {
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
        marginBottom: "10px",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    };

    return (
        <Card
            ref={setNodeRef}
            {...attributes}
            sx={style}
            onDoubleClick={() => onEditTitle(task)}
        >
            <div {...listeners}>{task?.title ? task.title : "Untitled"}</div>
            <IconButton
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    console.log("Delete button clicked for task ID:", task._id);
                    onDelete(task._id);
                }}
            >
                <DeleteOutlinedIcon />
            </IconButton>
        </Card>
    );
};

export default SortableTaskCard;