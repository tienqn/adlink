import React, {useCallback, useEffect, useMemo, useState} from "react";
import Breadcrumb from "@/layouts/full/shared/breadcrumb/Breadcrumb";
import TableAdUnit from "./TableAdUnit";
import BlankCard from "@/components/shared/BlankCard";
import {Button, Box} from "@mui/material";
import {createSearchParams, Link, useSearchParams,} from "react-router-dom";
import {useSelector} from "react-redux";
import {dispatch} from "@/store/Store";
import {fetchListAdUnit} from "@/store/apps/ad-management/AdUnitSlice";
import {fetchListSite} from "@/store/apps/global/GlobalSlice";
import ModalConfirm from "@/components/modal/ModalConfirm";
import {toast} from "react-toastify";
import adManagementApi from "@/services/apis/adManagement.api";

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Ad Units",
    },
];

const AdUnitPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const global = useSelector((state) => state.global);
    const {listSite} = global;
    const adUnit = useSelector((state) => state.adUnit);
    const {adUnitData, loadingAdUnitData} = adUnit;

    const [modalConfirm, setModalConfirm] = useState({
        data: null,
        open: false,
        loadingSubmit: false,
    });

    const queryParams = useMemo(() => {
        const params = {};
        searchParams.forEach((key, value) => {
            params[`${value}`] = key;
        });
        return {
            ...params,
            search: params?.search || "",
            status: params?.status || "all",
            domain: params?.domain || "all",
            page: params?.page || 1,
            limit: params?.limit || 20,
        };
    }, [searchParams]);

    useEffect(() => {
        dispatch(fetchListSite());
    }, []);

    useEffect(() => {
        fetchData(queryParams);
    }, [queryParams, dispatch]);

    const fetchData = (queryParams) => {
        const {limit, page, status, search, domain} = queryParams;
        const params = {
            includes: "creatives,site",
            page,
            per_page: limit,
        };
        if (status !== "all") {
            params[`ft[status][v]`] = status;
            params[`ft[status][o]`] = "eq";
        }
        if (domain !== "all") {
            params[`ft[site_id][v]`] = domain;
            params[`ft[site_id][o]`] = "eq";
            // params[`ft[sites.domain][v]`] = domain;
            //  params[`ft[sites.domain][o]`] = "eq";
        }
        if (search) {
            params[`ft[name][v]`] = search;
            params[`ft[name][o]`] = "cn";
        }
        // site???
        dispatch(fetchListAdUnit(params));
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
            <Breadcrumb title="List Ad Unit" items={BCrumb}>
                <Button
                    color="primary"
                    variant="contained"
                    component={Link}
                    to="/ad-management/ad-units/add-new"
                    disableElevation
                    sx={{
                        width: "120px",
                    }}
                >
                    New Ad Unit
                </Button>
            </Breadcrumb>
            <BlankCard isLoading={loadingAdUnitData}>
                <TableAdUnit
                    listSite={listSite}
                    tableData={adUnitData?.tableData}
                    metaData={adUnitData?.meta}
                    loadingTable={loadingAdUnitData}
                    filters={queryParams}
                    handleFilters={handleFilters}
                    onDelete={(id) =>{
                        setModalConfirm({
                            ...modalConfirm,
                            open: true,
                            data: id,
                        })
                    }}
                />
            </BlankCard>
            <ModalConfirm
                open={modalConfirm?.open}
                loading={modalConfirm?.loadingSubmit}
                data={modalConfirm?.data}
                title="Delete Ad Unit"
                description="Are you sure you want to delete this item?"
                onClose={() =>
                    setModalConfirm({
                        data: null,
                        open: false,
                        loadingSubmit: false,
                    })
                }
                onDelete={async (id) => {
                    setModalConfirm({
                        ...modalConfirm,
                        loadingSubmit: true,
                    });
                    try {
                        await adManagementApi.deleteAdUnit(id);
                        toast.success("Delete successfully");
                        fetchData(queryParams);
                    } catch (error) {
                        toast.error("Delete failed");
                        console.log("error", error);
                    }
                    setModalConfirm({
                        data: null,
                        open: false,
                        loadingSubmit: false,
                    });
                }}
            />
        </Box>
    );
};

export default AdUnitPage;
