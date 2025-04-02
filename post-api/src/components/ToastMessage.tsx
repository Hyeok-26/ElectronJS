import { Toast, ToastContainer } from "react-bootstrap";


function ToastMessage({show, info, onClose}) {
    return (
        <ToastContainer position="top-end" className="p-3">
            <Toast bg={info.color} autohide show={show} onClose={onClose} delay={2000}>
                <Toast.Body className="text-white">{info.message}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

export default ToastMessage;