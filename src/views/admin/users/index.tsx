import SidebarMenu from "../../../components/SidebarMenu"
import { useModal } from "../../../hooks/modal/useModal.ts"
import FormUser from "./components/form.tsx" 
import { useToast } from "../../../hooks/toast/useToast.ts"
import { useEffect, useState, useRef, useCallback } from "react"
import { useToastAuth } from "../../../hooks/auth/useToastAuth.tsx"
import TableUser from "./components/table.tsx"
import Pagination from "../../../components/shared/pagination/index.tsx"
import BlobHandler from "../../../utils/blobHandler"
import { useUser } from "../../../hooks/user/useUser.tsx"
import type { User } from "../../../types/user.type.ts"
import type { UserQueryParams } from "../../../types/user.type.ts"
        
const Users = () => {
    const [paginationParams, setPaginationParams] = useState<UserQueryParams>({
        keyword: '',
        page: 1,
        limit: 10
    });
    const [searchTerm, setSearchTerm] = useState('');
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const { getUser, removeUser, downloadCsv, downloadExcel } = useUser(paginationParams)
    const { data: users, isLoading, isError, error, refetch } = getUser
    const { isLoading: isCsvLoading, refetch: refetchCsv } = downloadCsv
    const { isLoading: isExcelLoading, refetch: refetchExcel } = downloadExcel
    const { showModal, hideModal } = useModal()
    const { addToast } = useToast()
    const toastAuth = useToastAuth()
    const { mutate: removeUserMutation, isPending: isRemoveUserPending } = removeUser

    const openModal = useCallback((data: User | null) => {
        showModal('user-form-modal', 
            <FormUser 
                fetchUser={() => {
                    refetch()
                }}
                data={data}
            />,
            { title: data ? 'Edit User' : 'Add User', size: 'lg', closeOnOverlayClick: false }
        );
    }, []);

    const confirmDeleteModal = (data: User) => {
         showModal('user-form-modal', 
            <div>
                <div>Yakin Hapus data {data.name} ?</div>
                <div className="d-flex gap-1 justify-content-center mt-2">
                    <button className="btn btn-primary" onClick={() => removeUserMutation(data.id, {
                        onSuccess: () => {
                            refetch()
                            hideModal('user-form-modal')
                            addToast('user-form-toast', 'User deleted successfully', 'success', {title: 'Success'})
                        }
                    })} disabled={isRemoveUserPending}>Ya</button>
                    <button className="btn btn-danger" onClick={() => hideModal('user-form-modal')} disabled={isRemoveUserPending}>Tidak</button>
                </div>
            </div>,
            { title: 'Hapus User', size: 'sm', closeOnOverlayClick: false }
        );
    }

    const handleDownloadCsv= () => {
      refetchCsv().then((dt) => {
        if (dt.data) {
            console.log(dt)
            BlobHandler.downloadBlobWithAutoExtension(dt.data.data, 'users_export');
        }
      });
    }

    const handleDownloadExcel = () => {
      refetchExcel().then((dt) => {
        if (dt.data) {
            console.log(dt)
            BlobHandler.downloadBlobWithAutoExtension(dt.data.data, 'users_export');
        }
      });
    }

    // Debounce search term to prevent excessive API calls
    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            setPaginationParams(prev => ({ 
                ...prev, 
                keyword: searchTerm,
                page: 1 // Reset to page 1 when searching
            }));
        }, 500); // 500ms debounce delay

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [searchTerm]);

    useEffect(() => {
   // if error status is 401, show toast
   if (error && 'status' in error && error.status === 401) {
    toastAuth()
   }
   }, [error, addToast])

    return (
        <div className="mt-5 mb-5">
            <div className="row">
                <div className="col-md-3">
                    <SidebarMenu />
                </div>
                <div className="col-md-9">
                    <div className="card border-0 rounded-4 shadow-sm">
                        <div className="card-header">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="fw-bold">USERS</div>
                                <div className="d-flex gap-2 align-items-center">
                                    <input 
                                        type="text" 
                                        className="form-control form-control-sm" 
                                        placeholder="Search by name..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                        }}
                                        style={{ width: '200px' }}
                                    />
                                    <button className="btn btn-primary btn-sm rounded-pill" onClick={() => openModal(null)}>Add User</button>
                                    <button className="btn btn-success btn-sm rounded" disabled={isExcelLoading} onClick={() => handleDownloadExcel()}>Excel</button>
                                    <button className="btn btn-success btn-sm rounded" disabled={isCsvLoading} onClick={() => handleDownloadCsv()}>CSV</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            {isLoading && <p>Loading...</p>}
                            {isError && <p>Error loading users</p>}
                            {users?.data && <TableUser users={users.data} openModal={openModal} confirmDeleteModal={confirmDeleteModal} />}
                            {users?.pagination && ( <Pagination
                                dt={users.pagination}
                                paginationParams={paginationParams}
                                onPrevious={() => setPaginationParams(prev => ({ ...prev, page: prev.page - 1 }))}
                                onNext={() => setPaginationParams(prev => ({ ...prev, page: prev.page + 1 }))}
                            />)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Users