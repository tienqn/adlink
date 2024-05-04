import PropTypes from "prop-types";
import {Box, IconButton, InputAdornment, MenuItem, TextField, Toolbar, Tooltip, Typography,} from "@mui/material";
import {alpha} from "@mui/material/styles";
import {IconSearch, IconTrash} from "@tabler/icons";
import CustomSelect from "@/components/forms/theme-elements/CustomSelect";
import debounce from "lodash/debounce";
import {useCallback, useState} from "react";

const EnhancedTableToolbar = ({ listSite, numSelected, filters, handleFilters}) => {
    const [searchData, setSearchData] = useState(filters?.search);

    const handleSearchNew = (query) => {
        handleFilters({
            search: query,
        });
    };

    const debouncedHandleSearch = useCallback(debounce(handleSearchNew, 300), [
        filters,
    ]);

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchData(value);
        // Call the debounced function after 300ms
        debouncedHandleSearch(value);
    };

    return (
        <Toolbar
            sx={{
                pl: {sm: 2},
                pr: {xs: 1, sm: 1},
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(
                            theme.palette.primary.main,
                            theme.palette.action.activatedOpacity
                        ),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{flex: "1 1 100%"}}
                    color="inherit"
                    variant="subtitle2"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Box sx={{flex: "1 1 100%", display: "flex", gap: "16px"}}>
                    <TextField
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconSearch size="1.1rem"/>
                                </InputAdornment>
                            ),
                        }}
                        placeholder="Search ..."
                        size="small"
                        onChange={handleSearchChange}
                        value={searchData}
                    />
                    <Box
                        sx={{
                            width: "200px",
                        }}
                    >
                        <CustomSelect
                            labelId="filter-status-creative-list"
                            id="filter-status-creative-list"
                            value={filters?.domain}
                            onChange={(event) => {
                                handleFilters({
                                    domain: event.target.value,
                                });
                            }}
                            fullWidth
                            size="small"
                        >
                            <MenuItem value={"all"}>All Domain</MenuItem>
                            {listSite.map((item, index) => {
                                return (
                                    <MenuItem key={index} value={`${item?.id}`}>
                                        {item?.domain}
                                    </MenuItem>
                                );
                            })}
                        </CustomSelect>
                    </Box>
                </Box>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <IconTrash width="18"/>
                    </IconButton>
                </Tooltip>
            ) : (
                <Box
                    sx={{
                        width: "200px",
                    }}
                >
                    <CustomSelect
                        labelId="filter-status-creative-list"
                        id="filter-status-creative-list"
                        value={filters?.status}
                        onChange={(event) => {
                            handleFilters({
                                status: event.target.value,
                            });
                        }}
                        fullWidth
                        size="small"
                    >
                        <MenuItem value={"all"}>All Status</MenuItem>
                        <MenuItem value={"active"}>Active</MenuItem>
                        <MenuItem value={"inactive"}>InActive</MenuItem>
                    </CustomSelect>
                </Box>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default EnhancedTableToolbar;
