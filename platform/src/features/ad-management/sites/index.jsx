import React, {useCallback, useEffect, useMemo} from "react";
import Breadcrumb from "@/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import TableSite from "./TableSite";
import BlankCard from "@/components/shared/BlankCard";
import {Button, Box} from "@mui/material";
import {createSearchParams, Link, useLocation, useSearchParams,} from "react-router-dom";
import {useSelector} from "react-redux";
import {dispatch} from "@/store/Store";
import {fetchListCategory, fetchListSite,} from "@/store/apps/ad-management/SiteSlice";

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Sites",
    },
];

const SitePage = () => {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const site = useSelector((state) => state.site);
    const {siteData, loadingSiteData} = site;

    const queryParams = useMemo(() => {
        const params = {};
        searchParams.forEach((key, value) => {
            params[`${value}`] = key;
        });
        return {
            ...params,
            search: params?.search || "",
            status: params?.status || "all",
            page: params?.page || 1,
            limit: params?.limit || 20,
        };
    }, [searchParams]);

    useEffect(() => {
        dispatch(fetchListCategory());
    }, []);

    useEffect(() => {
        fetchData(queryParams);
    }, [queryParams, dispatch]);

    const fetchData = (queryParams) => {
        const {limit, page, status, search} = queryParams;
        const params = {
            page,
            per_page: limit,
        };
        if (status !== "all") {
            params[`ft[status][v]`] = status;
            params[`ft[status][o]`] = "eq";
        }
        if (search) {
            params[`ft[domain][v]`] = search;
            params[`ft[domain][o]`] = "cn";
        }
        dispatch(fetchListSite(params));
    };

    const handleFilters = useCallback(
        (data) => {
            setSearchParams(
                createSearchParams({
                    ...queryParams,
                    ...data,
                })
            );
        },
        [queryParams]
    );

    return (
        <Box >
            <Breadcrumb title="List Site" items={BCrumb}>
                <Button
                    color="primary"
                    variant="contained"
                    component={Link}
                    to="/ad-management/sites/add-new"
                    disableElevation
                    sx={{
                        width: "120px",
                    }}
                >
                    New site
                </Button>
            </Breadcrumb>
            <BlankCard isLoading={loadingSiteData}>
                <TableSite
                    tableData={siteData?.tableData}
                    metaData={siteData?.meta}
                    loadingTable={loadingSiteData}
                    filters={queryParams}
                    handleFilters={handleFilters}
                />
            </BlankCard>
        </Box>
    );
};

export default SitePage;
