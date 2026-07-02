import { useState } from "react";
import {
    Alert,
    Avatar,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    Typography,
    Radio,
} from "@mui/material";
import type { ScanResult } from "../types/scan-result";
import type { OrderIntakeItem } from "../types/orderIntakeItem";

interface ScanResultDialogProps {
    open: boolean;
    results: ScanResult[];
    onClose: () => void;
    onConfirm: (newIntakeItem: OrderIntakeItem) => void;
    orderId?: number;
}

export default function ScanResultDialog({
    open,
    results,
    onClose,
    onConfirm,
    orderId,
}: ScanResultDialogProps) {
    const [selected, setSelected] = useState<ScanResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const API_URL = import.meta.env.VITE_API_URL;

    const confirmSelection = async () => {
        if (!selected) return;

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/order-intake-item`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    UPC: selected.upc.toString(),
                    OrderId: orderId
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to confirm product.");
            }

            const newIntakeItem = await response.json() as OrderIntakeItem;
            
            onConfirm(newIntakeItem);
        } catch (err) {
            console.error(err);
            setError("Unable to confirm product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>Products Found</DialogTitle>

            <DialogContent dividers>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <List disablePadding>
                    {results.map((item) => (
                        <ListItemButton
                            key={item.upc}
                            selected={selected?.upc === item.upc}
                            onClick={() => setSelected(item)}
                            sx={{
                                borderRadius: 2,
                                mb: 1,
                            }}
                        >
                            <Radio
                                checked={selected?.upc === item.upc}
                                tabIndex={-1}
                                disableRipple
                                sx={{ mr: 1 }}
                            />

                            <ListItemAvatar>
                                <Avatar
                                    variant="rounded"
                                    src={item.imageUrl}
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        mr: 1,
                                    }}
                                />
                            </ListItemAvatar>

                            <ListItemText
                                primary={
                                    <Typography>{item.description}</Typography>
                                }
                                secondary={
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        UPC: {item.upc}
                                    </Typography>
                                }
                            />
                        </ListItemButton>
                    ))}
                </List>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    disabled={!selected || loading}
                    onClick={confirmSelection}
                >
                    {loading ? (
                        <CircularProgress size={22} color="inherit" />
                    ) : (
                        "Confirm"
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
