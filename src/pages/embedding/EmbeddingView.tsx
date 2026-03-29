import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useState } from "react";
import { useHttp } from "../../hooks/http";
import BreadCrumberStyle from "../../components/breadcrumb/Index";
import { IconMenus } from "../../components/icon";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SendIcon from "@mui/icons-material/Send";

interface IndexObject {
  text: string;
  source: string;
}

const initialObject: IndexObject = {
  text: "",
  source: "pdf",
};

const SOURCE_OPTIONS = ["pdf", "text"];

export default function EmbeddingView() {
  const { handlePostRequest } = useHttp();
  const [objects, setObjects] = useState<IndexObject[]>([{ ...initialObject }]);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const addObject = () => {
    setObjects((prev) => [...prev, { ...initialObject }]);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const removeObject = (index: number) => {
    if (objects.length <= 1) return;
    setObjects((prev) => prev.filter((_, i) => i !== index));
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const updateObject = (
    index: number,
    field: keyof IndexObject,
    value: string,
  ) => {
    setObjects((prev) =>
      prev.map((obj, i) => (i === index ? { ...obj, [field]: value } : obj)),
    );
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleSubmit = async () => {
    const valid = objects.filter((o) => o.text.trim());
    if (valid.length === 0) {
      setErrorMessage("Add at least one object with non-empty text.");
      return;
    }
    try {
      setSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      await handlePostRequest({
        path: "/weaviate/index",
        body: {
          objects: valid.map((o) => ({
            text: o.text.trim(),
            source: o.source.trim() || "pdf",
          })),
        },
      });
      setSuccessMessage(
        `Successfully indexed ${valid.length} object(s) to Weaviate.`,
      );
      setObjects([{ ...initialObject }]);
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to index data.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ pb: 2 }}>
      <BreadCrumberStyle
        navigation={[
          {
            label: "Embedding",
            link: "/vector-indexes",
            icon: <IconMenus.vectorIndexes fontSize="small" />,
          },
          { label: "Index to Weaviate", link: undefined },
        ]}
      />

      <Paper variant="outlined" sx={{ p: { xs: 1.5, md: 2 } }}>
        <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>
          Index to Weaviate
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Add document content for vector indexing. Each object requires text
          and a source type.
        </Typography>

        {errorMessage && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setErrorMessage(null)}
          >
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccessMessage(null)}
          >
            {successMessage}
          </Alert>
        )}

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={3}>
          {objects.map((obj, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{ p: 2, borderRadius: 2 }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1.5 }}
              >
                <Typography variant="subtitle2" fontWeight={700}>
                  Object {index + 1}
                </Typography>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeObject(index)}
                  disabled={objects.length <= 1}
                  aria-label="Remove object"
                >
                  <DeleteOutlinedIcon fontSize="small" />
                </IconButton>
              </Stack>
              <Stack spacing={2}>
                <TextField
                  size="small"
                  label="Text"
                  required
                  fullWidth
                  multiline
                  minRows={3}
                  placeholder="Sample document content for indexing."
                  value={obj.text}
                  onChange={(e) => updateObject(index, "text", e.target.value)}
                />
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel id={`source-label-${index}`}>Source</InputLabel>
                  <Select
                    labelId={`source-label-${index}`}
                    id={`source-${index}`}
                    value={obj.source}
                    label="Source"
                    onChange={(e) =>
                      updateObject(index, "source", e.target.value)
                    }
                  >
                    {SOURCE_OPTIONS.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Paper>
          ))}

          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addObject}
              disabled={submitting}
            >
              Add object
            </Button>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Indexing…" : "Index to Weaviate"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
