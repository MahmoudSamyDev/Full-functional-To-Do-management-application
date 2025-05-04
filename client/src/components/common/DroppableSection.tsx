import { useDroppable } from "@dnd-kit/core";
import { Box } from "@mui/material";
import { ReactNode } from "react";

interface Props {
    id: string;
    children: ReactNode;
}

function DroppableSection({ id, children }: Props) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <Box
            ref={setNodeRef}
            sx={{
                minWidth: "300px",
                maxWidth: "300px",
                marginRight: "10px",
                padding: "10px",
                borderRadius: "8px",
            }}
        >
            {children}
        </Box>
    );
};

export default DroppableSection;
