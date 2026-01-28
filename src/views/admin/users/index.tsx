import SidebarMenu from "../../../components/SidebarMenu"
import { useUser, type User, type UserQueryParams } from "../../../hooks/useUser"
import { useModal } from "../../../hooks/modal/useModal.ts"
import FormUser from "./form.tsx" 
import { useToast } from "../../../hooks/toast/useToast.ts"
import { useEffect, useState, useRef, useCallback } from "react"
import { useToastAuth } from "../../../hooks/auth/useToastAuth.tsx"
        
const Users = () => {
    const [paginationParams, setPaginationParams] = useState<UserQueryParams>({
        keyword: '',
        page: 1,
        limit: 2
    });
    const [searchTerm, setSearchTerm] = useState('');
    const debounceTimeoutRef = useRef(0);
    
    const { getUser, removeUser } = useUser(paginationParams)
    const { data: users, isLoading, isError, error, refetch } = getUser
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
    <div className="container mt-5 mb-5">
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
                                    <button className="btn btn-success btn-sm rounded-pill" onClick={() => openModal(null)}>Add User</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            {isLoading && <p>Loading...</p>}
                            {isError && <p>Error loading users</p>}
                            {users?.data && <table className="table table-hover table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Full Name</th>
                                        <th>Email</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {users?.data.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td className="d-flex gap-1 justify-content-center align-items-center">
                                            <button className="btn btn-primary btn-sm rounded-pill" onClick={() => {
                                                openModal(user)
                                            }}>Edit</button>
                                            <button className="btn btn-danger btn-sm rounded-pill" onClick={() => {confirmDeleteModal(user)}}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>}
                            {users?.pagination && (
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <div className="text-muted">
                                        Showing {((paginationParams.page - 1) * paginationParams.limit) + 1} to {Math.min(paginationParams.page * paginationParams.limit, users.pagination.total)} of {users.pagination.total} entries
                                    </div>
                                    <div className="d-flex gap-1">
                                        <button 
                                            className="btn btn-sm btn-outline-primary" 
                                            onClick={() => {
                                                setPaginationParams(prev => ({ ...prev, page: prev.page - 1 }));
                                            }}
                                            disabled={paginationParams.page <= 1}
                                        >
                                            Previous
                                        </button>
                                        <span className="btn btn-sm btn-outline-secondary disabled">
                                            Page {paginationParams.page} of {users.pagination.total_page}
                                        </span>
                                        <button 
                                            className="btn btn-sm btn-outline-primary" 
                                            onClick={() => {
                                                setPaginationParams(prev => ({ ...prev, page: prev.page + 1 }));
                                            }}
                                            disabled={paginationParams.page >= users.pagination.total_page}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Users