import React, { useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import withRouter from "../../components/Common/withRouter";

// import Components
import Header from "./Header";
import Footer from "./Footer";
import RightSidebar from "../../components/Common/RightSideBar";

//redux
import { useSelector, useDispatch } from "react-redux";

import {
  changeLayout,
  changeLayoutMode,
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
  showRightSidebarAction,
} from "../../store/actions";
import Cookies from "js-cookie";

import { createSelector } from "reselect";
import AdminSidebar from "./AdminSidebar";

const Layout = (props) => {
  const userRole = JSON.parse(Cookies.get("userRole"));

  const dispatch = useDispatch();

  const selectLayoutState = (state) => state.Layout;
  const selectLayoutProperties = createSelector(
    selectLayoutState,
    (layout) => ({
      layoutModeTypes: layout.layoutModeTypes,
      leftSideBarType: layout.leftSideBarType,
      layoutWidth: layout.layoutWidth,
      topbarTheme: layout.topbarTheme,
      showRightSidebar: layout.showRightSidebar,
      leftSideBarTheme: layout.leftSideBarTheme,
    })
  );

  const {
    layoutModeTypes,
    layoutWidth,
    leftSideBarType,
    topbarTheme,
    showRightSidebar,
    leftSideBarTheme,
  } = useSelector(selectLayoutProperties);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const toggleMenuCallback = () => {
    if (leftSideBarType === "default") {
      dispatch(changeSidebarType("condensed", isMobile));
    } else if (leftSideBarType === "condensed") {
      dispatch(changeSidebarType("default", isMobile));
    }
  };

  //hides right sidebar on body click
  const hideRightbar = useCallback(
    (event) => {
      var rightbar = document.getElementById("right-bar");
      //if clicked in inside right bar, then do nothing
      if (rightbar && rightbar.contains(event.target)) {
        return;
      } else {
        //if clicked in outside of rightbar then fire action for hide rightbar
        dispatch(showRightSidebarAction(false));
      }
    },
    [dispatch]
  );

  /*
  layout  settings
  */

  useEffect(() => {
    if (
      // layoutTypes ||
      layoutModeTypes ||
      leftSideBarTheme ||
      layoutWidth ||
      leftSideBarType ||
      topbarTheme
    ) {
      window.dispatchEvent(new Event("resize"));
      dispatch(changeLayout("vertical"));
      dispatch(changeLayoutMode(layoutModeTypes));
      dispatch(changeSidebarTheme(leftSideBarTheme));
      dispatch(changeLayoutWidth(layoutWidth));
      dispatch(changeSidebarType(leftSideBarType));
      dispatch(changeTopbarTheme(topbarTheme));
    }
  }, [
    // layoutTypes,
    layoutModeTypes,
    leftSideBarTheme,
    layoutWidth,
    leftSideBarType,
    topbarTheme,
    dispatch,
  ]);

  useEffect(() => {
    //init body click event fot toggle rightbar
    document.body.addEventListener("click", hideRightbar, true);
  }, [hideRightbar]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // return (
  //   <React.Fragment>
  //     <div id="layout-wrapper" className="layout-wrapper">
  //       <Header toggleMenuCallback={toggleMenuCallback} />
  //       {/* <Sidebar
  //         theme={leftSideBarTheme}
  //         type={leftSideBarType}
  //         isMobile={isMobile}
  //       /> */}
  //       <div className="main-content">{props.children}</div>
  //       <Footer />
  //     </div>
  //     {showRightSidebar ? <RightSidebar /> : null}
  //   </React.Fragment>
  // );

  if (userRole === "admin") {
    // Display admin layout
    return (
      <div id="admin-layout-wrapper" className="admin-layout-wrapper">
        {/* Admin layout components here */}
        <AdminSidebar />
        <div style={{ width: "100%" }} className="admin-main-content">
          {props.children}
        </div>
        {/* <AdminFooter /> */}
      </div>
    );
  }
  // Display regular layout
  return (
    <div id="layout-wrapper" className="layout-wrapper">
      <Header toggleMenuCallback={toggleMenuCallback} />
      {/* <Sidebar
        theme={leftSideBarTheme}
        type={leftSideBarType}
        isMobile={isMobile}
      /> */}
      <div className="main-content">{props.children}</div>
      <Footer />
    </div>
  );
};

Layout.propTypes = {
  changeLayoutWidth: PropTypes.func,
  changeLayoutMode: PropTypes.func,
  changeSidebarTheme: PropTypes.func,
  changeSidebarType: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  children: PropTypes.object,
  layoutWidth: PropTypes.any,
  leftSideBarTheme: PropTypes.any,
  leftSideBarType: PropTypes.any,
  location: PropTypes.object,
  showRightSidebar: PropTypes.any,
  topbarTheme: PropTypes.any,
};

export default withRouter(Layout);
