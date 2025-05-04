import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Card, IconButton } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { Task } from "../../api/Types";

// Note: This component is used in the Kanban component
// useSortable({ id: task._id }) => Makes the card draggable
// setNodeRef => Ref to the draggable DOM node
// attributes, listeners =>	Required props for accessibility and drag handling
// transform, transition => Smooth visual feedback while dragging
// opacity + border =>	Styling feedback while dragging

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
        border: isDragging ? "2px dashed #999" : "1px solid transparent",
        cursor: "grab",
    };

    return (
        <Card sx={style}>
            <div
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                style={{ flex: 1, cursor: "grab" }}
            >
                {task?.title || "Untitled"}
            </div>
            <div className="actions flex items-center gap-[10px]">
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log("Delete task", task._id);
                        onDelete(task._id);
                    }}
                >
                    <DeleteOutlinedIcon />
                </IconButton>
                <IconButton size="small" onClick={() => onEditTitle(task)}>
                    <EditIcon />
                </IconButton>
            </div>
        </Card>
    );
};

export default SortableTaskCard;
