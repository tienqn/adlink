import {useEffect, useState} from "react";
import * as Yup from "yup";
import {useFieldArray, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import SelectField from "@/components/forms/field-controller/SelectField";

import {Box, Button, CircularProgress, IconButton, Stack,} from "@mui/material";
import ImportExportOutlinedIcon from "@mui/icons-material/ImportExportOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CodeIcon from "@mui/icons-material/Code";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import adManagementApi from "@/services/apis/adManagement.api";
import {toast} from "react-toastify";
import ModalGetCode from '../ModalGetCode.jsx'
import {dispatch} from "@/store/Store.js";
import { fetchAdUnitDetails} from "@/store/apps/ad-management/AdUnitSlice.js";

const CreativesForm = ({ isEdit, formRefCreative}) => {

    const adUnit = useSelector((state) => state.adUnit);
    const {currentAdUnitDetails} = adUnit;
    const {id: adUnitId, sizes=[], creatives: creativeObj} = currentAdUnitDetails;

    const creatives = creativeObj?.data || [];

    const navigate = useNavigate();
    const creative = useSelector((state) => state.creative);
    const {creativeData} = creative;

    let totalCreative = creativeData?.tableData.filter((item) =>
        sizes.map(size => size?.key ? size?.key :size).includes(item?.size) && item?.status==="active"
    );
    totalCreative = totalCreative.map((item) =>{
        return {
            ...item,
            customName: `${item?.name} - ${item?.size}`
        }
    })

    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [modalGetCode, setModalGetCode] = useState({
        open: false,
        data: null
    })

    const validationSchema = Yup.object().shape({
        creative_ids: Yup.array()
            .of(
                Yup.object().shape({
                    creative_id: Yup.string().required("Creative is required."),
                })
            )
            .required(),
    });

    const {handleSubmit, control, register, watch, getValues, reset, formState:{isDirty}} = useForm({
        reValidateMode: "onChange",
        resolver: yupResolver(validationSchema),
        defaultValues: {
            creative_ids: [{creative_id: ""}],
        },
    });

    const {fields, append, move, remove} = useFieldArray({
        control,
        name: "creative_ids",
    });

    useEffect(() => {
        if (isEdit) {
            const _creatives = creatives.map((item) => {
                return {
                    creative_id: item?.id,
                    isSubmitted: true,
                };
            });
            reset({
                creative_ids: _creatives,
            });
        }
    }, [isEdit, creatives]);

    const onSubmit = async (data) => {
        setLoadingSubmit(true);
        try {
            const body = {
                creative_ids: (data?.creative_ids || []).map(
                    (item) => item?.creative_id
                ),
                includes: "creatives",
            };
            const response = await adManagementApi.assignCreativeToAdUnit(
                adUnitId,
                body
            );
            if (!response?.data) throw new Error();
            toast.success("Assign creatives success");
            // navigate("/ad-management/ad-units");
            dispatch(fetchAdUnitDetails(adUnitId))
        } catch (error) {
            console.log("error", error);
        }
        setLoadingSubmit(false);
    };

    const handleDrag = ({source, destination}) => {
        if (destination) {
            move(source.index, destination.index);
        }
    };

    const fieldsArray = watch({nest: true})?.creative_ids || [];
    const creativeSelected = fieldsArray.map((item) => item.creative_id);

    const renderOptions = (index) => {
        let _totalCreative = totalCreative.filter((item, idx) => {
            if (idx === index) return;
            if (creativeSelected.includes(item?.id)) return;
            return item;
        });
        return _totalCreative;
    };
    return (
        <form ref={formRefCreative} onSubmit={handleSubmit(onSubmit)}>
            <DragDropContext onDragEnd={handleDrag}>
                <Droppable droppableId="creative_ids-items">
                    {(provided, snapshot) => (
                        <Box {...provided.droppableProps} ref={provided.innerRef}>
                            {fields.map((item, index) => {

                                return (
                                    <Draggable
                                        key={`creative_ids[${index}]`}
                                        draggableId={`creative-${index}`}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <Stack
                                                key={item.id}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                direction={{ sm: "row"}}
                                                gap={1}
                                                mb={3}
                                            >
                                                <IconButton
                                                    aria-label="drag"
                                                    {...provided.dragHandleProps}
                                                >
                                                    <ImportExportOutlinedIcon/>
                                                </IconButton>

                                                <SelectField
                                                    name={`creative_ids.${index}.creative_id`}
                                                    dataOptions={totalCreative}
                                                    optionSelected={creativeSelected}
                                                    control={control}
                                                    selectKey="id"
                                                    selectValue="customName"
                                                    freeSolo
                                                    sx={{width: "400px"}}
                                                />

                                                <IconButton
                                                    aria-label="drag"
                                                    onClick={() => {
                                                        remove(index);
                                                    }}
                                                >
                                                    <DeleteOutlineIcon/>
                                                </IconButton>

                                                {item?.isSubmitted ?
                                                <IconButton aria-label="drag" onClick={() =>{
                                                    if(isDirty) {
                                                        toast.warning("Please save changes to get new code")
                                                    } else {
                                                        setModalGetCode({
                                                            open: true,
                                                            data: {
                                                                ...currentAdUnitDetails,
                                                                creativeId: item?.creative_id,
                                                                isCreativeCode: true,
                                                            }
                                                        })
                                                    }

                                                }}>
                                                    <CodeIcon/>
                                                </IconButton>:null}

                                            </Stack>
                                        )}
                                    </Draggable>
                                );
                            })}

                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>

            <Stack direction="row" justifyContent="space-between">
                {totalCreative.length > fields.length ? (
                    <Button
                        color="primary"
                        variant="outlined"
                        disableElevation
                        sx={{
                            width: "120px",
                            height: "40px",
                        }}
                        onClick={() => {
                            append({creative_id: ""});
                        }}
                    >
                        Add Creative
                    </Button>
                ) : (
                    <Box></Box>
                )}
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
            <ModalGetCode open={modalGetCode?.open} data={modalGetCode?.data} onClose={() => {
                setModalGetCode({
                    open: false,
                    data:null
                })
            }}/>
        </form>
    );
};

export default CreativesForm;
