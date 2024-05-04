import React, {useState} from "react";
import {
  Box,
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
import {IconPencil, IconTrash} from "@tabler/icons";
import EnhancedTableHead from "./EnhancedTableHead.jsx";
import EnhancedTableToolbar from "./EnhancedTableToolbar.jsx";
import {useNavigate} from "react-router-dom";
import SkeletonTable from "./SkeletonTable.jsx";

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

const CreativeTable = ({
  tableData,
  metaData,
  loadingTable,
  filters,
  handleFilters,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [selected, setSelected] = useState([]);

  // This is for the sorting
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // This is for select all the row
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = tableData.map((n) => n.title);
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
      <Box>
        <EnhancedTableToolbar
          numSelected={selected.length}
          filters={filters}
          handleFilters={handleFilters}
        />
        <Paper variant="outlined" sx={{ m: 2 }}>
          {loadingTable ? (
            <SkeletonTable />
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
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
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={labelId}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <CustomCheckbox
                            color="primary"
                            checked={isItemSelected}
                            inputprops={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            sx={{
                              fontWeight: 500,
                            }}
                          >
                            {row?.name}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Box
                              sx={{
                                backgroundColor:
                                  row?.status === "active"
                                    ? (theme) => theme.palette.success.main
                                    : (theme) => theme.palette.secondary.main,
                                borderRadius: "100%",
                                height: "10px",
                                width: "10px",
                              }}
                            />
                            <Typography
                              color="textSecondary"
                              variant="subtitle2"
                              sx={{
                                ml: 1,
                              }}
                            >
                              {row?.status === "active" ? "Active" : "Inactive"}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Typography color="textSecondary">
                            {row?.email}
                          </Typography>
                        </TableCell>


                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={(event) => {
                                event.stopPropagation();
                                navigate(
                                  `/user-management/users/edit/${row?.id}`
                                );
                              }}
                            >
                              <IconPencil width={20} height={20} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={(event) => {
                                event.stopPropagation();
                                onDelete(row?.id);
                              }}
                            >
                              <IconTrash width={20} height={20} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: 69 * emptyRows,
                      }}
                    >
                      <TableCell colSpan={7} />
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
            rowsPerPageOptions={[5, 10, 25]}
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
      </Box>
    </Box>
  );
};

export default CreativeTable;
