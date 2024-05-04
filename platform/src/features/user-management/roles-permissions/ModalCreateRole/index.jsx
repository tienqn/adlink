import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import { useForm } from "react-hook-form";
import adminApi from "@/services/apis/system.api";
import { fetchListRole } from "@/store/apps/system";
import { dispatch } from "@/store/Store";

export default function ModalCreateRole({ modalData, onClose }) {
  const { open = false } = modalData;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await adminApi.createRole(data);
      if (response?.data) {
        // toast.success('Update permission success.');
        dispatch(fetchListRole());
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
          <DialogTitle
            sx={{
              fontWeight: 500,
              fontSize: "20px",
            }}
          >
            Create new role
          </DialogTitle>
          <DialogContent
            sx={{
              minWidth: "600px",
            }}
          >
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Role name"
              fullWidth
              variant="standard"
              {...register(`name`)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              sx={{
                height: "42px",
                width: "120px",
              }}
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress /> : "Submit"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
