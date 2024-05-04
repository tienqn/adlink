import {useEffect, useState} from "react";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import InputField from "@/components/forms/field-controller/InputField";
import SelectField from "@/components/forms/field-controller/SelectField";
import CustomSelectField from "@/components/forms/field-controller/CustomSelectField";
import MultiSelectField from "@/components/forms/field-controller/MultiSelectField";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {Box, Button, CircularProgress, Stack, Tooltip,} from "@mui/material";
import adManagementApi from "@/services/apis/adManagement.api";
import {toast} from "react-toastify";
import {listSizeDefault} from '@/utils/constants';
import {useSelector} from "react-redux";

const SettingsForm = ({
                          listSite,
                          onCreativeSuccess,
                          isEdit,
                          formRefSetting
                      }) => {

    const adUnit = useSelector((state) => state.adUnit);
    const {currentAdUnitDetails} = adUnit;

    const { creatives: creativeObj} = currentAdUnitDetails;
    const creatives = creativeObj?.data || [];

    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        code: Yup.string().required("Code is required")
            .matches(/^[a-zA-Z0-9_]+$/, "Invalid input. Use only letters, numbers, and underscores."),
        status: Yup.string().required("Status is required"),
        site_id: Yup.string().required("Site is required"),
        sizes: Yup.array().min(1, "This field is not empty"),
        // div_mode: Yup.string().required("Div is required"),
        // div: Yup.string().required("Div is required"),
    });

    const {handleSubmit, control, reset} = useForm({
        reValidateMode: "onChange",
        resolver: yupResolver(validationSchema),
        defaultValues: {
            div_mode: "before",
            status: "active",
            sizes: [],
        },
    });

    useEffect(() => {
        if (isEdit) {
            const {div, div_mode, name, site_id, sizes=[], status, code} =
                currentAdUnitDetails;
            console.log("currentAdUnitDetails ",currentAdUnitDetails)
            reset({
                div,
                div_mode,
                name,
                site_id,
                sizes: sizes.map(size =>  {
                    if(typeof size==="string") {
                        return {
                            key: size,
                            value: size
                        }
                    } else {
                        return size
                    }

                }),
                status,
                code,
            });
        }
    }, [isEdit, currentAdUnitDetails]);

    const onSubmit = async (data) => {
        setLoadingSubmit(true);
        const {sizes} = data;
        const _sizes = sizes.map(size =>{
            if(typeof size==="string") {
                return size
            } else {
                return size?.key
            }
        });
        const body = {
            ...data,
            sizes: _sizes,
        }
        try {
            if (isEdit) {
                const response = await adManagementApi.updateAdUnit(
                    currentAdUnitDetails?.id,
                    body
                );
                if (!response?.data) throw new Error();
                toast.success("Update ad unit success");
            } else {
                console.log("data", data);
                const response = await adManagementApi.storeAdUnit(body);
                if (!response?.data) throw new Error();
                toast.success("Create ad unit success");
                onCreativeSuccess(response?.data?.data);
            }
        } catch (error) {
            console.log("error", error);
        }
        setLoadingSubmit(false);
    };
    console.log("currentAdUnitDetails ", currentAdUnitDetails?.sizes)
    return (
        <form ref={formRefSetting} onSubmit={handleSubmit(onSubmit)}>
            <Stack direction="column" spacing={3}>
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

                {/* Site */}
                <Stack direction={{sm: "column", lg: "row"}} gap={2}>
                    <Box
                        sx={{
                            width: "200px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        Site
                    </Box>
                    <Box sx={{flex: "1 1 100%"}}>
                        <SelectField
                            name="site_id"
                            dataOptions={listSite.filter((site) => site?.status==="active")}
                            control={control}
                            selectKey="id"
                            selectValue="domain"
                            sx={{width: "400px"}}
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
                        <CustomSelectField
                                name="sizes"
                                options={listSizeDefault}
                                control={control}
                                optionKey="key"
                                optionValue="value"
                                isMultiple={true}
                                sx={{width: "500px"}}
                                disabledValues={currentAdUnitDetails?.sizes || []}
                        />
                    </Box>
                </Stack>

                {/* Div */}
                <Stack direction={{sm: "column", lg: "row"}} gap={2} >
                    <Box
                        sx={{
                            width: "200px",
                            display: "flex",
                            alignItems: "start",
                            paddingTop: "8px",
                        }}
                    >
                        DIV
                    </Box>
                    <Stack
                        sx={{
                            flex: "1 1 100%",
                        }}
                        gap={2}
                    >
                        <Box
                            component={Stack}
                            spacing={2}
                            direction="row"
                            alignItems={"center"}
                        >
                            <SelectField
                                name="div_mode"
                                dataOptions={[
                                    {
                                        key: "before",
                                        value: "Before",
                                    },
                                    {
                                        key: "insert",
                                        value: "Insert",
                                    },
                                    {
                                        key: "after",
                                        value: "After",
                                    },
                                ]}
                                control={control}
                                selectKey="key"
                                selectValue="value"
                                freeSolo
                                sx={{width: "120px"}}
                            />
                            <InputField
                                name="div"
                                control={control}
                                vairant="standard"
                                sx={{maxWidth: "200px"}}
                            />
                            <Tooltip
                                title={
                                    <Stack spacing={2}>
                                        <p>Use CSS element</p>
                                        <p>- id "#"</p>
                                        <p> - class "."</p>
                                    </Stack>
                                }
                                placement="bottom"
                                arrow
                            >
                                <InfoOutlinedIcon/>
                            </Tooltip>
                        </Box>
                    </Stack>
                </Stack>
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
                        {loadingSubmit ? <CircularProgress color="secondary"/> : "Save"}
                    </Button>
                </Stack>
            </Stack>
        </form>
    );
};

export default SettingsForm;
