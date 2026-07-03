import { useEffect, useRef, useState } from "react";
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Container,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import ScanResultDialog from "./scan-results";
import type { ScanResult } from "../types/scan-result";
import type { Order } from "../types/order";

export default function InventoryScan() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [loading, setLoading] = useState(false);

    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const [resultsShowing, setResultsShowing] = useState(false);
    const [scanResults, setScanResults] = useState<ScanResult[]>([]);

    const [selectedOrder, setSelectedOrder] = useState<Order | null>();
    const [orders, setOrders] = useState<Order[]>([]);

    const showToast = (message: string) => {
        setToastMessage(message);
        setToastOpen(true);
    };

    const handleClose = () => {
        setToastOpen(false);
    };

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        startCamera();

        loadOrders();
    }, []);

    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;

            videoRef.current.play().catch(console.error);
        }
    }, [stream]);

	const loadOrders = async () => {
		const response = await fetch(`${API_URL}/order`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Order fetch failed");
        }

        setOrders(await response.json());
	};

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment",
                },
            });

            setStream(mediaStream);
        } catch (err) {
            console.error(err);
        }
    };

    const capturePhoto = async (): Promise<void> => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) {
            return;
        }

        const context = canvas.getContext("2d");

        if (!context) {
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

        const blob = await (await fetch(dataUrl)).blob();

        await uploadImage(blob);
    };

    const uploadImage = async (blob: Blob): Promise<void> => {
        setLoading(true);

        try {
            const formData = new FormData();

            formData.append("file", blob, "capture.jpg");

            const response = await fetch(`${API_URL}/product-lookup/scan`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const result = (await response.json()) as ScanResult[];

            setScanResults(result);

            if (result.length > 0) {
                setResultsShowing(true);
            } else {
                setResultsShowing(false);
                showToast("Product not found.");
            }
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Snackbar
                open={toastOpen}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                >
                    {toastMessage}
                </Alert>
            </Snackbar>

            <Typography variant="h5" gutterBottom>
                Order Intake Scanner
            </Typography>

            <Autocomplete
                options={orders}
                value={selectedOrder}
                onChange={(_, newValue) => setSelectedOrder(newValue)}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select Your Order"
                        placeholder="Search..."
                    />
                )}
                fullWidth
				sx={{ marginBottom: 2, marginTop: 2 }}
            />

            {stream && (
                <Box>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{
                            width: "100%",
                            minHeight: "300px",
                            background: "black",
                        }}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={capturePhoto}
                        disabled={!selectedOrder}
                    >
                        Scan
                    </Button>
                </Box>
            )}

            {loading && <CircularProgress />}

            <canvas ref={canvasRef} style={{ display: "none" }} />

            <ScanResultDialog
                onClose={() => setResultsShowing(false)}
				onConfirm={(i) => {
					setResultsShowing(false);
					showToast(`${i.upc} has been added (${i.count} in stock)`)
				}}
                open={resultsShowing}
                results={scanResults}
				orderId={selectedOrder?.id}
            />
        </Container>
    );
}
