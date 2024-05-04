import React, {useCallback, useEffect, useMemo, useState} from "react";
import Breadcrumb from "@/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import CreativeTable from "./UserTable";
import BlankCard from "@/components/shared/BlankCard";
import {Button, Box} from "@mui/material";
import {useSelector} from "react-redux";
import {dispatch} from "@/store/Store";
import {fetchListUser} from "@/store/apps/system";
import {createSearchParams, Link, useSearchParams,} from "react-router-dom";
import systemApi from "@/services/apis/system.api";
import {toast} from "react-toastify";
import ModalConfirm from "@/components/modal/ModalConfirm";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "List User",
  },
];

const UserPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const system = useSelector((state) => state.system);
  const { userData, loadingUserData } = system;

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
      page: params?.page || 1,
      limit: params?.limit || 5,
    };
  }, [searchParams]);

  useEffect(() => {
    fetchData(queryParams);
  }, [queryParams, dispatch]);

  const fetchData = (queryParams) => {
    const { limit, page, status, search } = queryParams;
    const params = {
      page,
      per_page: limit,
    };
    if (status !== "all") {
      params[`ft[status][v]`] = status;
      params[`ft[status][o]`] = "eq";
    }
    if (search) {
      params[`ft[name][v]`] = search;
      params[`ft[name][o]`] = "cn";
    }
    dispatch(fetchListUser(params));
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
      <Breadcrumb title="List User" items={BCrumb}>
        <Button
          color="primary"
          variant="contained"
          component={Link}
          to="/user-management/users/add-new"
          disableElevation
        >
          New user
        </Button>
      </Breadcrumb>
      <BlankCard isLoading={loadingUserData}>
        <CreativeTable
          tableData={userData?.tableData}
          metaData={userData?.meta}
          loadingTable={loadingUserData}
          filters={queryParams}
          handleFilters={handleFilters}
          onDelete={(id) => {
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
        title="Delete User"
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
            await systemApi.deleteUser(id);
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

export default UserPage;
