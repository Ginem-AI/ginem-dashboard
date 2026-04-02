import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { useHttp } from "../../hooks/http";

type QRData = {
  connectionStatus: string;
  timedOut: boolean;
  mimeType: string;
  qrImageBase64: string;
};

type StatusData = {
  connectionStatus: string;
  lastDisconnectReason?: string;
};

export default function SettingsView() {
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [status, setStatus] = useState<StatusData | null>(null);
  const [selectedModel, setSelectedModel] = useState("gpt-4o");

  const [loadingQR, setLoadingQR] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { handleGetRequest, handlePostRequest } = useHttp();

  const llmModels = [
    { provider: "OpenAI", models: ["gpt-4o", "gpt-4-turbo"] },
    { provider: "DeepSeek", models: ["deepseek-chat", "deepseek-coder"] },
    { provider: "Anthropic", models: ["claude-3-opus", "claude-3-sonnet"] },
  ];

  const fetchStatus = async () => {
    try {
      setLoadingStatus(true);
      const res = await handleGetRequest({
        path: "/whatsapp/connection-status",
      });
      setStatus(res);
    } catch {
      setError("Failed to load connection status");
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleConnect = async () => {
    try {
      setLoadingQR(true);
      setError(null);

      const res = await handleGetRequest({
        path: "/whatsapp/connect?type=base64",
      });

      setQrData(res);
      setStatus((prev) => ({
        ...prev!,
        connectionStatus: "connecting",
      }));
    } catch {
      setError("Failed to connect");
    } finally {
      setLoadingQR(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoadingQR(true);
      await handlePostRequest({
        path: "/whatsapp/disconnect",
        body: {},
      });

      setQrData(null);
      await fetchStatus();
    } catch {
      setError("Failed to disconnect");
    } finally {
      setLoadingQR(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    if (status?.connectionStatus !== "connecting") return;

    const interval = setInterval(async () => {
      try {
        const res = await handleGetRequest({
          path: "/whatsapp/connect?type=base64",
        });
        setQrData(res);
      } catch {}
    }, 5000);

    return () => clearInterval(interval);
  }, [status?.connectionStatus]);

  const getStatusColor = () => {
    switch (status?.connectionStatus) {
      case "connected":
        return "success";
      case "connecting":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Box marginBottom={5}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* ================= WHATSAPP ================= */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                WhatsApp Connection
              </Typography>

              {/* Status */}
              {loadingStatus ? (
                <CircularProgress size={20} />
              ) : (
                status && (
                  <Stack spacing={1} mb={2}>
                    <Chip
                      label={status.connectionStatus.toUpperCase()}
                      color={getStatusColor() as any}
                    />

                    {status.lastDisconnectReason && (
                      <Typography variant="caption" color="text.secondary">
                        {status.lastDisconnectReason}
                      </Typography>
                    )}
                  </Stack>
                )
              )}

              <Divider sx={{ mb: 3 }} />

              {/* QR */}
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={260}
                mb={3}
                sx={{
                  border: "1px dashed #ccc",
                  borderRadius: 3,
                  backgroundColor: "background.default",
                }}
              >
                {loadingQR ? (
                  <CircularProgress />
                ) : qrData && status?.connectionStatus === "connecting" ? (
                  <Box
                    component="img"
                    src={`data:${qrData.mimeType};base64,${qrData.qrImageBase64}`}
                    sx={{ width: 220, height: 220 }}
                  />
                ) : (
                  <Typography color="text.secondary">
                    Click connect to start pairing
                  </Typography>
                )}
              </Box>

              {error && <Alert severity="error">{error}</Alert>}

              {/* Actions */}
              <Stack direction="row" spacing={2} mt={2}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleConnect}
                  disabled={
                    loadingQR || status?.connectionStatus === "connected"
                  }
                >
                  Connect
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={handleDisconnect}
                  disabled={
                    loadingQR || status?.connectionStatus !== "connected"
                  }
                >
                  Disconnect
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ================= LLM ================= */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                LLM Settings
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={2}>
                Choose which model will be used for AI responses.
              </Typography>

              <FormControl fullWidth>
                <InputLabel>Select Model</InputLabel>
                <Select
                  value={selectedModel}
                  label="Select Model"
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  {llmModels.map((group) => (
                    <Box key={group.provider}>
                      <MenuItem disabled>
                        <strong>{group.provider}</strong>
                      </MenuItem>
                      {group.models.map((model) => (
                        <MenuItem key={model} value={model}>
                          {model}
                        </MenuItem>
                      ))}
                    </Box>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
