import React, {useEffect, useState} from "react";
import {Box, Button, Checkbox, FormControlLabel, Grid, Stack, Switch, Typography,} from "@mui/material";
import adminApi from "@/services/apis/system.api";
import {styled} from "@mui/material/styles";
import {Controller, useForm} from "react-hook-form";
import ModalCreateRole from "@/features/user-management/roles-permissions/ModalCreateRole";
import ModalCreatePermission from "@/features/user-management/roles-permissions/ModalCreatePermission";
import {fetchListPermission, fetchListRole, setActiveRole, setRenderPermission,} from "@/store/apps/system";
import {dispatch} from "@/store/Store";
import {useSelector} from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Breadcrumb from "@/layouts/full/shared/breadcrumb/Breadcrumb";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#2096F3",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Role and Permission",
  },
];

export default function RolesPermissions() {
  const system = useSelector((state) => state.system);
  const { listRole, activeRole, renderPermission, listAllPermission } = system;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State modal create role
  const [modalCreateRole, setModalCreateRole] = useState({
    open: false,
    isLoading: false,
    data: null,
  });

  // State modal create permission
  const [modalCreatePermission, setModalCreatePermission] = useState({
    open: false,
    isLoading: false,
    data: null,
  });

  useEffect(() => {
    // fetchData();
    dispatch(fetchListRole());
    dispatch(fetchListPermission());
  }, []);

  const { control, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const _permissions = [];
      for (const [keyData, valueData] of Object.entries(data)) {
        // console.log(`${keyData}: ${valueData}`);
        for (const [key, value] of Object.entries(valueData)) {
          console.log(`${key}: ${value}`);
          if (value) {
            _permissions.push(`${key}|${keyData}`);
          }
        }
      }
      const body = { permissions: _permissions };
      const role_id = activeRole?.id;

      const response = await adminApi.updateRolePermissions(role_id, body);
      if (response?.data) {
        // toast.success('Update permission success.');
        dispatch(fetchListRole());
        dispatch(setActiveRole(null));
        dispatch(setRenderPermission([]));
      }
    } catch (error) {
      console.log("error", error);
    }
    setTimeout(() => {
      setIsSubmitting(false);
    }, 300);
  };

  function compareLists(list1, list2) {
    const result = {};

    list1.forEach((item1) => {
      const { controller, name, action } = item1;
      const matchingItem = list2.find(
        (item2) => item2.controller === controller && item2.name === name
      );

      if (matchingItem) {
        result[controller] = result[controller] || {};
        result[controller][action] = true;
      } else {
        result[controller] = result[controller] || {};
        result[controller][action] = false;
      }
    });

    return result;
  }

  useEffect(() => {
    if (!activeRole) return;

    const { permissions = {} } = activeRole;
    const { data } = permissions;

    const comparisonResult = compareLists(listAllPermission, data);

    dispatch(setRenderPermission(comparisonResult));
    reset(comparisonResult);
  }, [activeRole, listAllPermission, reset]);

  return (
    <Box
      sx={{
        minHeight: "calc(100% - 80px)",
        height: "calc(100% - 80px)",
      }}
    >
      <Breadcrumb title="Role and Permission" items={BCrumb}>
        {/* <Button
          color="primary"
          variant="contained"
          component={Link}
          to="/ad-management/sites/add-new"
          disableElevation
          sx={{
            width: "120px",
          }}
        >
          New user
        </Button> */}
      </Breadcrumb>
      <Box
        sx={{
          background: "white",
          borderRadius: "8px",
          padding: "16px",
          boxShadow:
            "0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)",
          height: "100%",
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <Stack
              direction="rows"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
              spacing={2}
            >
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 500,
                }}
              >
                Roles
              </Typography>
              <Button
                variant="contained"
                onClick={() =>
                  setModalCreateRole({ ...modalCreateRole, open: true })
                }
                sx={{ borderRadius: "8px" }}
              >
                Add new role
              </Button>
            </Stack>
            <Stack spacing={2} direction="column">
              {listRole.map((role, index) => {
                const { name } = role;
                const isActiveRole = name === activeRole?.name;
                return (
                  <Button
                    variant="outlined"
                    onClick={() => dispatch(setActiveRole(role))}
                    sx={{
                      borderRadius: "8px",
                      borderColor: isActiveRole ? "#2096F3" : "#ddd",
                      color: isActiveRole ? "#2096F3" : "#616161",
                      height: "50px",
                    }}
                  >
                    {name}
                  </Button>
                );
              })}
            </Stack>
          </Grid>
          <Grid
            item
            xs={8}
            sx={{
              paddingLeft: "20px",
            }}
          >
            <Stack
              direction="rows"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
              spacing={2}
            >
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 500,
                }}
              >
                Permissions
              </Typography>
              <Button
                variant="contained"
                onClick={() =>
                  setModalCreatePermission({
                    ...modalCreatePermission,
                    open: true,
                  })
                }
                sx={{ borderRadius: "8px" }}
              >
                Add new permission
              </Button>
            </Stack>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2} direction="column" mb={4}>
                {Object.keys(renderPermission || {}).map(
                  (controller, index) => {
                    const actions = renderPermission[`${controller}`] || {};
                    return (
                      <Box
                        sx={{
                          padding: "16px",
                          borderRadius: "8px",
                          position: "relative",
                          background: "#E3F2FD",
                        }}
                        key={index}
                      >
                        <Typography
                          sx={{
                            fontSize: "18px",
                            fontWeight: 500,
                            paddingBottom: "4px",
                            width: "120px",
                          }}
                        >
                          {controller}
                        </Typography>

                        {Object.keys(actions).map((action, idx) => {
                          return (
                            <FormControlLabel
                              key={`${JSON.stringify(action)}__${idx}`}
                              sx={{
                                mr: 4,
                                "& .MuiTypography-root": {
                                  fontWeight: 500,
                                  fontSize: "14px",
                                },
                              }}
                              control={
                                <Controller
                                  name={`${controller}.${action}`}
                                  control={control}
                                  render={({ field }) => {
                                    return (
                                      <Checkbox
                                        sx={{ m: 1 }}
                                        {...field}
                                        onChange={field.onChange}
                                        checked={field?.value}
                                      />
                                    );
                                  }}
                                />
                              }
                              label={action}
                            />
                          );
                        })}
                      </Box>
                    );
                  }
                )}
              </Stack>

              {activeRole && (
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: "8px",
                    height: "40px",
                    width:"100px"
                  }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <CircularProgress size={24}/> : "Submit"}
                </Button>
              )}
            </form>
          </Grid>
        </Grid>
      </Box>

      {/* ModalCreateRole */}
      <ModalCreateRole
        modalData={modalCreateRole}
        onClose={() =>
          setModalCreateRole({ open: false, isLoading: false, data: null })
        }
      />

      {/* ModalCreatePermission */}
      <ModalCreatePermission
        modalData={modalCreatePermission}
        onClose={() =>
          setModalCreatePermission({
            open: false,
            isLoading: false,
            data: null,
          })
        }
      />
    </Box>
  );
}
