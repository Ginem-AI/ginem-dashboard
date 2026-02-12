/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react';
import axios from 'axios';
import { CONFIGS } from '../../configs';
import { Button, Typography, Box, LinearProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface ButtonUploadFileTypes {
    onUpdate: (url: string) => void;
    filename: string;
}

export default function ButtonUpdateFile({ onUpdate, filename }: ButtonUploadFileTypes) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        const MAX_FILE_SIZE = 2048; // 2MB

        if (!selectedFile) {
            setUploadError('Silahkan pilih file terlebih dahulu');
            setUploadProgress(null);
            setUploadSuccess(false);
            setSelectedFileName(null);
            return;
        }

        if (selectedFile.size / 1024 > MAX_FILE_SIZE) {
            setUploadError('Ukuran file maksimum adalah 2MB');
            setUploadProgress(null);
            setUploadSuccess(false);
            setSelectedFileName(selectedFile.name);
            return;
        }

        setUploadError(null);
        setUploadProgress(0);
        setUploadSuccess(false);
        setSelectedFileName(selectedFile.name);

        const formData = new FormData();
        formData.append('file', selectedFile);

        console.log(formData);

        try {
            const result = await axios.post(CONFIGS.uploadFileUrl, formData, {
                headers: {
                    'x-api-key': CONFIGS.uploadFileApiKey,
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total!
                    );
                    setUploadProgress(progress);
                },
            });

            await axios.delete(`${CONFIGS.uploadFileUrl}/${filename}`, {
                headers: {
                    'x-api-key': CONFIGS.uploadFileApiKey,
                },
            });

            setUploadProgress(null);
            setUploadSuccess(true);

            console.log(result.data);
            onUpdate(result.data.url);
        } catch (error: any) {
            console.error('Error uploading file:', error);
            setUploadProgress(null);
            setUploadSuccess(false);
            const errorMessage =
                'Tidak dapat mengunggah file' +
                (error.response?.data?.errorMessage ? `: ${error.response.data.errorMessage}` : '');
            setUploadError(errorMessage);
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset file input
            }
        }
    };

    const handleClickFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                style={{ display: 'none' }}
            />
            <Button
                variant="outlined"
                component="span"
                onClick={handleClickFileInput}
                startIcon={<CloudUploadIcon />}
                disabled={uploadProgress !== null}
            >
                Pilih File
            </Button>
            {selectedFileName && !uploadSuccess && !uploadError && (
                <Typography variant="caption" mt={1}>
                    Memilih: {selectedFileName}
                </Typography>
            )}
            {uploadProgress !== null && (
                <Box sx={{ width: '100%', mt: 1 }}>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                    <Typography variant="caption">{uploadProgress}%</Typography>
                </Box>
            )}
            {uploadError && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mt: 1,
                        color: (theme) => theme.palette.error.main,
                    }}
                >
                    <ErrorOutlineIcon sx={{ mr: 0.5 }} />
                    <Typography variant="caption">{uploadError}</Typography>
                </Box>
            )}
            {uploadSuccess && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mt: 1,
                        color: (theme) => theme.palette.success.main,
                    }}
                >
                    <CheckCircleOutlineIcon sx={{ mr: 0.5 }} />
                    <Typography variant="caption">Berhasil di update!</Typography>
                </Box>
            )}
        </Box>
    );
}
