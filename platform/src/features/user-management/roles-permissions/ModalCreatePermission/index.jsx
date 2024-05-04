import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import * as Yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import adminApi from "@/services/apis/system.api";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { fetchListPermission } from "@/store/apps/system";
import { dispatch } from "@/store/Store";

export default function ModalCreatePermission({ modalData, onClose }) {
  const { open = false } = modalData;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    moduleName: Yup.string().required("Module name is required"),
    actions: Yup.array()
      .of(
        Yup.object().shape({
          value: Yup.string().required("Action is required."),
        })
      )
      .required(),
  });

  const { control, register, handleSubmit, errors } = useForm({
    defaultValues: {
      moduleName: null,
      actions: [
        {
          value: null,
        },
      ],
    },
    resolver: yupResolver(validationSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "actions", // unique name for your Field Array
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const { moduleName, actions } = data;
      const _actions = actions.map((item) => item.value).join(",");
      const body = {
        controller: moduleName,
        actions: _actions,
      };
      const response = await adminApi.createPermission(body);
      if (response?.data) {
        // toast.success('Update permission success.');
        dispatch(fetchListPermission());
        onClose();
      }
    } catch (error) {
      console.log("error", error);
    }
    setTimeout(() => {
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={"md"}
        sx={{
          minWidth: "600px",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Create new permission</DialogTitle>
          <DialogContent
            sx={{
              minWidth: "600px",
              paddingX: "24px",
            }}
          >
            <Box
              sx={{
                width: "400px",
                margin: "0 auto",
                paddingTop: "24px",
              }}
            >
              <TextField
                id="standard-basic"
                label="Module Name"
                variant="outlined"
                mt={2}
                fullWidth
                {...register("moduleName")}
                error={errors?.moduleName ? true : false}
                helperText={errors?.moduleName && errors?.moduleName?.message}
              />
              <Divider sx={{ paddingTop: "16px" }} />

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={3}
              >
                <Typography>Actions</Typography>
                <Button
                  onClick={() => {
                    append({ value: "" });
                  }}
                >
                  Add new
                </Button>
              </Stack>
              <Stack
                direction="column"
                sx={{
                  height: "240px",
                  overflowY: "scroll",
                  paddingY: "16px",
                }}
                spacing={3}
              >
                {fields.map((field, index) => (
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="between"
                  >
                    <TextField
                      fullWidth
                      id="standard-basic"
                      label={
                        <>
                          Action <span className="text-red-500 text-xs">*</span>
                        </>
                      }
                      variant="outlined"
                      {...register(`actions[${index}].value`, {
                        required: true,
                      })}
                      error={errors?.actions?.[index] ? true : false}
                      helperText={
                        errors?.actions?.[0] &&
                        errors?.actions[0]?.value?.message
                      }
                    />
                    <Button
                      className=" flex justify-center items-center shrink-0"
                      onClick={() => remove(index)}
                    >
                      <DeleteForeverIcon sx={{ color: "red" }} />
                    </Button>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress /> : "Submit"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
