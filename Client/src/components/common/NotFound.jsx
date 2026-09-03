import "../auth/css/auth.scss"
export const NotFound = () => {
    return <>
        <div className="Not-Found">
            <div className="Not-Found-container">
                <h1 className="Not-Found-container__404">404 Not Found</h1>
                <p className="Not-Found-container__text">Xin lỗi, trang bạn đang tìm kiếm không tồn tại !</p>
                <a href="/" className="Not-Found-container__button">Quay lại trang chủ </a>
            </div>
        </div>
    </>
}