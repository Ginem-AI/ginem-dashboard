import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    Typography,
    Box,
    LinearProgress,
    Modal,
    Tabs,
    Tab,
    Grid,
    Card,
    CardMedia,
    CardActions,
    IconButton,
    Tooltip,
    Pagination,
    Stack,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FolderIcon from '@mui/icons-material/Folder';
import { CONFIGS } from '../../configs';
import { useHttpFileUpload } from '../../hooks/http';

interface ButtonUploadFileTypes {
    onUpload: (urlOrName: string) => void;
}

interface FileItem {
    id: number;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function ButtonUploadWithOption({ onUpload }: ButtonUploadFileTypes) {
    const { handleGetFileUploadRequest } = useHttpFileUpload();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

    // Modal & tab states
    const [openModal, setOpenModal] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    // Gallery data
    const [tableData, setTableData] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // === Function to get gallery data ===
    const getTableData = async (pageNumber: number) => {
        try {
            setLoading(true);
            const result = await handleGetFileUploadRequest({
                path: '/',
                page: pageNumber - 1,
                size: 6, // tampilkan 9 item per halaman (3x3 grid)
                filter: { search: '' },
            });

            const data = result?.data || result; // antisipasi struktur API

            if (data?.items) {
                setTableData(data.items);
                setTotalPages(data.total_pages || 1);
            }
        } catch (err) {
            console.error('fetch uploads error', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (openModal && activeTab === 1) {
            getTableData(page);
        }
    }, [openModal, activeTab, page]);

    // === Handle File Upload ===
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

            setUploadProgress(null);
            setUploadSuccess(true);
            onUpload(result.data.url);
            setOpenModal(false);
        } catch (error: any) {
            console.error('Error uploading file:', error);
            setUploadProgress(null);
            setUploadSuccess(false);
            const errorMessage =
                'Tidak dapat mengunggah file' +
                (error.response?.data?.errorMessage ? `: ${error.response.data.errorMessage}` : '');
            setUploadError(errorMessage);
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleClickFileInput = () => fileInputRef.current?.click();

    // === Copy filename ===
    const handleCopy = (name: string) => {
        navigator.clipboard.writeText(name);
    };

    // === Ganti halaman ===
    const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <>
            {/* Tombol utama */}
            <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={() => setOpenModal(true)}
            >
                Upload File
            </Button>

            {/* Modal Pilihan Upload */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        p: 3,
                        width: 700,
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        boxShadow: 24,
                    }}
                >
                    <Tabs
                        value={activeTab}
                        onChange={(_, val) => setActiveTab(val)}
                        centered
                        sx={{ mb: 2 }}
                    >
                        <Tab label="Upload dari Komputer" icon={<CloudUploadIcon />} />
                        <Tab label="Pilih dari Galeri" icon={<FolderIcon />} />
                    </Tabs>

                    {/* === TAB 1: Upload === */}
                    {activeTab === 0 && (
                        <Box textAlign="center">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            <Button
                                variant="contained"
                                component="span"
                                onClick={handleClickFileInput}
                                startIcon={<CloudUploadIcon />}
                                disabled={uploadProgress !== null}
                            >
                                Pilih File
                            </Button>

                            {selectedFileName && !uploadSuccess && !uploadError && (
                                <Typography variant="caption" mt={1} display="block">
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
                                    <Typography variant="caption">Berhasil diunggah!</Typography>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* === TAB 2: Galeri === */}
                    {activeTab === 1 && (
                        <Box>
                            {loading ? (
                                <Typography textAlign="center">Memuat galeri...</Typography>
                            ) : (
                                <>
                                    <Grid container spacing={2}>
                                        {tableData.map((file) => (
                                            <Grid item xs={4} key={file.id}>
                                                <Card sx={{ borderRadius: 2 }}>
                                                    <CardMedia
                                                        component="img"
                                                        image={`${CONFIGS.uploadFileUrl}/${file.name}`}
                                                        alt={file.name}
                                                        sx={{
                                                            height: 120,
                                                            objectFit: 'cover',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => {
                                                            onUpload(file.name);
                                                            setOpenModal(false);
                                                        }}
                                                    />
                                                    <CardActions
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            p: 1,
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                maxWidth: 90,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            {file.name}
                                                        </Typography>
                                                        <Tooltip title="Salin nama file">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() =>
                                                                    handleCopy(file.name)
                                                                }
                                                            >
                                                                <ContentCopyIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </CardActions>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    {/* Pagination */}
                                    <Stack alignItems="center" mt={3}>
                                        <Pagination
                                            count={totalPages}
                                            page={page}
                                            onChange={handleChangePage}
                                            color="primary"
                                            shape="rounded"
                                        />
                                    </Stack>
                                </>
                            )}
                        </Box>
                    )}
                </Box>
            </Modal>
        </>
    );
}
