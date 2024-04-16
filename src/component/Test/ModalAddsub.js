const ModalAddsub = () => {
    return (
        <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">เพิ่มสถานีไฟฟ้า</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label for="recipient-name" className="col-form-label">ชื่อภาษาไทย</label>
                                <input type="input" className="form-control" id="recipient-name" />
                            </div>
                            <div className="mb-3">
                                <label for="recipient-name" className="col-form-label">ชื่อย่อภาษาไทย:</label>
                                <input type="input" className="form-control" id="recipient-name" />
                            </div>
                            <div className="mb-3">
                                <label for="recipient-name" className="col-form-label">ชื่อภาษาอังกฤษ:</label>
                                <input type="input" className="form-control" id="recipient-name" />
                            </div>
                            <div className="mb-3">
                                <label for="recipient-name" className="col-form-label">ชื่อย่อภาษาอังกฤษ:</label>
                                <input type="input" className="form-control" id="recipient-name" />
                            </div>
                            <div className="mb-3">
                                <label for="recipient-name" className="col-form-label">หน่วยการไฟฟ้ารับผิดชอบ:</label>
                                <input type="input" className="form-control" id="recipient-name" />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">ปิด</button>
                        <button type="button" className="btn btn-success">เพิ่ม</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalAddsub;

