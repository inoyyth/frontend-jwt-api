import type { FC } from "react";
import type { User } from "../../../../hooks/user/useUser";

type Props = {
    users: User[],
    openModal: (user: User) => void,
    confirmDeleteModal: (user: User) => void
}

const TableUser: FC<Props> = ({users, openModal, confirmDeleteModal}) => {
    
    return (
        <table className="table table-hover table-striped table-bordered">
            <thead>
                <tr>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            {users.map((user) => (
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
        </table>
    )
}

export default TableUser