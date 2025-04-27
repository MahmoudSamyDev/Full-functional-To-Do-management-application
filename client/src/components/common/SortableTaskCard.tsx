import { Card, IconButton } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { Task } from "../../api/Types";

interface Props {
    task: Task;
    onEditTitle: (task: Task) => void;
    onDelete: (taskId: string) => void;
}

const SortableTaskCard = ({ task, onEditTitle, onDelete }: Props) => {


    const style = {

        marginBottom: "10px",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    };

    return (
        <Card sx={style}>
            <div>{task?.title ? task.title : "Untitled"}</div>
            <div className="actions flex items-center gap-[10px]">
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log(
                            "Delete button clicked for task ID:",
                            task._id
                        );
                        onDelete(task._id);
                    }}
                >
                    <DeleteOutlinedIcon />
                </IconButton>
                <IconButton
                    size="small"
                    onClick={() => {
                        onEditTitle(task);
                    }}
                >
                    <EditIcon />
                </IconButton>
            </div>
        </Card>
    );
};

export default SortableTaskCard;
