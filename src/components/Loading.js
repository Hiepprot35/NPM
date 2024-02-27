import { Player, Controls } from '@lottiefiles/react-lottie-player';
import { useEffect, useState } from 'react';

const IsLoading = () => {
  const [internetError, setInternetError] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setInternetError(true);
    }, 10000);
  }, []);

  return (
    <>
      {internetError ? (
        <p>Lỗi kết nối từ Server</p>
      ) : (
        <div className="Loading_container">
          <div className="">
            <Player
              autoplay
              speed={1}
              loop
              src="https://lottie.host/c775397d-d0b4-434c-b084-489acbe2d17b/CpkFsQb8HX.json"
              style={{ height: '300px', width: '300px' }}
            >
              <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />
            </Player>
          </div>
        </div>
      )}
    </>
  );
};

export default IsLoading;
