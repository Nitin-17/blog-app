import React from "react";
import { useRouter } from "next/router";
import classes from "./page-header.module.css";

const PageHeader = () => {
  const router = useRouter();
  const { category } = router.query;
  return (
    <>
      <div className={`bg-[#f1f8ff] py-8 pt-8  w-full ${classes.container}`}>
        <div className="w-full text-center">
          <h1 className="text-4xl font-semibold text-blue-900 mb-4">
            {category}
          </h1>
          <p className="text-sm text-gray-500">
            <span key={category}>Apollo / {category}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default PageHeader;
