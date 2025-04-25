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

        const activeId = active.id;
        const overId = over.id;

        let sourceSectionId: string | null = null;
        let destinationSectionId: string | null = null;
        let movedTask: Task | null = null;

        for (const section of data) {
            if (section.tasks.find((t) => t._id === activeId)) {
                sourceSectionId = section._id;
                movedTask =
                    section.tasks.find((t) => t._id === activeId) || null;
            }
            if (section.tasks.find((t) => t._id === overId)) {
                destinationSectionId = section._id;
            }
        }

        if (!sourceSectionId || !destinationSectionId || !movedTask) return;

        const updatedData = [...data];

        const sourceSectionIndex = updatedData.findIndex(
            (s) => s._id === sourceSectionId
        );
        const destinationSectionIndex = updatedData.findIndex(
            (s) => s._id === destinationSectionId
        );

        const sourceTasks = [...updatedData[sourceSectionIndex].tasks].filter(
            (t) => t._id !== activeId
        );
        const destinationTasks = [
            ...updatedData[destinationSectionIndex].tasks,
        ];
        const overIndex = destinationTasks.findIndex((t) => t._id === overId);

        // insert at right place
        destinationTasks.splice(overIndex, 0, movedTask);

        updatedData[sourceSectionIndex].tasks = sourceTasks;
        updatedData[destinationSectionIndex].tasks = destinationTasks;

        setData(updatedData);

        try {
            await taskApi.updatePosition(boardId, {
                resourceColumnId: sourceSectionId,
                destinationColumnId: destinationSectionId,
                resourceList: sourceTasks,
                destinationList: destinationTasks,
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
            const updatedTask = await taskApi.update(boardId, taskId, {
                title: newTitle,
            });
            setData((prevData) =>
                prevData.map((section) => {
                    if (section._id !== updatedTask.board) return section;
                    const updatedTasks = section.tasks.map((task) =>
                        task._id === updatedTask._id ? updatedTask : task
                    );
                    return { ...section, tasks: updatedTasks };
                })
            );
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

                        setData((prevData) =>
                            prevData.map((section) => {
                                if (section._id !== taskToEdit.board)
                                    return section;

                                const updatedTasks = section.tasks.map((task) =>
                                    task._id === taskToEdit._id
                                        ? { ...task, title: newTitle }
                                        : task
                                );

                                return { ...section, tasks: updatedTasks };
                            })
                        );

                        try {
                            await updateTaskTitle(taskToEdit._id, newTitle);
                            setTitleModalOpen(false);
                            setTaskToEdit(null);
                        } catch {
                            alert("Failed to update task title");
                        }
                    }}
                />
            )}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={onDragEnd}
            >
                <SortableContext
                    items={data.flatMap((section) =>
                        section.tasks.map((task) => task._id)
                    )}
                    strategy={verticalListSortingStrategy}
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
                                                {
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
                        ))}
                    </Box>
                </SortableContext>
            </DndContext>
        </>
    );
}

export default Kanban;
