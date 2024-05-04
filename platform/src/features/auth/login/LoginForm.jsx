import React, {useState} from "react";
import {Box, Button, CircularProgress, FormControlLabel, FormGroup, Stack, TextField, Typography,} from "@mui/material";
import {Link, useNavigate, useSearchParams} from "react-router-dom";

import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

import CustomCheckbox from "@/components/forms/theme-elements/CustomCheckbox";
import CustomFormLabel from "@/components/forms/theme-elements/CustomFormLabel";

import authApi from "@/services/apis/auth.api.js";

const LoginForm = ({ title, subtitle, subtext }) => {
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const redirectUrl = searchParams.get('redirectUrl');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    setLoadingSubmit(true);
    try {
      const response = await authApi.login(data);
      if (response?.data) {
        // navigate("/");
        if(redirectUrl) {
          navigate(redirectUrl);
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.log("error", error);
    }
    setLoadingSubmit(false);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <Stack>
        <Box sx={{minWidth:"300px"}}>
          <CustomFormLabel htmlFor="username">Email</CustomFormLabel>
          <TextField
            id="email"
            variant="outlined"
            fullWidth
            error={Boolean(errors["email"])}
            helperText={Boolean(errors["email"]) && errors["email"].message}
            {...register("email")}
          />
        </Box>
        <Box>
          <CustomFormLabel htmlFor="current-password">Password</CustomFormLabel>
          <TextField
            id="current-password"
            type="password"
            variant="outlined"
            fullWidth
            error={Boolean(errors["password"])}
            helperText={
              Boolean(errors["password"]) && errors["password"].message
            }
            {...register("password")}
          />
        </Box>
        {/*<Stack*/}
        {/*  justifyContent="space-between"*/}
        {/*  direction="row"*/}
        {/*  alignItems="center"*/}
        {/*  my={2}*/}
        {/*>*/}
        {/*  <FormGroup>*/}
        {/*    <FormControlLabel*/}
        {/*      control={<CustomCheckbox defaultChecked />}*/}
        {/*      label="Remeber this Device"*/}
        {/*    />*/}
        {/*  </FormGroup>*/}
        {/*  <Typography*/}
        {/*    component={Link}*/}
        {/*    to="/auth/forgot-password"*/}
        {/*    fontWeight="500"*/}
        {/*    sx={{*/}
        {/*      textDecoration: "none",*/}
        {/*      color: "primary.main",*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    Forgot Password ?*/}
        {/*  </Typography>*/}
        {/*</Stack>*/}
      </Stack>
      <Box mt={4}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          onClick={() => handleSubmit(onSubmit)}
          disabled={loadingSubmit}
          sx={{ height: "45px" }}
        >
          {loadingSubmit ? <CircularProgress color="secondary" /> : "Sign In"}
        </Button>
      </Box>
      {subtitle}
    </form>
  );
};

export default LoginForm;
