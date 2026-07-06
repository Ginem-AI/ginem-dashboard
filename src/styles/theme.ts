import { createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

export function createAppTheme(mode: PaletteMode) {
  return createTheme({
    palette: {
      mode,
      background: {
        default: mode === "dark" ? "#070A12" : "#FFFFFF",
        paper: mode === "dark" ? "#0E1320" : "#FFFFFF",
      },
    },
  });
}
