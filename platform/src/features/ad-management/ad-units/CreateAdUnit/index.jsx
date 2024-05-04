import React, {useState, useRef} from "react";
import {Box, Button, Tab,} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Breadcrumb from "@/layouts/full/shared/breadcrumb/Breadcrumb";
import BlankCard from "@/components/shared/BlankCard";
import SettingsForm from "@/features/ad-management/ad-units/Form/SettingsForm.jsx";
import CreativesForm from "@/features/ad-management/ad-units/Form/CreativesForm.jsx";
import {useSelector} from "react-redux";
import {setCurrentAdUnitDetails} from "@/store/apps/ad-management/AdUnitSlice.js";
import {dispatch} from "@/store/Store.js";

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        to: "/ad-management/ad-units",
        title: "Ad Units",
    },
    {
        title: "Add New Ad Unit",
    },
];

const CreateAdUnit = () => {
    const global = useSelector((state) => state.global);
    const {listSite} = global;
    const [currentTab, setCurrentTab] = useState("settings"); // settings | creatives

    const handleChangeTab = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const formRefSetting = useRef();
    const formRefCreative = useRef();

    return (
        <Box>
            {/* breadcrumb */}
            <Breadcrumb title="Add New Ad Unit" items={BCrumb}>
                <Button
                    color="primary"
                    variant="contained"
                    disableElevation
                    sx={{
                        width: "120px",
                        height: "40px",
                    }}
                    onClick={() => {
                        if(currentTab==="settings") {
                            if(formRefSetting?.current) {
                                formRefSetting?.current?.requestSubmit()
                            }
                        }else if(currentTab==="creatives") {
                            if(formRefCreative?.current) {
                                formRefCreative?.current?.requestSubmit()
                            }
                        }

                    }}
                >
                    Save
                </Button>
            </Breadcrumb>
            {/* end breadcrumb */}

            <BlankCard>
                <TabContext value={currentTab}>
                    <Box
                        sx={{
                            borderBottom: 1,
                            borderColor: (theme) => theme.palette.divider,
                        }}
                    >
                        <TabList
                            // onChange={handleChangeTab}
                            aria-label="lab API tabs example"
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            <Tab label="Settings" value="settings"/>
                            <Tab label="Creatives" value="creatives"/>
                        </TabList>
                    </Box>
                    <TabPanel value="settings">
                        <SettingsForm
                            listSite={listSite}
                            onCreativeSuccess={(data) => {
                                setCurrentTab("creatives");
                                dispatch(setCurrentAdUnitDetails(data))
                            }}
                            formRefSetting={formRefSetting}
                        />
                    </TabPanel>
                    <TabPanel value="creatives">
                        <CreativesForm formRefCreative={formRefCreative} />
                    </TabPanel>
                </TabContext>
            </BlankCard>
        </Box>
    );
};

export default CreateAdUnit;
