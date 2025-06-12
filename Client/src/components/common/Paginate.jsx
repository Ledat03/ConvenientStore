import ReactPaginate from "react-paginate";
import React, { useEffect, useState } from "react";
function Paginate(props) {
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  useEffect(() => {
    const endOffset = itemOffset + props.itemsPerPage;
    props.setPaginatedProduct(props.product.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(props.totalProduct / props.itemsPerPage));
  }, [itemOffset, props.itemsPerPage, props.filters, props.totalProduct]);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * props.itemsPerPage) % props.product.length;
    console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
    setItemOffset(newOffset);
  };
  return (
    <>
      <ReactPaginate className="pagination" nextLabel="Trang Sau >" onPageChange={handlePageClick} pageRangeDisplayed={3} marginPagesDisplayed={2} pageCount={pageCount} previousLabel="< Trang Trước" pageClassName="page-item" pageLinkClassName="page-link" previousClassName="page-item" previousLinkClassName="page-link" nextClassName="page-item" nextLinkClassName="page-link" breakLabel="..." breakClassName="page-item" breakLinkClassName="page-link" containerClassName="pagination" activeClassName="active" renderOnZeroPageCount={null} />
    </>
  );
}
export default Paginate;
