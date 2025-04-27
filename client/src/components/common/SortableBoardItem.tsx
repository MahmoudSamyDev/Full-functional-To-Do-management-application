import { ListItemButton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Board_TP } from "../../Types";

type Props = {
    item: Board_TP;
    isActive: boolean;
};

function SortableBoardItem({ item, isActive }: Props) {

    return (
        <ListItemButton
            selected={isActive}
            component={Link}
            to={`/boards/${item._id}`}
            sx={{
                pl: "20px",
                cursor: "grab",
            }}
        >
            <Typography
                variant="body2"
                fontWeight="700"
                sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {item.title}
            </Typography>
        </ListItemButton>
    );
};

export default SortableBoardItem;
