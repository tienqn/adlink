import React, {useState} from "react";
import {Box, Button, CircularProgress, Grid, Stack, Typography,} from "@mui/material";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import PageContainer from "@/components/container/PageContainer";
import Breadcrumb from "@/layouts/full/shared/breadcrumb/Breadcrumb";
import InputField from "@/components/forms/field-controller/InputField";
import SelectField from "@/components/forms/field-controller/SelectField";
import DateTimeField from "@/components/forms/field-controller/DateTimeField";
import ParentCard from "@/components/shared/ParentCard";
import moment from "moment";
import adManagementApi from "@/services/apis/adManagement.api";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {listSizeDefault, startTimeOptions, endTimeOptions} from '@/utils/constants';
import CustomSwitch from "@/components/forms/theme-elements/CustomSwitch";

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        to: "/ad-management/creatives",
        title: "Creative",
    },
    {
        title: "Add New Creative",
    },
];

const FormLayouts = () => {
    const navigate = useNavigate();
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [showTime, setShowTime] = useState(true);

    const validationSchema = showTime ?
        Yup.object().shape({
        name: Yup.string().required("Name is required"),
        code: Yup.string()
            .required("Code is required")
            .matches(/^[a-zA-Z0-9_]+$/, "Invalid input. Use only letters, numbers, and underscores."),
        status: Yup.string().required("Status is required"),
        size: Yup.string().required("Size is required"),
        standard_code: Yup.string().required("Standard code is required"),

        start_time_date: Yup.string().required("Start time is required"),
        start_time_hour: Yup.string().required("Start time is required"),
        end_time_date: Yup.date()
            .required("End time is required")
            .test(
                "is-greater",
                "End time must be greater than start time",
                function (value) {
                    const {
                        start_time_date,
                        start_time_hour,
                        end_time_date,
                        end_time_hour,
                    } = this.parent;
                    const startDateTime = moment(start_time_date)
                        .set({
                            hour: moment(start_time_hour, "h:mm A").hour(),
                            minute: moment(start_time_hour, "h:mm A").minute(),
                        })
                        .unix();
                    const endDateTime = moment(end_time_date)
                        .set({
                            hour: moment(end_time_hour, "h:mm A").hour(),
                            minute: moment(end_time_hour, "h:mm A").minute(),
                        })
                        .unix();
                    return endDateTime > startDateTime;
                }
            ),
        end_time_hour: Yup.string()
            .required("End time is required")
            .test(
                "is-greater",
                "End time must be greater than start time",
                function (value) {
                    const {
                        start_time_date,
                        start_time_hour,
                        end_time_date,
                        end_time_hour,
                    } = this.parent;
                    const startDateTime = moment(start_time_date)
                        .set({
                            hour: moment(start_time_hour, "h:mm A").hour(),
                            minute: moment(start_time_hour, "h:mm A").minute(),
                        })
                        .unix();
                    const endDateTime = moment(end_time_date)
                        .set({
                            hour: moment(end_time_hour, "h:mm A").hour(),
                            minute: moment(end_time_hour, "h:mm A").minute(),
                        })
                        .unix();
                    return endDateTime > startDateTime;
                }
            ),
        goal_type: Yup.string().required("Goal type is required"),
        // limit: Yup.string().required("Limit is required"),
        event: Yup.string().required("Event is required"),
        status_delivery: Yup.string().required("Advertiser is required"),
    }):
        Yup.object().shape({
            name: Yup.string().required("Name is required"),
            code: Yup.string()
                .required("Code is required")
                .matches(/^[a-zA-Z0-9_]+$/, "Invalid input. Use only letters, numbers, and underscores."),
            status: Yup.string().required("Status is required"),
            size: Yup.string().required("Size is required"),
            standard_code: Yup.string().required("Standard code is required"),
            goal_type: Yup.string().required("Goal type is required"),
            // limit: Yup.string().required("Limit is required"),
            event: Yup.string().required("Event is required"),
            status_delivery: Yup.string().required("Advertiser is required"),
        })
    ;

    const {handleSubmit, control, watch, getVaues, reset} = useForm({
        reValidateMode: "onChange",
        resolver: yupResolver(validationSchema),
        defaultValues: {
            status: "active",
            status_delivery: "active",
            goal_type: "lifetime",
            event: "impressions",
        },
    });

    const onSubmit = async (data) => {
        setLoadingSubmit(true);
        try {
            const {
                name,
                code,
                status,
                size,
                standard_code,

                status_delivery,
                start_time_date,
                start_time_hour,
                end_time_date,
                end_time_hour,
                goal_type,
                limit,
                event,
            } = data;
            const dataCreative = {name, code, status, size, standard_code};
            const dataLineItem = {
                start_time: (start_time_date && start_time_hour)? moment(start_time_date)
                    .set({
                        hour: moment(start_time_hour, "h:mm A").hour(),
                        minute: moment(start_time_hour, "h:mm A").minute(),
                    })
                    .format("YYYY-MM-DD HH:mm:ss"):"",
                end_time: (end_time_date && end_time_hour)? moment(end_time_date)
                    .set({
                        hour: moment(end_time_hour, "h:mm A").hour(),
                        minute: moment(end_time_hour, "h:mm A").minute(),
                    })
                    .format("YYYY-MM-DD HH:mm:ss"):"",
                goal_type,
                limit,
                event,
                status: status_delivery,
                creative_ids: [], // call api in step 2
            };

            // store creative and get creative_id
            const reponseCreative = await adManagementApi.storeCreative(dataCreative);
            if (!reponseCreative?.data) throw new Error();
            const creative_id = reponseCreative?.data?.data?.id;
            dataLineItem[`creative_ids`] = [creative_id];

            // store line item
            const reponseLineItem = await adManagementApi.storeLineItem(dataLineItem);
            if (!reponseLineItem?.data) throw new Error();

            toast.success("Create creative success");
            navigate("/ad-management/creatives");
        } catch (error) {
            console.log("error", error);
        }
        setLoadingSubmit(false);
    };
    return (
        <Box>
            <form onSubmit={handleSubmit(onSubmit)} style={{height: "100%"}}>
                {/* breadcrumb */}
                <Breadcrumb title="Add New Creative" items={BCrumb}>
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

                <Grid container spacing={3}>
                    <Grid
                        item
                        lg={12}
                        md={12}
                        xs={12}
                        component={Stack}
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
                                            sx={{maxWidth: "400px"}}
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

                                {/* Size */}
                                <Stack direction={{sm: "column", lg: "row"}} gap={2}>
                                    <Box
                                        sx={{
                                            width: "200px",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        Size
                                    </Box>
                                    <Box sx={{flex: "1 1 100%"}}>
                                        <SelectField
                                            name="size"
                                            dataOptions={listSizeDefault}
                                            control={control}
                                            selectKey="key"
                                            selectValue="value"
                                            freeSolo
                                            sx={{width: "200px"}}
                                        />
                                    </Box>
                                </Stack>

                                {/* Standard Code */}
                                <Stack direction={{sm: "column", lg: "row"}} gap={2}>
                                    <Box
                                        sx={{
                                            width: "200px",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        Standard code
                                    </Box>
                                    <Box sx={{flex: "1 1 100%"}}>
                                        <InputField
                                            name="standard_code"
                                            control={control}
                                            vairant="standard"
                                            rows={6}
                                            multiline
                                            sx={{maxWidth: "600px"}}
                                        />
                                    </Box>
                                </Stack>
                            </Stack>
                        </ParentCard>

                        <ParentCard title="Delivery settings">
                            <Stack direction="column" gap={3}>
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
                                            name="status_delivery"
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
                                            sx={{width: "300px"}}
                                        />
                                    </Box>
                                </Stack>

                                <Stack direction={{sm: "column", lg: "row"}} gap={2}>
                                    <Box
                                        sx={{
                                            width: "200px",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        Set date
                                    </Box>
                                    <Box
                                        sx={{flex: "1 1 100%"}}
                                        component={Stack}
                                        gap={5}
                                        direction="row"
                                    >
                                        <CustomSwitch checked={showTime} onChange={(e) => setShowTime(e.target.checked)} />
                                    </Box>
                                </Stack>

                                {/* Start time */}
                                {showTime ? <Stack direction={{sm: "column", lg: "row"}} gap={2}>
                                    <Box
                                        sx={{
                                            width: "200px",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        Start time
                                    </Box>
                                    <Box
                                        sx={{flex: "1 1 100%"}}
                                        component={Stack}
                                        gap={5}
                                        direction="row"
                                    >
                                        <DateTimeField
                                            name="start_time_date"
                                            // minDate={moment("2020-01-01")}
                                            // maxDate={moment(end_date)}
                                            views={["month", "day"]}
                                            inputFormat={"MM/DD/YYYY"}
                                            clearable
                                            control={control}
                                            sx={{
                                                width: "180px !important",
                                            }}
                                        />
                                        <SelectField
                                            name="start_time_hour"
                                            dataOptions={startTimeOptions}
                                            control={control}
                                            selectKey="key"
                                            selectValue="value"
                                            freeSolo
                                            sx={{width: "150px"}}
                                        />
                                    </Box>
                                </Stack>:null}


                                {/* End time */}
                                {showTime? <Stack direction={{sm: "column", lg: "row"}} gap={2}>
                                    <Box
                                        sx={{
                                            width: "200px",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        End time
                                    </Box>
                                    <Box
                                        sx={{flex: "1 1 100%"}}
                                        component={Stack}
                                        gap={5}
                                        direction="row"
                                    >
                                        <DateTimeField
                                            name="end_time_date"
                                            // minDate={moment(start_date)}
                                            // maxDate={moment("2020-12-31")}
                                            views={["month", "day"]}
                                            inputFormat={"MM/DD/YYYY"}
                                            clearable
                                            control={control}
                                            sx={{
                                                width: "180px !important",
                                            }}
                                        />
                                        <SelectField
                                            name="end_time_hour"
                                            dataOptions={endTimeOptions}
                                            control={control}
                                            selectKey="key"
                                            selectValue="value"
                                            freeSolo
                                            sx={{width: "150px"}}
                                        />
                                    </Box>
                                </Stack>:null}


                                {/* Goal type */}
                                <Stack direction={{sm: "column", lg: "row"}} gap={2}>
                                    <Box
                                        sx={{
                                            width: "200px",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        Goal type
                                    </Box>
                                    <Box
                                        sx={{flex: "1 1 100%"}}
                                        component={Stack}
                                        gap={5}
                                        direction="row"
                                    >
                                        <SelectField
                                            name="goal_type"
                                            dataOptions={[
                                                {
                                                    key: "lifetime",
                                                    value: "Lifetime",
                                                },
                                                {
                                                    key: "daily",
                                                    value: "Daily",
                                                },
                                            ]}
                                            control={control}
                                            selectKey="key"
                                            selectValue="value"
                                            freeSolo
                                            sx={{width: "200px"}}
                                        />
                                        <Stack direction="row" gap={2} alignItems="center">
                                            <Typography>Limit</Typography>
                                            <InputField
                                                name="limit"
                                                control={control}
                                                vairant="standard"
                                                type="number"
                                                sx={{maxWidth: "400px", height: "45px"}}
                                            />
                                        </Stack>

                                        <SelectField
                                            name="event"
                                            dataOptions={[
                                                {
                                                    key: "impressions",
                                                    value: "Impressions",
                                                },
                                                {
                                                    key: "clicks",
                                                    value: "Clicks",
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
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default FormLayouts;
