import type { FC } from "react";
import { useState, useCallback } from "react";
import SidebarMenu from "../../../components/SidebarMenu";
import { useModal } from "../../../hooks/modal/useModal";
import DocumentForm from "./components/form";

const Documents: FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { showModal } = useModal();

    const openModal = useCallback(() => {
        showModal('document-form-modal', 
            <DocumentForm />,
            { title: 'Add Document', size: 'lg', closeOnOverlayClick: false }
        );
    }, [showModal]);

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
                                <div className="fw-bold">Documents</div>
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
                                    <button className="btn btn-primary btn-sm rounded-pill" onClick={() => openModal()}>Add Document</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            Data Table
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Documents;