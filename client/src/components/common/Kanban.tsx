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
import DroppableSection from "./DroppableSection";

// DND Imports
import {
    DndContext,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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

    // DND sensor setup
    const sensors = useSensors(useSensor(PointerSensor));

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
                        task._id === taskId
                            ? { ...task, title: newTitle }
                            : task
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
                        task._id === taskId
                            ? { ...task, title: task.title }
                            : task
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

    // Drag and drop functions
    // ✨ MAIN DRAG HANDLER
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!active || !over) return;

        const activeTaskId = active.id.toString();
        const overId = over.id.toString();

        let sourceSectionId: string | null = null;
        let destinationSectionId: string | null = null;

        for (const section of data) {
            if (section.tasks.find((task) => task._id === activeTaskId)) {
                sourceSectionId = section._id;
            }
            if (
                section._id === overId || // 👈 handles drop on section container
                section.tasks.find((task) => task._id === overId)
            ) {
                destinationSectionId = section._id;
            }
        }

        if (!sourceSectionId || !destinationSectionId) return;

        const updatedData = [...data];
        const sourceSection = updatedData.find(
            (s) => s._id === sourceSectionId
        )!;
        const destinationSection = updatedData.find(
            (s) => s._id === destinationSectionId
        )!;

        const activeIndex = sourceSection.tasks.findIndex(
            (task) => task._id === activeTaskId
        );

        const activeTask = sourceSection.tasks[activeIndex];

        // Remove from source
        sourceSection.tasks.splice(activeIndex, 1);

        let overIndex = destinationSection.tasks.findIndex(
            (task) => task._id === overId
        );

        if (sourceSectionId === destinationSectionId) {
            if (overIndex < 0) overIndex = 0; // drop in empty section or end
            sourceSection.tasks.splice(overIndex, 0, activeTask);
        } else {
            if (overIndex < 0) overIndex = destinationSection.tasks.length;
            destinationSection.tasks.splice(overIndex, 0, activeTask);
        }

        setData(updatedData);

        await taskApi.updatePosition(boardId, {
            resourceList: sourceSection.tasks,
            destinationList: destinationSection.tasks,
            resourceColumnId: sourceSectionId,
            destinationColumnId: destinationSectionId,
        });
    };

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
                        const success = await updateTaskTitle(
                            taskToEdit._id,
                            newTitle
                        );
                        if (success) {
                            setTitleModalOpen(false);
                            setTaskToEdit(null);
                        }
                    }}
                />
            )}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        width: "calc(100vw - 400px)",
                        overflowX: "auto",
                        height: "70vh",
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
                            <DroppableSection id={section._id}>
                                <SortableContext
                                    id={section._id}
                                    items={section.tasks.map(
                                        (task) => task._id
                                    )}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {section.tasks.length === 0 ? (
                                        <Box
                                            sx={{
                                                height: "60px",
                                                border: "2px dashed #ccc",
                                                borderRadius: "4px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#aaa",
                                                fontSize: "0.875rem",
                                                fontStyle: "italic",
                                            }}
                                        >
                                            Drop here
                                        </Box>
                                    ) : (
                                        section.tasks.map((task) => (
                                            <SortableTaskCard
                                                key={task._id}
                                                task={task}
                                                onEditTitle={(task) => {
                                                    setTaskToEdit(task);
                                                    setTitleModalOpen(true);
                                                }}
                                                onDelete={deleteTask}
                                            />
                                        ))
                                    )}
                                </SortableContext>
                            </DroppableSection>
                        </Box>
                    ))}
                </Box>
            </DndContext>
        </>
    );
}
export default Kanban;
