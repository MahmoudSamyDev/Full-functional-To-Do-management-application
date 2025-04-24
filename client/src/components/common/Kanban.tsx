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
import {
    DndContext,
    DragEndEvent,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
    const [data, setData] = useState<Section[]>([]);
    const sensors = useSensors(useSensor(PointerSensor));

    const [titleModalOpen, setTitleModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

    useEffect(() => {
        setData(initialSections);
    }, [initialSections]);

    const onDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const sourceSectionIndex = data.findIndex((section) =>
            section.tasks.some((task) => task._id === active.id)
        );
        const targetSectionIndex = data.findIndex((section) =>
            section.tasks.some((task) => task._id === over.id)
        );

        if (sourceSectionIndex === -1 || targetSectionIndex === -1) return;

        const sourceSection = data[sourceSectionIndex];
        const targetSection = data[targetSectionIndex];

        const activeTaskIndex = sourceSection.tasks.findIndex(
            (task) => task._id === active.id
        );
        const overTaskIndex = targetSection.tasks.findIndex(
            (task) => task._id === over.id
        );

        const updatedSourceTasks = [...sourceSection.tasks];
        const updatedTargetTasks = [...targetSection.tasks];

        const [movedTask] = updatedSourceTasks.splice(activeTaskIndex, 1);
        updatedTargetTasks.splice(overTaskIndex, 0, movedTask);

        const newData = [...data];
        newData[sourceSectionIndex].tasks = updatedSourceTasks;
        newData[targetSectionIndex].tasks = updatedTargetTasks;
        setData(newData);

        try {
            await taskApi.updatePosition(boardId, {
                resourceColumnId: sourceSection._id,
                destinationColumnId: targetSection._id,
                resourceList: updatedSourceTasks,
                destinationList: updatedTargetTasks,
            });
        } catch {
            alert("Failed to update task position");
        }
    };

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
        await taskApi.update(boardId, taskId, { title: newTitle });
    } catch {
        alert("Failed to update task title");
    }
};


    async function createTask(sectionId: string) {
        try {
            const task = await taskApi.create(boardId, {
                sectionId,
                title: "",
            });
            const newData = [...data];
            const index = newData.findIndex((e) => e._id === sectionId);
            newData[index].tasks.unshift(task);
            setData(newData);
        } catch {
            alert("Failed to create task");
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
                    onClose={() => setTitleModalOpen(false)}
                    onSave={async (newTitle) => {
                        if (!taskToEdit) return;
                    
                        // 1. Optimistically update local data
                        const updatedData = data.map((section) => {
                            if (section._id !== taskToEdit.board) return section;
                            return {
                                ...section,
                                tasks: section.tasks.map((task) =>
                                    task._id === taskToEdit._id
                                        ? { ...task, title: newTitle } // update the title directly
                                        : task
                                ),
                            };
                        });
                    
                        setData(updatedData);
                    
                        // 2. Backend update
                        await updateTaskTitle(taskToEdit._id, newTitle);
                    
                        // 3. Important: Close the modal only AFTER updating local and backend state
                        setTitleModalOpen(false);
                        setTaskToEdit(null);
                    }}
                    
                    
                />
            )}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={onDragEnd}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        width: "calc(100vw - 400px)",
                        overflowX: "auto",
                    }}
                >
                    {data.map((section) => (
                        <SortableContext
                            key={section._id}
                            items={section.tasks.map((task) => task._id)}
                            strategy={verticalListSortingStrategy}
                        >
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
                                            "& .MuiOutlinedInput-notchedOutline":
                                                { border: "unset" },
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
                                        onClick={() =>
                                            deleteSection(section._id)
                                        }
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
                                    />
                                ))}
                            </Box>
                        </SortableContext>
                    ))}
                </Box>
            </DndContext>
        </>
    );
}

export default Kanban;
