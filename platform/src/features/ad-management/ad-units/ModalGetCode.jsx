import * as React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { CircularProgress } from "@mui/material";
import {toast} from "react-toastify";
import BlankCard from '@/components/shared/BlankCard';
import {useSelector} from "react-redux";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({
                                             open,
                                             data,
                                             onClose,
                                         }) {
    const { creativeId=null, isCreativeCode} = data||{};

    const global = useSelector((state) => state.global);
    const {listSite} = global;

    const adUnit = useSelector((state) => state.adUnit);
    const {currentAdUnitDetails} = adUnit;



    let modalData = {};
    if(isCreativeCode) {
        modalData = currentAdUnitDetails
    } else {
        modalData = data
    }

    const {code, site_id, sizes=[], creatives} = modalData||{};

    const _creatives = creatives?.data || [];
    const findDomain = (listSite||[]).filter(site => site?.id===site_id);
    const domain = findDomain[0] ? findDomain[0]?.domain : "";

    const _sizes =  sizes.map(size => size?.key ? size?.key :size).map(size=> {
        let newSize = size.split("x");
        if(!Number.isInteger(newSize[0]*1)) {
            return [1,1]
        }
        return [newSize[0], newSize[1]];
    });
    const findCreative = _creatives.filter(creative => creative?.id===creativeId);

    const creative_code = findCreative?.[0]?.code;

    const renderedText = JSON.stringify(_sizes)
        .replace(/"/g, "")
        .replace(/\],\[/g, "], [");

    let codeCopy = `<div class="adsbyadlink" id="adsbyadlink-${code}${creativeId ? `-${creative_code}` : ""}"></div>
    <script> 
    function loadAdlinkSDK(n){var t=document.getElementById("adlink-sdk");t||((t=document.createElement("script")).type="text/javascript",t.async=!0,t.id="adlink-sdk",t.src="https://syndication.adlinknetwork.vn/${domain}.min.js?v=2",document.head.appendChild(t)),t.onload=n}
    loadAdlinkSDK(function() {
        AdLinkDelivery.getTag({adunit: "${code}", sizes: ${renderedText}${creativeId ? `, creative: "${creative_code}"` : ""}});
    });
    </script>`;

    // console.log("modalData ",modalData);
    // console.log(findCreative)
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onClose}
            aria-describedby="alert-dialog-slide-description"
            fullWidth={true}
            maxWidth={"md"}
        >
            <DialogTitle>Get code ad unit ({creativeId? "pass-back":"main"}) - <span style={{
                color:"red"
            }}>{creativeId ? findCreative?.[0]?.name :modalData?.name}</span></DialogTitle>
            <DialogContent

            >
                <DialogContentText id="alert-dialog-slide-description">
                    <BlankCard >
                        <Typography mt={1} pb={4} sx={{
                            color:"red",
                            padding:"4px",
                        }}>If code is undefined, please reload page to get new code.</Typography>
                        <Box sx={{
                            position:"relative",
                        }}>
                            <pre style={{overflowX: "scroll"}}>{codeCopy}</pre>
                            <IconButton
                                disableElevation
                                sx={{
                                    position:"absolute",
                                    top:1,
                                    right:1
                                }}
                                className='absolute top-1 right-1'
                                onClick={() => {
                                    navigator.clipboard.writeText(`${codeCopy}`);
                                    toast.success('Copy this code to clipboard');
                                }}
                            >
                                <svg
                                    width='20'
                                    height='20'
                                    fill='currentColor'
                                    viewBox='0 0 24 24'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        d='M3.25 9A5.75 5.75 0 0 1 9 3.25h7.013a.75.75 0 0 1 0 1.5H9A4.25 4.25 0 0 0 4.75 9v7.107a.75.75 0 0 1-1.5 0V9Z'></path>
                                    <path
                                        d='M18.403 6.793a44.372 44.372 0 0 0-9.806 0 2.011 2.011 0 0 0-1.774 1.76 42.581 42.581 0 0 0 0 9.893 2.01 2.01 0 0 0 1.774 1.76c3.241.363 6.565.363 9.806 0a2.01 2.01 0 0 0 1.774-1.76 42.579 42.579 0 0 0 0-9.893 2.011 2.011 0 0 0-1.774-1.76Z'></path>
                                </svg>
                            </IconButton>
                        </Box>
                    </BlankCard>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    sx={{
                        width: "120px",
                        height: "40px",
                    }}
                >
                    Close
                </Button>
                <Button
                    onClick={() => {
                        navigator.clipboard.writeText(`${codeCopy}`);
                        toast.success('Copy this code to clipboard');
                    }}
                    sx={{
                        width: "120px",
                        height: "40px",
                    }}
                    color="primary"
                    variant="contained"
                >
                    Copy code
                </Button>
            </DialogActions>
        </Dialog>
    );
}
