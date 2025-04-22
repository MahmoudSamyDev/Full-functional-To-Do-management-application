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
import TaskModal from "./TaskModal";
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
    const [selectedTask, setSelectedTask] = useState<Task | undefined>(
        undefined
    );
    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        setData(initialSections);
    }, [initialSections]);

    const onDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const sectionIndex = data.findIndex((section) =>
            section.tasks.find((task) => task._id === active.id)
        );

        const targetSectionIndex = data.findIndex((section) =>
            section.tasks.find((task) => task._id === over.id)
        );

        if (sectionIndex === -1 || targetSectionIndex === -1) return;

        const sourceSection = data[sectionIndex];
        const targetSection = data[targetSectionIndex];

        const activeTaskIndex = sourceSection.tasks.findIndex(
            (t) => t._id === active.id
        );
        const overTaskIndex = targetSection.tasks.findIndex(
            (t) => t._id === over.id
        );

        const sourceTasks = [...sourceSection.tasks];
        const destinationTasks = [...targetSection.tasks];

        const [movedTask] = sourceTasks.splice(activeTaskIndex, 1);
        destinationTasks.splice(overTaskIndex, 0, movedTask);

        const newData = [...data];
        newData[sectionIndex].tasks = sourceTasks;
        newData[targetSectionIndex].tasks = destinationTasks;
        setData(newData);

        try {
            await taskApi.updatePosition(boardId, {
                resourceColumnId: sourceSection._id,
                destinationColumnId: targetSection._id,
                resourceTask: sourceTasks,
                destinationTask: destinationTasks,
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

    const createTask = async (sectionId: string) => {
        try {
            const task = await taskApi.create(boardId, {
                columnId: sectionId,
                title: "",
            });
            const newData = [...data];
            const index = newData.findIndex((e) => e._id === sectionId);
            newData[index].tasks.unshift(task);
            setData(newData);
        } catch {
            alert("Failed to create task");
        }
    };

    const onUpdateTask = (task: Task) => {
        const newData = [...data];
        const sectionIndex = newData.findIndex((e) => e._id === task.board);
        const taskIndex = newData[sectionIndex].tasks.findIndex(
            (t) => t._id === task._id
        );
        newData[sectionIndex].tasks[taskIndex] = task;
        setData(newData);
    };

    const onDeleteTask = (task: Task) => {
        const newData = [...data];
        const sectionIndex = newData.findIndex((e) => e._id === task.board);
        const taskIndex = newData[sectionIndex].tasks.findIndex(
            (t) => t._id === task._id
        );
        newData[sectionIndex].tasks.splice(taskIndex, 1);
        setData(newData);
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
                                    background: "#f9f9f9",
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
                                        onClick={() => setSelectedTask(task)}
                                    />
                                ))}
                            </Box>
                        </SortableContext>
                    ))}
                </Box>
            </DndContext>

            <TaskModal
                task={selectedTask}
                boardId={boardId}
                onClose={() => setSelectedTask(undefined)}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
            />
        </>
    );
}

export default Kanban;
