import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";

export default function InventoryScan() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;

            videoRef.current.play().catch(console.error);
        }
    }, [stream]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'environment'
            }
            });

            setStream(mediaStream);
        } catch (err) {
            console.error(err);
        }
    };

  const stopCamera = (): void => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
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

    setCapturedImage(dataUrl);

    stopCamera();

    const blob = await (await fetch(dataUrl)).blob();

    await uploadImage(blob);
  };

  const uploadImage = async (blob: Blob): Promise<void> => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("file", blob, "capture.jpg");

      console.log(API_URL);

      const response = await fetch(
        `${API_URL}/inventory/scan`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();

      console.log("Upload successful", result);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Inventory Scanner
      </Typography>

      {!stream && (
        <Button
          variant="contained"
          fullWidth
          onClick={startCamera}
        >
          Scan
        </Button>
      )}

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
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={capturePhoto}
          >
            Capture
          </Button>
        </Box>
      )}

      {loading && (
        <CircularProgress />
      )}

      {capturedImage && (
            <Box>
                <Typography variant="subtitle2" gutterBottom>
                Captured Image
                </Typography>

                <img
                src={capturedImage}
                alt="Captured"
                style={{
                    width: "100%",
                    borderRadius: "12px",
                }}
                />
            </Box>
        )}

      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
      />
    </Container>
  );
}