import {
  Paper,
  Typography,
  Stack,
  Chip,
  Box,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CancelIcon from "@mui/icons-material/Cancel";
import type { OrderIntakeItemResponse } from "../types/orderIntakeItemResponse";

type Props = {
  item: OrderIntakeItemResponse;
};

export default function OrderIntakeItemRow({ item }: Props) {
  const complete = item.scannedCount === item.orderedCount;
  const missing = item.scannedCount === 0;
  const over = item.scannedCount > item.orderedCount;

  let color: "success" | "warning" | "error" = "warning";
  let icon = <WarningAmberIcon fontSize="small" />;

  if (complete) {
    color = "success";
    icon = <CheckCircleIcon fontSize="small" />;
  } else if (missing) {
    color = "error";
    icon = <CancelIcon fontSize="small" />;
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
      }}
    >
      {/* Top: product name + status */}
      <Stack
        sx={{
          direction: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography sx={{ fontWeight: 600 }}>{item.description}</Typography>

          <Typography variant="caption" color="text.secondary">
            UPC: {item.upc}
          </Typography>
        </Box>
      </Stack>

      {/* Ordered vs scanned */}
      <Typography
        sx={{
          variant: "body2",
          color: "text.secondary",
          marginTop: 1,
        }}
      >
        
      </Typography>

      <Stack>
        <Chip
          size="small"
          color={color}
          icon={icon}
          label={`Ordered: ${item.orderedCount} • Scanned: ${item.scannedCount}`}
        />
      </Stack>

      {/* Status message */}
      <Box sx={{ marginTop: 1 }}>
        {complete && (
          <Typography variant="caption" color="success.main">
            Complete
          </Typography>
        )}

        {!complete && !missing && !over && (
          <Typography variant="caption" color="warning.main">
            {item.orderedCount - item.scannedCount} remaining
          </Typography>
        )}

        {missing && (
          <Typography variant="caption" color="error.main">
            Not scanned yet
          </Typography>
        )}

        {over && (
          <Typography variant="caption" color="warning.main">
            +{item.scannedCount - item.orderedCount} extra scanned
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
