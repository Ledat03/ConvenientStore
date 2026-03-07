import "../../assets/scss/paginate.scss"
const Pageable = ({ total, pageChange, currentPage }) => {
    const pageSize = 8;
    const totalPages = Math.ceil(total / pageSize);
    const getPrevious = async () => {
        pageChange(prev => ({ ...prev, page: currentPage - 1 }));
    }
    const getNext = async () => {
        pageChange(prev => ({ ...prev, page: currentPage + 1 }));
    }
    const getSelectPage = async (index) => {
        if (index === currentPage) {
            return;
        }
        pageChange(prev => ({ ...prev, page: index }));
    }
    return (
        <>
            <div className="paginate">
                {currentPage !== 0 && <button className="paginate_button" onClick={getPrevious}>Previous</button>}
                {
                    Array.from({ length: totalPages }, (_, index) => {
                        return <button key={index} className="paginate_button" onClick={() => getSelectPage(index)}>
                            {index + 1}
                        </button>
                    })}
                {currentPage !== totalPages - 1 && <button className="paginate_button" onClick={getNext}>Next</button>}
            </div>
        </>)
}
export default Pageable;