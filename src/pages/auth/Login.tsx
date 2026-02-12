import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  Container,
  TextField,
  Divider,
  Stack,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import { useHttp } from "../../hooks/http";
import { useToken } from "../../hooks/token";
import { IUserLoginRequestModel } from "../../models/userModel";

export default function LoginView() {
  const { handlePostRequest } = useHttp();
  const { setToken } = useToken();
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const payload: IUserLoginRequestModel = {
        userEmail,
        userPassword,
      };

      const result = await handlePostRequest({
        path: "/auth/login/users",
        body: payload,
      });

      if (result) {
        setToken(result.data.accessToken);

        navigate("/");

        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoginWithGoogle = () => {
    console.log("Login with Google (dummy)");
    // nanti arahkan ke OAuth Google
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
              sx={{
                letterSpacing: 2,
                color: "text.secondary",
              }}
            >
              NEURO AI
            </Typography>
            <Typography variant="h4" fontWeight={800}>
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Masuk untuk mengakses dashboard dan fitur Neuro AI.
            </Typography>
          </Stack>

          {/* Form */}
          <Stack spacing={2}>
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
              autoComplete="current-password"
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
              onClick={handleSubmit}
            >
              Login
            </Button>
          </Stack>

          {/* Divider */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          {/* Google Login */}
          <Button
            fullWidth
            size="large"
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{
              borderRadius: 2,
              py: 1.2,
              fontWeight: 600,
              textTransform: "none",
            }}
            onClick={handleLoginWithGoogle}
          >
            Login with Google
          </Button>

          {/* Footer link */}
          <Stack
            direction="row"
            justifyContent="center"
            spacing={0.5}
            sx={{ mt: 3 }}
          >
            <Typography variant="body2" color="text.secondary">
              Belum punya akun?
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                cursor: "pointer",
                color: "primary.main",
              }}
              onClick={() => navigate("/register")}
            >
              Daftar sekarang
            </Typography>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
