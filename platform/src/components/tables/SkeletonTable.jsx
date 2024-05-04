import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import { format } from "date-fns";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  IconButton,
  Tooltip,
  FormControlLabel,
  Typography,
  Avatar,
  Paper,
  Skeleton,
} from "@mui/material";
import moment from "moment";

import CustomCheckbox from "@/components/forms/theme-elements/CustomCheckbox";
import EnhancedTableHead from "./EnhancedTableHead.jsx";

const SkeletonTable = () => {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
        <EnhancedTableHead
          numSelected={0}
          order={""}
          orderBy={""}
          rowCount={0}
        />
        <TableBody>
          {[1, 2, 3, 4, 5].map((row, index) => {
            return (
              <TableRow key={row}>
                <TableCell
                  colSpan={7}
                  sx={{
                    padding: "0 16px",
                  }}
                >
                  <Skeleton animation="wave" height={68} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SkeletonTable;
