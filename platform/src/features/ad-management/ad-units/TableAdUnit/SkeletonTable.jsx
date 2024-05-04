import React from "react";
import {Skeleton, Table, TableBody, TableCell, TableContainer, TableRow,} from "@mui/material";
import EnhancedTableHead from "./EnhancedTableHead.jsx";

const SkeletonTable = () => {
    return (
        <TableContainer>
            <Table sx={{minWidth: 750}} aria-labelledby="tableTitle">
                <EnhancedTableHead
                    numSelected={0}
                    order={"asc"}
                    orderBy={""}
                    rowCount={0}
                    onRequestSort={() => {
                    }}
                    onSelectAllClick={() => {
                    }}
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
                                    <Skeleton animation="wave" height={68}/>
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
