import React, {useCallback, useEffect, useMemo} from "react";
import Breadcrumb from "@/layouts/full/shared/breadcrumb/Breadcrumb";
import {Button, Box} from "@mui/material";
import {createSearchParams, Link, useLocation, useSearchParams,} from "react-router-dom";
import {useSelector} from "react-redux";
import {dispatch} from "@/store/Store";
import {fetchListStudent} from "@/store/apps/student-management/StudentSlice";

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Students",
    },
];

const StudentPage = () => {

    useEffect(() => {
        dispatch(fetchListStudent());
    }, []);

    return (
        <Box >
            <Breadcrumb title="List Student" items={BCrumb}>
                <Button
                    color="primary"
                    variant="contained"
                    component={Link}
                    to="/student-management/students/add-new"
                    disableElevation
                    sx={{
                        width: "120px",
                    }}
                >
                    New student
                </Button>
            </Breadcrumb>
        </Box>
    );
};

export default StudentPage;
