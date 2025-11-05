import './Loader.scss';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  message?: string;
}

export function Loader({ size = 'medium', fullScreen = false, message }: LoaderProps) {
  const content = (
    <div className={`loader-wrapper ${fullScreen ? 'loader-fullscreen' : ''}`}>
      <div className={`loader loader-${size}`}>
        <div className="loader-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-pulse"></div>
        </div>
      </div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  );

  return content;
}
