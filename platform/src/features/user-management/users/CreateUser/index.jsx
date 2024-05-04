import React, {useState} from "react";
import {Box, Button, CircularProgress, Stack} from "@mui/material";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import PageContainer from "@/components/container/PageContainer";
import Breadcrumb from "@/layouts/full/shared/breadcrumb/Breadcrumb";
import InputField from "@/components/forms/field-controller/InputField";
import PasswordField from "@/components/forms/field-controller/PasswordField";
import SelectField from "@/components/forms/field-controller/SelectField";
import ParentCard from "@/components/shared/ParentCard";
import systemApi from "@/services/apis/system.api";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import MultiSelectField from "@/components/forms/field-controller/MultiSelectField.jsx";
import {useSelector} from "react-redux";


const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        to: "/user-management/users",
        title: "Users",
    },
    {
        title: "Add New User",
    },
];

const FormLayouts = () => {

    const navigate = useNavigate();
    const system = useSelector((state) => state.system);
    const {userProfile={}} = system;
    const listRoles = (userProfile?.roles?.data ||[]).map((item) => {
        return item?.name
    });

    const isAdminRole = listRoles.includes("Administrator") || listRoles.includes("Manager");

    const {listRole=[], listAllPermission=[]} = system||{};
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup
            .string()
            .min(8, 'Password must be at least 8 characters')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/,
                'Password must contain at least one uppercase letter, one lowercase letter, and one symbol'
            )
            .required('Password is required'),
        password_confirmation: Yup
            .string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Password confirmation is required'),
        roles: Yup.array().min(1, "This field is not empty"),
        status: Yup.string().required("Status is required"),
    });

    const {handleSubmit, control} = useForm({
        reValidateMode: "onChange",
        resolver: yupResolver(validationSchema),
        defaultValues: {
            status: "active",
        },
    });

    const onSubmit = async (data) => {
        setLoadingSubmit(true);
        try {
            const response = await systemApi.storeUser(data);
            if (!response?.data) throw new Error();
            toast.success("Create User success");
            navigate("/user-management/users");
        } catch (error) {
            console.log("error", error);
        }
        setLoadingSubmit(false);
    };

    return (
        <Box>
            <form onSubmit={handleSubmit(onSubmit)} style={{height: "100%"}}>
                {/* breadcrumb */}
                <Breadcrumb title="Add New User" items={BCrumb}>
                    <Button
                        color="primary"
                        variant="contained"
                        disableElevation
                        sx={{
                            width: "120px",
                            height: "40px",
                        }}
                        type="submit"
                        disabled={loadingSubmit}
                    >
                        {loadingSubmit ? <CircularProgress color="secondary"/> : "Save"}
                    </Button>
                </Breadcrumb>
                {/* end breadcrumb */}
                <Stack
                    gap={4}
                    direction="column"
                >
                    <ParentCard title="General Settings">
                        <Stack direction="column" gap={3}>
                            {/* Name */}
                            <Stack direction={{sm: "column", lg: "row"}} gap={2}>
                                <Box
                                    sx={{
                                        width: "200px",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    Name
                                </Box>
                                <Box sx={{flex: "1 1 100%"}}>
                                    <InputField
                                        name="name"
                                        control={control}
                                        vairant="standard"
                                        sx={{maxWidth: "400px"}}
                                    />
                                </Box>
                            </Stack>

                            {/* Email */}
                            <Stack direction={{sm: "column", lg: "row"}} gap={2}>
                                <Box
                                    sx={{
                                        width: "200px",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    Email
                                </Box>
                                <Box sx={{flex: "1 1 100%"}}>
                                    <InputField
                                        name="email"
                                        control={control}
                                        vairant="standard"
                                        sx={{maxWidth: "400px"}}
                                    />
                                </Box>
                            </Stack>

                            {/* Password */}
                            <Stack direction={{sm: "column", lg: "row"}} gap={2}>
                                <Box
                                    sx={{
                                        width: "200px",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    Password
                                </Box>
                                <Box sx={{flex: "1 1 100%"}}>
                                    <PasswordField
                                        name="password"
                                        control={control}
                                        vairant="standard"
                                        sx={{maxWidth: "400px"}}
                                    />
                                </Box>
                            </Stack>

                            {/* Password confirm */}
                            <Stack direction={{sm: "column", lg: "row"}} gap={2}>
                                <Box
                                    sx={{
                                        width: "200px",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    Password confirm
                                </Box>
                                <Box sx={{flex: "1 1 100%"}}>
                                    <PasswordField
                                        name="password_confirmation"
                                        control={control}
                                        vairant="standard"
                                        sx={{maxWidth: "400px"}}
                                    />
                                </Box>
                            </Stack>
                        </Stack>
                    </ParentCard>

                    <ParentCard title="Advanced Settings">

                        <Stack direction="column" gap={3}>
                            {/* Roles */}
                            {isAdminRole? <Stack direction={{sm: "column", lg: "row"}} gap={2}>
                                <Box
                                    sx={{
                                        width: "200px",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    Roles
                                </Box>
                                <Box sx={{flex: "1 1 100%"}}>
                                    <MultiSelectField
                                        name="roles"
                                        dataOptions={listRole}
                                        control={control}
                                        selectKey="name"
                                        selectValue="name"
                                        freeSolo
                                        sx={{width: "500px"}}
                                    />
                                </Box>
                            </Stack>:null}

                            {/* Permissions */}
                            {isAdminRole ?<Stack direction={{sm: "column", lg: "row"}} gap={2}>
                                <Box
                                    sx={{
                                        width: "200px",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    Permissions
                                </Box>
                                <Box sx={{flex: "1 1 100%"}}>
                                    <MultiSelectField
                                        name="permissions"
                                        dataOptions={listAllPermission}
                                        control={control}
                                        selectKey="name"
                                        selectValue="name"
                                        freeSolo
                                        sx={{width: "500px"}}
                                    />
                                </Box>
                            </Stack> :null}

                            {/* Status */}
                            <Stack direction={{sm: "column", lg: "row"}} gap={2}>
                                <Box
                                    sx={{
                                        width: "200px",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    Status
                                </Box>
                                <Box sx={{flex: "1 1 100%"}}>
                                    <SelectField
                                        name="status"
                                        dataOptions={[
                                            {
                                                key: "active",
                                                value: "Active",
                                            },
                                            {
                                                key: "inactive",
                                                value: "Inactive",
                                            },
                                        ]}
                                        control={control}
                                        selectKey="key"
                                        selectValue="value"
                                        freeSolo
                                        sx={{width: "200px"}}
                                    />
                                </Box>
                            </Stack>
                        </Stack>
                    </ParentCard>

                    <Stack direction="row" justifyContent="flex-end">
                        <Button
                            color="primary"
                            variant="contained"
                            disableElevation
                            sx={{
                                width: "120px",
                                height: "40px",
                            }}
                            type="submit"
                            disabled={loadingSubmit}
                        >
                            {loadingSubmit ? (
                                <CircularProgress color="secondary"/>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </Stack>
                </Stack>

            </form>
        </Box>
    );
};

export default FormLayouts;
