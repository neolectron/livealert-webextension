import video from '../../assets/flowers.webm';

const VideoOver = () => (
  <div className="absolute z-10 pointer-events-none">
    <video autoPlay muted loop src={video}></video>
  </div>
);

export default VideoOver;
