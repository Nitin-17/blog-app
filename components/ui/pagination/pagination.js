import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center space-x-4 mt-6 mb-4">
    <button
      className={currentPage === 1 ? `btn opacity-30` : "btn text-[#fe4f70]"}
      disabled={currentPage === 1}
      onClick={() => onPageChange(currentPage - 1)}
    >
      <span>
        <FontAwesomeIcon icon={faAngleLeft} size="lg" />
      </span>
    </button>
    <span>
      Page {currentPage} of {totalPages}
    </span>
    <button
      className={
        currentPage === totalPages ? `btn opacity-30` : "btn text-[#fe4f70]"
      }
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(currentPage + 1)}
    >
      <span>
        <FontAwesomeIcon icon={faAngleRight} size="lg" />
      </span>
    </button>
  </div>
);

export default Pagination;
