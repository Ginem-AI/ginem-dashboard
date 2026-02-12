import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useHttp } from "../../hooks/http";

interface RegisterPayload {
  userName: string;
  userEmail: string;
  userPassword: string;
}

export default function RegisterView() {
  const { handlePostRequest } = useHttp();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!userName || !userEmail || !userPassword) return;
    try {
      setSubmitting(true);
      const payload: RegisterPayload = {
        userName,
        userEmail,
        userPassword,
      };

      const res = await handlePostRequest({
        path: "/auth/register/users",
        body: payload,
      });

      if (res) {
        navigate("/");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        background:
          theme.palette.mode === "dark"
            ? "radial-gradient(1200px 600px at 10% -10%, rgba(56,189,248,0.06), transparent 45%), #020617"
            : "#F5F7FB",
      })}
    >
      <Container maxWidth="sm">
        <Card
          sx={(theme) => ({
            width: "100%",
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            border: `1px solid ${
              theme.palette.mode === "dark"
                ? "rgba(148,163,184,0.28)"
                : "rgba(148,163,184,0.18)"
            }`,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 18px 40px rgba(15,23,42,0.9)"
                : "0 18px 40px rgba(15,23,42,0.08)",
          })}
        >
          {/* Header */}
          <Stack spacing={1} mb={3} textAlign="center">
            <Typography
              variant="overline"
              sx={{ letterSpacing: 2, color: "text.secondary" }}
            >
              NEURO AI
            </Typography>
            <Typography variant="h4" fontWeight={800}>
              Create account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Daftar untuk mulai menggunakan Neuro AI.
            </Typography>
          </Stack>

          {/* Form */}
          <Stack spacing={2}>
            <TextField
              label="Nama lengkap"
              value={userName}
              size="medium"
              fullWidth
              onChange={(e) => setUserName(e.target.value)}
            />
            <TextField
              label="E-mail"
              value={userEmail}
              size="medium"
              fullWidth
              type="email"
              autoComplete="email"
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <TextField
              label="Password"
              value={userPassword}
              size="medium"
              type="password"
              fullWidth
              autoComplete="new-password"
              onChange={(e) => setUserPassword(e.target.value)}
            />

            <Button
              fullWidth
              size="large"
              variant="contained"
              sx={{
                mt: 1,
                fontWeight: 700,
                borderRadius: 2,
                py: 1.2,
              }}
              disabled={submitting}
              onClick={handleSubmit}
            >
              {submitting ? "Mendaftarkan..." : "Daftar"}
            </Button>
          </Stack>

          {/* Footer link */}
          <Stack
            direction="row"
            justifyContent="center"
            spacing={0.5}
            sx={{ mt: 3 }}
          >
            <Typography variant="body2" color="text.secondary">
              Sudah punya akun?
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                cursor: "pointer",
                color: "primary.main",
              }}
              onClick={() => navigate("/login")}
            >
              Login di sini
            </Typography>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
