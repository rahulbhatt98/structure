import { useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import Webcam from 'react-webcam';
import Spinner from '../common/Spinner';

const WebcamModal = ({ isOpen, onClose, onCapture, selfieLoading }) => {
    const webcamRef = useRef(null);
    const toastId = useRef(null);
    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) {
            if (!toast.isActive(toastId.current)) {
                toastId.current = toast.error("Please click valid image")
            }
            return
        }
        console.log(imageSrc, "imageseeeeeeeeeeeeeee");
        onCapture(imageSrc);  // Pass imageSrc to the parent component
        onClose();  // Close the modal
    }, [webcamRef, onCapture, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white relative p-8 rounded-xl shadow-lg max-w-lg w-full">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    &#x2715;
                </button>
                <Webcam
                    audio={false}
                    height={720}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={1280}
                />
                <div className="flex justify-center">
                    <button
                        onClick={capture}
                        className="font-bold mainblue text-white py-4 px-12 mt-4 blueshadow shadow-lg shadow-[#1B75BC] rounded-xl"
                    >
                        {selfieLoading ? <Spinner /> : "Capture photo"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WebcamModal;
