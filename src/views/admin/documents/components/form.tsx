import { useState, type FC } from "react";
import { useDocumentForm } from "../../../../hooks/document/useForm";
import type { FormData } from "../../../../hooks/document/useFormValidator";
import { uploadFileInChunks } from "../../../../utils/chunkFileHandler";

const DocumentForm: FC = () => {

    const {register, handleSubmit, errors} = useDocumentForm()
    const [progressLoading, setProgressLoading] = useState<number>(0)

    const onSubmit = (formData: FormData) => {
       uploadFileInChunks(formData.file[0], formData.name, (progress) => {
        console.log('Progress', progress)
        setProgressLoading(progress)
       })
    }

    return (
        <div>
            <form className="row" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2">
                    <label htmlFor="name" className="form-label fw-bold d-flex justify-content-start">File Name</label>
                    <input type="text" className="form-control" id="name" placeholder="Doc. SOP" {...register('name')} />
                    {errors.name && typeof errors.name.message === 'string' && <p className="text-danger d-flex justify-content-start">{errors.name.message}</p>}
                </div>
                <div className="mb-2">
                    <label htmlFor="file" className="form-label fw-bold d-flex justify-content-start">File</label>
                    <input type="file" className="form-control" id="file" {...register('file')} />
                    {errors.file && typeof errors.file.message === 'string' && <p className="text-danger d-flex justify-content-start">{errors.file.message}</p>}
                </div>
                <div className="mb-3 w-100 d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                        Simpan {progressLoading > 0 ? `${progressLoading} %` : ''}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DocumentForm;