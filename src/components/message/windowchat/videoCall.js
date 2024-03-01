import { useEffect, useRef } from "react";

export default function VideoCall(props) {
    const videoRef = useRef(null);

    const getVideo = () => {
        navigator.mediaDevices
            .getUserMedia({
                video: { width: 1920, height: 1080 },
            })
            .then((stream) => {
                if (videoRef.current) {
                    let video = videoRef.current;
                    video.srcObject = stream;

                    // Chờ sự kiện "loadedmetadata" trước khi gọi play()
                    video.addEventListener("loadedmetadata", () => {
                        video.play();
                    });
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        getVideo();
    }, [props]);

    return (
        <div className="video_call">
            <video ref={videoRef}></video>
        </div>
    );
}
