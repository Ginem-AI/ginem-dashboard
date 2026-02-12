import { useEffect, useState } from 'react';
import { Button, Card, Typography, Box, TextField, Stack } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useHttp } from '../../hooks/http';
import { IUserUpdateRequestModel } from '../../models/userModel';
import BreadCrumberStyle from '../../components/breadcrumb/Index';
import { IconMenus } from '../../components/icon';

export default function EditProfileView() {
    const { handleGetRequest, handleUpdateRequest } = useHttp();
    const navigate = useNavigate();
    const { userId } = useParams();

    const [user, setUser] = useState<IUserUpdateRequestModel>({
        userId: userId!,
        userName: '',
        userPassword: '',
    });

    const handleSubmit = async () => {
        try {
            await handleUpdateRequest({
                path: '/my-profiles',
                body: user,
            });
            navigate('/my-profile');
        } catch (error: unknown) {
            console.log(error);
        }
    };

    const getMyProfile = async () => {
        const result = await handleGetRequest({
            path: '/my-profile',
        });
        setUser(result);
    };

    useEffect(() => {
        getMyProfile();
    }, []);

    return (
        <>
            <BreadCrumberStyle
                navigation={[
                    {
                        label: 'Profile',
                        link: '/profile',
                        icon: <IconMenus.profile fontSize="small" />,
                    },
                    {
                        label: 'Edit',
                        link: '/profile/' + userId,
                    },
                ]}
            />
            <Card
                sx={{
                    mt: 5,
                    p: 8,
                }}
            >
                <Typography variant="h4" marginBottom={5} color="primary" fontWeight={'bold'}>
                    Edit My Profile
                </Typography>
                <Box
                    component="form"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <TextField
                        label="User Name"
                        id="outlined-start-adornment"
                        sx={{ m: 1 }}
                        value={user?.userName}
                        type="text"
                        onChange={(e) => {
                            setUser({
                                ...user,
                                userName: e.target.value,
                            });
                        }}
                    />
                    <TextField
                        label="password"
                        id="outlined-start-adornment"
                        sx={{ m: 1 }}
                        value={user?.userPassword}
                        type="password"
                        onChange={(e) => {
                            setUser({
                                ...user,
                                userPassword: e.target.value,
                            });
                        }}
                    />

                    <Stack direction={'row'} justifyContent="flex-end">
                        <Button
                            sx={{
                                m: 1,
                                width: '25ch',
                                backgroundColor: 'dodgerblue',
                                color: '#FFF',
                                fontWeight: 'bold',
                            }}
                            variant={'contained'}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Stack>
                </Box>
            </Card>
        </>
    );
}
