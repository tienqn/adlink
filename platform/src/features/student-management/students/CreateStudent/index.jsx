import React, {useState} from "react";
import {Box, Button, CircularProgress, Stack,} from "@mui/material";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import Breadcrumb from "@/layouts/full/shared/breadcrumb/Breadcrumb";
import InputField from "@/components/forms/field-controller/InputField";
import studentManagementApi from "@/services/apis/studentManagement.api";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import BlankCard from "../../../../components/shared/BlankCard.js";

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        to: "/student-management/student",
        title: "Student",
    },
    {
        title: "Add New Student",
    },
];

const CreateStudent = () => {
    const navigate = useNavigate();

    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        code: Yup.string().required("Code is required"),
    });

    const {handleSubmit, control} = useForm({
        reValidateMode: "onChange",
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: "",
            code: "",
        },
    });

    const onSubmit = async (data) => {
        setLoadingSubmit(true);
        try {
            const {name, code} = data;
            const body = {
                name,
                code
            };
            const reponse = await studentManagementApi.storeStudent(body);
            if (!reponse?.data) throw new Error();
            toast.success("Create student success");
            navigate("/student-management/students");
        } catch (error) {
            console.log("error", error);
        }
        setLoadingSubmit(false);
    };

    return (
        <Box>

            <form onSubmit={handleSubmit(onSubmit)} style={{height: "100%"}}>
                {/* breadcrumb */}
                <Breadcrumb title="Add New Student" items={BCrumb}>
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
                <BlankCard>
                    <Box p={4}>
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
                                        sx={{maxWidth: "300px"}}
                                        placeholder="Student name"
                                    />
                                </Box>
                            </Stack>

                            {/* Code */}
                            <Stack direction={{sm: "column", lg: "row"}} gap={2}>
                                <Box
                                    sx={{
                                        width: "200px",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    Code
                                </Box>
                                <Box sx={{flex: "1 1 100%"}}>
                                    <InputField
                                        name="code"
                                        control={control}
                                        vairant="standard"
                                        sx={{maxWidth: "300px"}}
                                        placeholder="Student code"
                                    />
                                </Box>
                            </Stack>
                        </Stack>

                        <Stack direction="row" justifyContent="flex-end" mt={4}>
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
                        </Stack>
                    </Box>

                </BlankCard>


            </form>
        </Box>
    );
};

export default CreateStudent;
