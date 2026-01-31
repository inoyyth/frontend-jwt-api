import type { FC } from "react";

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    total_page: number;
}

type Props = {
    dt: Pagination,
    paginationParams: PaginationParams,
    onNext: () => void,
    onPrevious: () => void
}   

const Pagination: FC<Props> = ({dt, paginationParams, onNext, onPrevious}: Props) => {
    return (
        <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-muted">
                Showing {((paginationParams.page - 1) * paginationParams.limit) + 1} to {Math.min(paginationParams.page * paginationParams.limit, dt.total)} of {dt.total} entries
            </div>
            <div className="d-flex gap-1">
                <button 
                    className="btn btn-sm btn-outline-primary" 
                    onClick={() => {
                        onPrevious();
                    }}
                    disabled={paginationParams.page <= 1}
                >
                    Previous
                </button>
                <span className="btn btn-sm btn-outline-secondary disabled">
                    Page {paginationParams.page} of {dt.total_page}
                </span>
                <button 
                    className="btn btn-sm btn-outline-primary" 
                    onClick={() => {
                        onNext();
                    }}
                    disabled={paginationParams.page >= dt.total_page}
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default Pagination