import { useState } from 'react';
import { Box, Button, LinearProgress, Typography } from '@mui/material';
import { useHttpFileUpload } from '../../hooks/http';

interface ButtonUploadZipProps {
    onUploaded?: (fileName: string) => void;
}

export default function ButtonUploadZip({ onUploaded }: ButtonUploadZipProps) {
    const { handleUploadZipFile } = useHttpFileUpload();

    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState<string | null>(null);

    // === Upload ZIP handler ===
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.zip')) {
            alert('Hanya file ZIP yang diperbolehkan.');
            e.target.value = '';
            return;
        }

        setFileName(file.name);
        setUploading(true);
        setProgress(0);

        try {
            // Simulasi progress upload manual
            const fakeProgress = setInterval(() => {
                setProgress((prev) => (prev < 90 ? prev + 10 : prev));
            }, 300);

            const result = await handleUploadZipFile(file);

            clearInterval(fakeProgress);
            setProgress(100);
            setTimeout(() => {
                setUploading(false);
                setProgress(0);
                if (onUploaded) onUploaded(result.fileName || file.name);
            }, 500);
        } catch (error) {
            console.error(error);
            alert('Gagal mengunggah file ZIP.');
            setUploading(false);
            setProgress(0);
        } finally {
            e.target.value = ''; // Reset input
        }
    };

    return (
        <Box sx={{ textAlign: 'center' }}>
            <Button variant="outlined" component="label" disabled={uploading}>
                Upload ZIP File
                <input type="file" hidden accept=".zip" onChange={handleFileChange} />
            </Button>

            {uploading && (
                <Box sx={{ mt: 2, width: '100%' }}>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ height: 8, borderRadius: 1 }}
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Mengunggah ZIP ({progress}%)
                    </Typography>
                    {fileName && (
                        <Typography variant="caption" color="text.secondary">
                            {fileName}
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    );
}
