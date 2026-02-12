import React, { useState } from 'react';
// import axios from 'axios';
import { CircularProgress, Tooltip, Button, Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
// import { CONFIGS } from '../../configs';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface DeleteImageButtonProps {
    filename: string;
    onDelete: () => void;
}

const ButtonDeleteFile: React.FC<DeleteImageButtonProps> = ({ filename, onDelete }) => {
    const [loading, setLoading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!filename) return;

        setLoading(true);
        try {
            // await axios.delete(`${CONFIGS.uploadFileUrl}/${filename}`, {
            //   headers: {
            //     "x-api-key": CONFIGS.uploadFileApiKey,
            //   },
            // });
            onDelete();
        } catch (error: any) {
            console.error('Error uploading file:', error);
            const errorMessage = `Tidak dapat menghapus file ${error?.response?.data?.errorMessage}`;
            setUploadError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Tooltip title="Delete Image">
            <>
                <Button variant="outlined" onClick={handleDelete} startIcon={<DeleteIcon />}>
                    {loading ? <CircularProgress size={24} /> : 'Delete'}
                </Button>
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
            </>
        </Tooltip>
    );
};

export default ButtonDeleteFile;
