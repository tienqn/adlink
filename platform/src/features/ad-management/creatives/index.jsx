import React, {useCallback, useEffect, useMemo, useState} from "react";
import Breadcrumb from "@/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import CreativeTable from "./CreativeTable";
import BlankCard from "@/components/shared/BlankCard";
import {Button, Box} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {fetchListCreative} from "@/store/apps/ad-management/CreativeSlice";
import {createSearchParams, Link, useLocation, useSearchParams,} from "react-router-dom";
import adManagementApi from "@/services/apis/adManagement.api";
import {toast} from "react-toastify";
import ModalConfirm from "@/components/modal/ModalConfirm";

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "List Creative",
    },
];

const CreativePage = () => {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const global = useSelector((state) => state.global);
    const {listSite} = global;
    const dispatch = useDispatch();
    const creative = useSelector((state) => state.creative);
    const {creativeData, loadingCreativeData} = creative;

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
        fetchData(queryParams);
    }, [queryParams, dispatch]);

    const fetchData = (queryParams) => {
        const {limit, page, status, search, domain} = queryParams;
        const params = {
            page,
            per_page: limit,
        };
        if (status !== "all") {
            params[`ft[status][v]`] = status;
            params[`ft[status][o]`] = "eq";
        }
        if (domain !== "all") {
            // params[`ft[site_id][v]`] = domain;
            // params[`ft[site_id][o]`] = "eq";
            params[`site_id`] = domain;
            // params[`ft[site_id][o]`] = "eq";
        }
        if (search) {
            params[`ft[name][v]`] = search;
            params[`ft[name][o]`] = "cn";
        }
        dispatch(fetchListCreative(params));
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
        <Box

        >
            <Breadcrumb title="List Creative" items={BCrumb}>
                <Button
                    color="primary"
                    variant="contained"
                    component={Link}
                    to="/ad-management/creatives/add-new"
                    disableElevation
                >
                    New creative
                </Button>
            </Breadcrumb>
            <BlankCard isLoading={loadingCreativeData}>
                <CreativeTable
                    listSite={listSite}
                    tableData={creativeData?.tableData}
                    metaData={creativeData?.meta}
                    loadingTable={loadingCreativeData}
                    filters={queryParams}
                    handleFilters={handleFilters}
                    onDelete={(id) =>
                        setModalConfirm({
                            ...modalConfirm,
                            open: true,
                            data: id,
                        })
                    }
                />
            </BlankCard>
            <ModalConfirm
                open={modalConfirm?.open}
                loading={modalConfirm?.loadingSubmit}
                data={modalConfirm?.data}
                title="Delete Creative"
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
                        await adManagementApi.deleteCreative(id);
                        toast.success("Delete successfull");
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

export default CreativePage;
