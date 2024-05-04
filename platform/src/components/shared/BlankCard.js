import { Card, Box, CircularProgress } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const BlankCard = ({ children, className, isLoading = false }) => {
  const customizer = useSelector((state) => state.customizer);
  return (
    <Card
      sx={{ p: 0, position: "relative" }}
      className={className}
      elevation={customizer.isCardShadow ? 9 : 0}
      variant={!customizer.isCardShadow ? "outlined" : undefined}
    >
      {children}
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "10000",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Card>
  );
};

BlankCard.propTypes = {
  children: PropTypes.node,
};

export default BlankCard;
