import {Box, TableCell, TableHead, TableRow, TableSortLabel,} from "@mui/material";
import PropTypes from "prop-types";
import CustomCheckbox from "@/components/forms/theme-elements/CustomCheckbox";
import {visuallyHidden} from "@mui/utils";

const headCells = [
    {
        id: "name",
        numeric: false,
        disablePadding: false,
        label: "Name",
    },
    {
        id: "siteName",
        numeric: false,
        disablePadding: false,
        label: "Site",
    },
    {
        id: "status",
        numeric: false,
        disablePadding: false,
        label: "Status",
        align: "center",
    },
    {
        id: "size",
        numeric: false,
        disablePadding: false,
        label: "Size",
        align: "center",
    },
    {
        id: "start_time",
        numeric: false,
        disablePadding: false,
        label: "Start time",
        align: "center",
    },
    {
        id: "end_time",
        numeric: false,
        disablePadding: false,
        label: "End time",
        align: "center",
    },
    {
        id: "action",
        numeric: false,
        disablePadding: false,
        label: "Action",
        align: "right",
    },
];

function EnhancedTableHead(props) {
    const {
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {/*<TableCell padding="checkbox">*/}
                {/*    <CustomCheckbox*/}
                {/*        color="primary"*/}
                {/*        checked={rowCount > 0 && numSelected === rowCount}*/}
                {/*        onChange={onSelectAllClick}*/}
                {/*        inputprops={{*/}
                {/*            "aria-label": "select all desserts",*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</TableCell>*/}
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align ? headCell.align : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.label}
                        {/*<TableSortLabel*/}
                        {/*    active={orderBy === headCell.id}*/}
                        {/*    direction={orderBy === headCell.id ? order : "asc"}*/}
                        {/*    onClick={createSortHandler(headCell.id)}*/}
                        {/*>*/}
                        {/*    {headCell.label}*/}
                        {/*    {orderBy === headCell.id ? (*/}
                        {/*        <Box component="span" sx={visuallyHidden}>*/}
                        {/*            {order === "desc" ? "sorted descending" : "sorted ascending"}*/}
                        {/*        </Box>*/}
                        {/*    ) : null}*/}
                        {/*</TableSortLabel>*/}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

export default EnhancedTableHead;
