import React, {useState} from "react";
import {useTheme} from "@mui/material/styles";
import {
    Box, Chip,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";

import CustomCheckbox from "@/components/forms/theme-elements/CustomCheckbox";
import {IconPencil} from "@tabler/icons";
import EnhancedTableHead from "./EnhancedTableHead.jsx";
import EnhancedTableToolbar from "./EnhancedTableToolbar.jsx";
import SkeletonTable from "./SkeletonTable.jsx";
import {useNavigate} from "react-router-dom";
import CodeIcon from "@mui/icons-material/Code";
import ModalGetCode from '@/features/ad-management/ad-units/ModalGetCode.jsx'
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const AdUnitTable = ({
                         listSite = [],
                         tableData = [],
                         metaData = {},
                         loadingTable = false,
                         filters = {},
                         handleFilters,
                         onDelete
                     }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("calories");
    const [selected, setSelected] = useState([]);

    const [modalGetCode, setModalGetCode] = useState({
        open: false,
        data: null
    })

    // This is for the sorting
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    // This is for select all the row
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.title);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    // This is for the single row sleect
    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const page = filters.page - 1;
    const rowsPerPage = filters?.limit;

    const emptyRows = page > 0 ? Math.max(0, rowsPerPage - tableData.length) : 0;
    // const renderData = stableSort(tableData, getComparator(order, orderBy));
    const renderData = tableData;
    return (
        <Box>
            <EnhancedTableToolbar
                listSite={listSite}
                numSelected={selected.length}
                filters={filters}
                handleFilters={handleFilters}
            />
            <Paper variant="outlined" sx={{m:2}}>
                {loadingTable ? (
                    <SkeletonTable/>
                ) : (
                    <TableContainer>
                        <Table
                            sx={{minWidth: 750}}
                            aria-labelledby="tableTitle"
                            size="medium"
                        >
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={tableData.length}
                            />
                            <TableBody>
                                {renderData.map((row, index) => {
                                    const isItemSelected = isSelected(row.title);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    const siteName = listSite.filter(
                                        (item) => item?.id === row?.site_id
                                    )?.[0]?.domain;

                                    return (
                                        <TableRow
                                            hover
                                            // onClick={(event) => handleClick(event, row.title)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={labelId}
                                            selected={isItemSelected}
                                        >
                                            {/*<TableCell padding="checkbox">*/}
                                            {/*    <CustomCheckbox*/}
                                            {/*        color="primary"*/}
                                            {/*        checked={isItemSelected}*/}
                                            {/*        inputprops={{*/}
                                            {/*            "aria-labelledby": labelId,*/}
                                            {/*        }}*/}
                                            {/*    />*/}
                                            {/*</TableCell>*/}

                                            <TableCell>
                                                <Typography variant="h6" fontWeight="600">
                                                    {row?.name}
                                                </Typography>
                                            </TableCell>

                                            <TableCell align="center">
                                                <Typography fontWeight="400">{siteName}</Typography>
                                            </TableCell>

                                            <TableCell align="center">
                                                <Typography fontWeight="400">
                                                    {row?.sizes.map(size => size?.key ? size?.key :size).join(", ")}
                                                </Typography>
                                            </TableCell>

                                            <TableCell align="center">
                                                <Typography>
                                                    <Chip
                                                        sx={{
                                                            bgcolor: (theme) =>
                                                                theme.palette?.[
                                                                    row?.status === "active"
                                                                        ? "success"
                                                                        : "primary"
                                                                    ].light,
                                                            color: (theme) =>
                                                                theme.palette?.[
                                                                    row?.status === "active"
                                                                        ? "success"
                                                                        : "primary"
                                                                    ].main,
                                                            borderRadius: "6px",
                                                            width: 120,
                                                        }}
                                                        size="small"
                                                        label={
                                                            row?.status === "active" ? "Active" : "Inactive"
                                                        }
                                                    />
                                                </Typography>
                                            </TableCell>

                                            <TableCell align="right">
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        sx={{padding: 0}}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            navigate(
                                                                `/ad-management/ad-units/edit/${row?.id}`
                                                            );
                                                        }}
                                                    >
                                                        <IconPencil width={20} height={20}/>
                                                    </IconButton>
                                                </Tooltip>


                                                <Tooltip title="Get Code">
                                                    <IconButton aria-label="drag" onClick={(event) =>{
                                                        event.stopPropagation();
                                                        setModalGetCode({
                                                            open: true,
                                                            data: row
                                                        })
                                                    }}>
                                                        <CodeIcon/>
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: 53 * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6}/>
                                    </TableRow>
                                )}
                                {!loadingTable && !renderData.length && (
                                    <></>
                                    // <TableRow
                                    //   style={{
                                    //     height: 69 * 5,
                                    //   }}
                                    // >
                                    //   <TableCell
                                    //     colSpan={7}
                                    //     sx={{
                                    //       border: "1px solid blue",
                                    //     }}
                                    //   >
                                    //     <Box>aaa</Box>
                                    //   </TableCell>
                                    // </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={metaData?.pagination?.total || 0}
                    rowsPerPage={filters?.limit}
                    page={filters?.page - 1}
                    onPageChange={(event, newPage) => {
                        handleFilters({
                            page: newPage + 1,
                        });
                    }}
                    onRowsPerPageChange={(event) => {
                        handleFilters({
                            limit: parseInt(event?.target?.value, 10),
                            page: 1,
                        });
                    }}
                />
            </Paper>
            <ModalGetCode open={modalGetCode?.open} data={modalGetCode?.data} onClose={() => setModalGetCode({
                open: false,
                data:null
            })}/>
        </Box>
    );
};

export default AdUnitTable;
