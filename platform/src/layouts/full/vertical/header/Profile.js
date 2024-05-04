import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Menu,
  Avatar,
  Typography,
  Divider,
  Button,
  IconButton,
} from "@mui/material";
import * as dropdownData from "./data";
import {useTheme} from "@mui/material/styles";
import { IconMail } from "@tabler/icons";
import { Stack } from "@mui/system";

import ProfileImg from "src/assets/images/profile/user-1.jpg";
import unlimitedImg from "src/assets/images/backgrounds/unlimited-bg.png";
import Scrollbar from "src/components/custom-scroll/Scrollbar";

import { clearLS } from "@/services/auth.service.js";
import {useSelector} from "react-redux";


// function stringToColor(string) {
//   let hash = 0;
//   let i;
//
//   /* eslint-disable no-bitwise */
//   for (i = 0; i < string.length; i += 1) {
//     hash = string.charCodeAt(i) + ((hash << 5) - hash);
//   }
//
//   let color = '#';
//
//   for (i = 0; i < 3; i += 1) {
//     const value = (hash >> (i * 8)) & 0xff;
//     color += `00${value.toString(16)}`.slice(-2);
//   }
//   /* eslint-enable no-bitwise */
//
//   return color;
// }
//
// function stringAvatar(name) {
//   return {
//     sx: {
//       bgcolor: stringToColor(name),
//     },
//     children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
//   };
// }
const Profile = () => {
    const theme = useTheme();
  const system = useSelector((state) => state.system);
  const {userProfile={}
  } = system;

  const {name="", email} = userProfile;

  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        {/*<Avatar*/}
        {/*  src={ProfileImg}*/}
        {/*  alt={ProfileImg}*/}
        {/*  sx={{*/}
        {/*    width: 35,*/}
        {/*    height: 35,*/}
        {/*  }}*/}
        {/*/>*/}
        <Avatar  alt={name}
                sx={{
                  width: 35,
                  height: 35,
                    bgcolor: theme.palette.primary.main
                }}>{name.charAt(0) || "A"}</Avatar>
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "360px",
          },
        }}
      >
        <Scrollbar sx={{ height: "100%", maxHeight: "85vh" }}>
          <Box p={3}>
            <Typography variant="h5">User Profile</Typography>
            <Stack direction="row" py={3} spacing={2} alignItems="center">
              {/*<Avatar*/}
              {/*  src={ProfileImg}*/}
              {/*  alt={ProfileImg}*/}
              {/*  sx={{ width: 95, height: 95 }}*/}
              {/*/>*/}
                <Avatar  alt={name}
                         sx={{
                             width: 95,
                             height: 95,
                             bgcolor: theme.palette.primary.main
                         }}>{name.charAt(0) || "A"}</Avatar>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="textPrimary"
                  fontWeight={600}
                >
                  {name}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary" hidden>
                  Designer
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <IconMail width={15} height={15} />
                  {email}
                </Typography>
              </Box>
            </Stack>
            <Divider />

            <Box mt={2}>

              <Button
                to="/auth/login"
                variant="outlined"
                color="primary"
                component={Link}
                fullWidth
                onClick={() => {
                  clearLS();
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Scrollbar>
      </Menu>
    </Box>
  );
};

export default Profile;
