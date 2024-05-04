import React from "react";
import Menuitems from "./MenuItems";
import { useLocation } from "react-router";
import { Box, List, useMediaQuery } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { toggleMobileSidebar } from "src/store/customizer/CustomizerSlice";
import NavItem from "./NavItem";
import NavCollapse from "./NavCollapse";
import NavGroup from "./NavGroup/NavGroup";

const SidebarItems = () => {
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf("/"));
  const customizer = useSelector((state) => state.customizer);
  const system = useSelector((state) => state.system);
  const {userProfile} = system;
  const roles = (userProfile?.roles?.data || []).map(role => role?.name);
  const roleTitle = roles[0] || "";

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const hideMenu = lgUp
    ? customizer.isCollapse && !customizer.isSidebarHover
    : "";
  const dispatch = useDispatch();

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {Menuitems.map((item, index) => {
          // {/********SubHeader**********/}
          if (item.subheader) {
            if(!item?.requireRoles || (item?.requireRoles||[])?.length===0){
              return (
                  <NavGroup item={item} hideMenu={hideMenu} key={item.subheader} />
              );
            } else {
              if(item?.requireRoles.includes(roleTitle)) {
                return (
                    <NavGroup item={item} hideMenu={hideMenu} key={item.subheader} />
                );
              }
            }
            // {/********If Sub Menu**********/}
            /* eslint no-else-return: "off" */
          } else if (item.children) {
            return (
              <NavCollapse
                menu={item}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                pathWithoutLastPart={pathWithoutLastPart}
                level={1}
                key={item.id}
                onClick={() => dispatch(toggleMobileSidebar())}
              />
            );

            // {/********If Sub No Menu**********/}
          } else {

            if(!item?.requireRoles || (item?.requireRoles||[])?.length===0){
              return (
                  <NavItem
                      item={item}
                      key={item.id}
                      pathDirect={pathDirect}
                      hideMenu={hideMenu}
                      onClick={() => dispatch(toggleMobileSidebar())}
                  />
              );
            } else {
              if(item?.requireRoles.includes(roleTitle)) {
                return (
                    <NavItem
                        item={item}
                        key={item.id}
                        pathDirect={pathDirect}
                        hideMenu={hideMenu}
                        onClick={() => dispatch(toggleMobileSidebar())}
                    />
                );
              }
            }

            // return (
            //   <NavItem
            //     item={item}
            //     key={item.id}
            //     pathDirect={pathDirect}
            //     hideMenu={hideMenu}
            //     onClick={() => dispatch(toggleMobileSidebar())}
            //   />
            // );
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
