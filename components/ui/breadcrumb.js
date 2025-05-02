import React from "react";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Breadcrumb = ({ category = "Uncategorized", title = "Untitled" }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 justify-start mb-8 text-[#7d899a]">
      <span className="flex items-center">
        Apollo{" "}
        <FontAwesomeIcon icon={faAngleRight} size="sm" className="mx-2" />
      </span>
      {category && (
        <span className="flex items-center">
          {category}
          <FontAwesomeIcon icon={faAngleRight} size="sm" className="mx-2" />
        </span>
      )}
      {title && <span>{title}</span>}
    </div>
  );
};

export default Breadcrumb;
