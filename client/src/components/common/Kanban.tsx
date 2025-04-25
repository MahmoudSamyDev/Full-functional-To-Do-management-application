import TaskTitleModal from "./TaskTitleModal";
import {
    Box,
    Button,
    Typography,
    Divider,
    TextField,
    IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import sectionApi from "../../api/sectionApi";
import taskApi from "../../api/taskApi";
import { Section, Task } from "../../api/Types";
import SortableTaskCard from "./SortableTaskCard";

let timer: ReturnType<typeof setTimeout>;
const timeout = 500;

interface KanbanProps {
    boardId: string;
    data: Section[];
}

function Kanban({ boardId, data: initialSections }: KanbanProps) {
    const [data, setData] = useState<Section[]>(initialSections);
    const [titleModalOpen, setTitleModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

    // Only initialize data when initialSections changes and data is empty
    useEffect(() => {
        if (data.length === 0 && initialSections.length > 0) {
            setData(initialSections);
        }
    }, [initialSections, data]);

    const createSection = async () => {
        try {
            const section = await sectionApi.create(boardId);
            setData([...data, section]);
        } catch (err) {
            alert(err);
        }
    };

    const deleteSection = async (sectionId: string) => {
        try {
            await sectionApi.delete(boardId, sectionId);
            setData(data.filter((e) => e._id !== sectionId));
        } catch (err) {
            alert(err);
        }
    };

    const updateSectionTitle = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        sectionId: string
    ) => {
        clearTimeout(timer);
        const newTitle = e.target.value;
        const newData = [...data];
        const index = newData.findIndex((e) => e._id === sectionId);
        newData[index].title = newTitle;
        setData(newData);

        timer = setTimeout(async () => {
            try {
                await sectionApi.update(boardId, sectionId, {
                    title: newTitle,
                });
            } catch {
                alert("Failed to update section");
            }
        }, timeout);
    };

    const updateTaskTitle = async (taskId: string, newTitle: string) => {
        try {
            // Optimistic update: Update the UI immediately
            setData((prevData) =>
                prevData.map((section) => ({
                    ...section,
                    tasks: section.tasks.map((task) =>
                        task._id === taskId ? { ...task, title: newTitle } : task
                    ),
                }))
            );

            // Send update to backend
            await taskApi.update(boardId, taskId, { title: newTitle });
            return true;
        } catch {
            // Revert optimistic update on failure
            alert("Failed to update task title");
            setData((prevData) =>
                prevData.map((section) => ({
                    ...section,
                    tasks: section.tasks.map((task) =>
                        task._id === taskId ? { ...task, title: task.title } : task
                    ),
                }))
            );
            return false;
        }
    };

    async function createTask(sectionId: string) {
        try {
            const task = await taskApi.create(boardId, {
                sectionId,
                title: "New Task",
            });
            const newData = [...data];
            const index = newData.findIndex((e) => e._id === sectionId);
            newData[index].tasks.unshift(task);
            setData(newData);
        } catch {
            alert("Failed to create task");
        }
    }

    async function deleteTask(taskId: string) {
        try {
            await taskApi.delete(boardId, taskId);
            setData((prevData) =>
                prevData.map((section) => ({
                    ...section,
                    tasks: section.tasks.filter((task) => task._id !== taskId),
                }))
            );
        } catch {
            alert("Failed to delete task");
        }
    }

    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Button onClick={createSection}>Add section</Button>
                <Typography variant="body2" fontWeight="700">
                    {data.length} Sections
                </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            {taskToEdit && (
                <TaskTitleModal
                    open={titleModalOpen}
                    initialTitle={taskToEdit.title}
                    onClose={() => {
                        setTitleModalOpen(false);
                        setTaskToEdit(null);
                    }}
                    onSave={async (newTitle) => {
                        if (!taskToEdit) return;
                        const success = await updateTaskTitle(taskToEdit._id, newTitle);
                        if (success) {
                            setTitleModalOpen(false);
                            setTaskToEdit(null);
                        }
                    }}
                />
            )}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    width: "calc(100vw - 400px)",
                    overflowX: "auto",
                }}
            >
                {data.map((section) => (
                    <Box
                        key={section._id}
                        sx={{
                            minWidth: "300px",
                            maxWidth: "300px",
                            marginRight: "10px",
                            padding: "10px",
                            borderRadius: "8px",
                        }}
                    >
                        <Box display="flex" alignItems="center" mb={1}>
                            <TextField
                                value={section.title}
                                onChange={(e) =>
                                    updateSectionTitle(e, section._id)
                                }
                                fullWidth
                                placeholder="Untitled"
                                variant="outlined"
                                sx={{
                                    "& .MuiOutlinedInput-input": {
                                        padding: 0,
                                    },
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        border: "unset",
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        fontSize: "1rem",
                                        fontWeight: "700",
                                    },
                                }}
                            />
                            <IconButton
                                size="small"
                                onClick={() => createTask(section._id)}
                            >
                                <AddOutlinedIcon />
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={() => deleteSection(section._id)}
                            >
                                <DeleteOutlinedIcon />
                            </IconButton>
                        </Box>

                        {section.tasks.map((task) => (
                            <SortableTaskCard
                                key={task._id}
                                task={task}
                                onEditTitle={(task) => {
                                    setTaskToEdit(task);
                                    setTitleModalOpen(true);
                                }}
                                onDelete={deleteTask}
                            />
                        ))}
                    </Box>
                ))}
            </Box>
        </>
    );
}
export default Kanban;