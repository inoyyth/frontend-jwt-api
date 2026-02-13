import { useEffect, useState, type FC } from "react";
import { useDocumentForm } from "../../../../hooks/document/useForm";
import type { FormData } from "../../../../hooks/document/useFormValidator";
import { uploadFileInChunks } from "../../../../utils/chunkFileHandler";
import { useModal } from "../../../../hooks/modal/useModal";

const DocumentForm: FC = () => {

    const { hideModal } = useModal();
    
    const {register, handleSubmit, errors} = useDocumentForm()
    const [progressLoading, setProgressLoading] = useState<number>(0)

    const onSubmit = (formData: FormData) => {
       uploadFileInChunks(formData.file[0], formData.name, (progress) => {
        setProgressLoading(Number(progress.toFixed(1)))
       })
    }

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        if (progressLoading >=100) {
            timeoutId = setTimeout(() => {
                hideModal('document-form-modal')
            }, 1000)
        }
        return () => {
            if (timeoutId) clearTimeout(timeoutId)
        }
    }, [progressLoading])

    return (
        <div>
            <form className="row" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2">
                    <label htmlFor="name" className="form-label fw-bold d-flex justify-content-start">File Name</label>
                    <input type="text" className="form-control" id="name" placeholder="Doc. SOP" {...register('name')} />
                    {errors.name && typeof errors.name.message === 'string' && <p className="text-danger d-flex justify-content-start">{errors.name.message}</p>}
                </div>
                <div className="mb-2">
                    <label htmlFor="file" className="form-label fw-bold d-flex justify-content-start">File (Max: 10MB)</label>
                    <input type="file" className="form-control" id="file" {...register('file')} accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp" />
                    {errors.file && typeof errors.file.message === 'string' && <p className="text-danger d-flex justify-content-start">{errors.file.message}</p>}
                </div>
                <div className="mb-3 w-100 d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary" disabled={progressLoading > 0}>
                       {progressLoading > 0 ? `${progressLoading} %` : 'Simpan'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DocumentForm;