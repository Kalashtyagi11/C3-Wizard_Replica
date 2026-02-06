

import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import * as Icon from 'react-feather';

const CustomPagination = ({ pageNumber, pageSize, totalRecords, totalPages, onPageChange }) => {
  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const handlePrevious = () => {
    if (pageNumber > 0) {
      handlePageClick(pageNumber - 1);
    }
  };

  const handleNext = () => {
    if (pageNumber < totalPages - 1) {
      handlePageClick(pageNumber + 1);
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      {/* Record Range Info */}
      <div className="mb-3">
        {totalRecords === 0
          ? '0'
          : `${pageNumber * pageSize + 1}-${Math.min(
              (pageNumber + 1) * pageSize,
              totalRecords,
            )} of ${totalRecords}`}
      </div>

      {/* Pagination */}
      <Pagination>
        {/* Previous */}
        <PaginationItem disabled={pageNumber === 0}>
          <PaginationLink previous onClick={handlePrevious}>
            <Icon.ChevronLeft size={16} /> Back
          </PaginationLink>
        </PaginationItem>

        {/* Render all pages if totalPages <= 5 */}
        {totalPages <= 5 &&
          Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i} active={pageNumber === i}>
              <PaginationLink onClick={() => handlePageClick(i)}>{i + 1}</PaginationLink>
            </PaginationItem>
          ))}

        {/* If on first 3 pages and totalPages > 5 */}
        {pageNumber < 3 && totalPages > 5 && (
          <>
            {Array.from({ length: 4 }, (_, i) => (
              <PaginationItem key={i} active={pageNumber === i}>
                <PaginationLink onClick={() => handlePageClick(i)}>{i + 1}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationLink disabled>...</PaginationLink>
            </PaginationItem>
            <PaginationItem active={pageNumber === totalPages - 1}>
              <PaginationLink onClick={() => handlePageClick(totalPages - 1)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* If in the middle pages */}
        {pageNumber >= 3 && pageNumber < totalPages - 3 && totalPages > 5 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => handlePageClick(0)}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink disabled>...</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink onClick={() => handlePageClick(pageNumber - 1)}>
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem active>
              <PaginationLink>{pageNumber + 1}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink onClick={() => handlePageClick(pageNumber + 1)}>
                {pageNumber + 2}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink disabled>...</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink onClick={() => handlePageClick(totalPages - 1)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* If on last 3 pages and totalPages > 5 */}
        {pageNumber >= totalPages - 3 && totalPages > 5 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => handlePageClick(0)}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink disabled>...</PaginationLink>
            </PaginationItem>
            {Array.from({ length: 4 }, (_, i) => {
              const page = totalPages - 4 + i;
              return (
                <PaginationItem key={page} active={pageNumber === page}>
                  <PaginationLink onClick={() => handlePageClick(page)}>{page + 1}</PaginationLink>
                </PaginationItem>
              );
            })}
          </>
        )}

        {/* Next */}
        <PaginationItem disabled={pageNumber >= totalPages - 1}>
          <PaginationLink next onClick={handleNext}>
            Next <Icon.ChevronRight size={16} />
          </PaginationLink>
        </PaginationItem>
      </Pagination>
    </div>
  );
};

CustomPagination.propTypes = {
  pageNumber: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  totalRecords: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default CustomPagination;
