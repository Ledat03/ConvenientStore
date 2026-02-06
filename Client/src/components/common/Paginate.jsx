import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
function Paginate(props) {
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  console.log(props.item);
  useEffect(() => {
    if (props.item) {
      const endOffset = itemOffset + props.itemsPerPage;
      props.setPaginatedItem(props.item.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(props.totalItem / props.itemsPerPage));
    }
  }, [itemOffset, props.itemsPerPage, props.filters, props.totalItem, props.sortBy, props.reload]);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * props.itemsPerPage) % props.item.length;
    setItemOffset(newOffset);
  };
  return (
    <>
      <ReactPaginate className="pagination" nextLabel="Trang Sau >" onPageChange={handlePageClick} pageRangeDisplayed={3} marginPagesDisplayed={2} pageCount={pageCount} previousLabel="< Trang Trước" pageClassName="page-item" pageLinkClassName="page-link" previousClassName="page-item" previousLinkClassName="page-link" nextClassName="page-item" nextLinkClassName="page-link" breakLabel="..." breakClassName="page-item" breakLinkClassName="page-link" containerClassName="pagination" activeClassName="active" renderOnZeroPageCount={null} />
    </>
  );
}
export default Paginate;
