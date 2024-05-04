import React, {useEffect, useState} from "react";
import {Box, Button, CircularProgress, Stack,} from "@mui/material";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import PageContainer from "@/components/container/PageContainer";
import Breadcrumb from "@/layouts/full/shared/breadcrumb/Breadcrumb";
import InputField from "@/components/forms/field-controller/InputField";
import SelectField from "@/components/forms/field-controller/SelectField";
import {fetchListCategory} from "@/store/apps/ad-management/SiteSlice";
import {dispatch} from "@/store/Store";
import {useSelector} from "react-redux";
import adManagementApi from "@/services/apis/adManagement.api";
import {toast} from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";
import BlankCard from "../../../../components/shared/BlankCard.js";

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        to: "/ad-management/sites",
        title: "Site",
    },
    {
        title: "Edit Site",
    },
];

const EditSite = () => {
    const {id: siteId} = useParams();
    const navigate = useNavigate();
    const site = useSelector((state) => state.site);
    const {listCategory} = site;

    const [loadingSubmit, setLoadingSubmit] = useState(false);

    useEffect(() => {
        dispatch(fetchListCategory());
    }, []);

    useEffect(() => {
        fetchData(siteId);
    }, [siteId]);

    const fetchData = async (siteId) => {
        try {
            const response = await adManagementApi.getSiteDetails(siteId);
            const {domain, categories, status} = response?.data;
            reset({
                domain,
                category: categories[0],
                status
            });
        } catch (err) {
            throw new Error(err);
        }
    };

    const validationSchema = Yup.object().shape({
        domain: Yup.string()
            .matches(
                /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                "Enter correct url!"
            )
            .required("Domain is required"),
        // categories: Yup.array().min(1, "This field is not empty"),
        status: Yup.string().required("Status is required"),
        category: Yup.string().required("Category is required"),
    });

    const {handleSubmit, control, reset} = useForm({
        reValidateMode: "onChange",
        resolver: yupResolver(validationSchema),
        defaultValues: {
            domain: "",
            status: "active",
        },
    });

    const onSubmit = async (data) => {
        setLoadingSubmit(true);
        try {
            const {domain, category, status} = data;
            const body = {
                // domain,
                status,
                categories: [category],
            };
            const reponse = await adManagementApi.updateSite(siteId, body);
            if (!reponse?.data) throw new Error();
            toast.success("Update site success");
            navigate("/ad-management/sites");
        } catch (error) {
            console.log("error", error);
        }
        setLoadingSubmit(false);
    };
    return (
        <Box>
            <form onSubmit={handleSubmit(onSubmit)} style={{height: "100%"}}>
                {/* breadcrumb */}
                <Breadcrumb title="Edit Site" items={BCrumb}>
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
                            {/* Domain */}
                            <Stack direction={{sm: "column", lg: "row"}} gap={2}>
                                <Box
                                    sx={{
                                        width: "200px",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    Domain
                                </Box>
                                <Box sx={{flex: "1 1 100%"}}>
                                    <InputField
                                        name="domain"
                                        control={control}
                                        vairant="standard"
                                        sx={{maxWidth: "300px"}}
                                        disabled
                                    />
                                </Box>
                            </Stack>

                            {/* Category */}
                            <Stack direction={{sm: "column", lg: "row"}} gap={2}>
                                <Box
                                    sx={{
                                        width: "200px",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    Category
                                </Box>
                                <Box sx={{flex: "1 1 100%"}}>
                                    <SelectField
                                        name="category"
                                        dataOptions={listCategory}
                                        control={control}
                                        selectKey="key"
                                        selectValue="value"
                                        sx={{width: "300px"}}
                                    />
                                </Box>
                            </Stack>
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

export default EditSite;
