import { useState } from "react";
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
import { useApiGet, useApiPostMutation } from "@/hooks/api";
import { apiClient } from "@/services/api/client";
import { useApiErrorHandler } from "@/hooks/api/useApiErrorHandler";

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
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectLoading, setConnectLoading] = useState(false);
  const onError = useApiErrorHandler();

  const {
    data: status,
    isLoading: loadingStatus,
    refetch: refetchStatus,
  } = useApiGet<StatusData>("/whatsapp/connection-status");

  const isConnecting = connecting || status?.connectionStatus === "connecting";

  const { data: qrData, isFetching: loadingQR } = useApiGet<QRData>(
    "/whatsapp/connect?type=base64",
    {
      enabled: isConnecting,
      refetchInterval: isConnecting ? 5000 : false,
    },
  );

  const disconnect = useApiPostMutation({
    invalidateGetPaths: ["/whatsapp/connection-status"],
    onSuccess: () => {
      setConnecting(false);
      refetchStatus();
    },
  });

  const llmModels = [
    { provider: "OpenAI", models: ["gpt-4o", "gpt-4-turbo"] },
    { provider: "DeepSeek", models: ["deepseek-chat", "deepseek-coder"] },
    { provider: "Anthropic", models: ["claude-3-opus", "claude-3-sonnet"] },
  ];

  const handleConnect = async () => {
    try {
      setConnectLoading(true);
      setError(null);
      await apiClient.get<QRData>("/whatsapp/connect?type=base64");
      setConnecting(true);
      refetchStatus();
    } catch (err) {
      onError(err);
      setError("Failed to connect");
    } finally {
      setConnectLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setError(null);
      await disconnect.mutateAsync({
        path: "/whatsapp/disconnect",
        body: {},
      });
    } catch {
      setError("Failed to disconnect");
    }
  };

  const getStatusColor = () => {
    const connectionStatus = isConnecting
      ? "connecting"
      : status?.connectionStatus;
    switch (connectionStatus) {
      case "connected":
        return "success";
      case "connecting":
        return "warning";
      default:
        return "default";
    }
  };

  const displayStatus = isConnecting
    ? "connecting"
    : (status?.connectionStatus ?? "disconnected");

  const showQrLoading =
    connectLoading || (isConnecting && loadingQR && !qrData);

  return (
    <Box marginBottom={5}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                WhatsApp Connection
              </Typography>

              {loadingStatus ? (
                <CircularProgress size={20} />
              ) : (
                status && (
                  <Stack spacing={1} mb={2}>
                    <Chip
                      label={displayStatus.toUpperCase()}
                      color={
                        getStatusColor() as "default" | "success" | "warning"
                      }
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
                {showQrLoading ? (
                  <CircularProgress />
                ) : qrData && isConnecting ? (
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

              <Stack direction="row" spacing={2} mt={2}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleConnect}
                  disabled={
                    connectLoading ||
                    disconnect.isPending ||
                    status?.connectionStatus === "connected"
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
                    connectLoading ||
                    disconnect.isPending ||
                    status?.connectionStatus !== "connected"
                  }
                >
                  Disconnect
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

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
