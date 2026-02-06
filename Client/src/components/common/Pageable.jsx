import { useState } from "react";
import "../../assets/scss/paginate.scss"
const Pageable = ({ total, pageChange }) => {
    const formatTotal = total % 8 !== 0 ? Math.round(total / 8) + 1 : Math.round(total / 8);
    console.log(formatTotal)
    const [currentPage, setCurrentPage] = useState(0);
    console.log(currentPage)
    const getPrevious = async () => {
        setCurrentPage(currentPage - 1)
        pageChange(prev => ({ ...prev, page: currentPage - 1 }));
    }
    const getNext = async () => {
        setCurrentPage(currentPage + 1)
        pageChange(prev => ({ ...prev, page: currentPage + 1 }));
    }
    const getSelectPage = async (index) => {
        if (index === currentPage) {
            return;
        }
        setCurrentPage(index)
        pageChange(prev => ({ ...prev, page: index }));
    }
    return (<>
        <div className="paginate">
            {currentPage !== 0 && <button className="paginate_button" onClick={getPrevious}>Previous</button>}
            {
                Array.from({ length: formatTotal }, (_, index) => {
                    return <button key={index} className="paginate_button" onClick={() => getSelectPage(index)}>
                        {index + 1}
                    </button>
                })}
            {currentPage !== formatTotal - 1 && <button className="paginate_button" onClick={getNext}>Next</button>}
        </div>
    </>)
}
export default Pageable;