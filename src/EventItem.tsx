import React, { FC, JSX } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { SxProps } from "@mui/system";
import { Theme } from "@mui/material/styles";
import { Event } from "./types";

interface EventItemProps {
  event: Event;
  rowId: string | number;
  sx?: SxProps<Theme>;
  boxSx?: SxProps;
  isMonthMode?: boolean;
  elevation?: number;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
}

const EventItem: FC<EventItemProps> = ({
  event,
  rowId,
  sx,
  boxSx,
  elevation,
  isMonthMode,
  onClick,
  onDragStart,
}): JSX.Element => (
  <Paper
    sx={ sx }
    draggable
    onClick={ onClick }
    onDragStart={ onDragStart }
    elevation={ elevation || 0 }
    key={ `item-d-${ event?.id }-${ rowId }` }
  >
    <Box sx={ boxSx }>
      { isMonthMode &&
        <Typography variant="caption" sx={ { fontSize: 8 } }>
          { event?.startHour } - { event?.endHour }
        </Typography>
      }
      <Typography variant="body2" sx={ { fontSize: 11 } }>
        { event?.label }
      </Typography>
    </Box>
  </Paper>
);

export default EventItem;