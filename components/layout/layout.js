import React from "react";
import { useRouter } from "next/router";
import MainNavigation from "./main-navigation";
import classes from "./layout.module.css";
import { navigationMenu } from "../../lib/menu";
import Footer from "../ui/footer";

const Layout = (props) => {
  const router = useRouter();

  // Define routes where the navbar should not be shown
  const adminRoutes = [
    "/admin",
    "/admin/panel/add-post",
    "/admin/panel/add-category",
    "/admin/panel/edit-post/[id]",
    "/admin/panel/post-list",
    "/admin/panel/manage-users",
  ];

  const isAdminRoute = adminRoutes.includes(router.pathname);

  return (
    <div className={classes.header}>
      <div>
        {!isAdminRoute && <MainNavigation menuItems={navigationMenu} />}
      </div>
      <div>
        <main>{props.children}</main>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
