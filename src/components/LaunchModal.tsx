
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Launch } from '../types/launch';

interface LaunchModalProps {
  launch: Launch;
  onClose: () => void;
}

export default function LaunchModal({
  launch,
  onClose,
}: LaunchModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="modal-window"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title">
            {launch.mission_name}
          </h2>

          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <div className="modal-content">
          {launch.links?.mission_patch ? (
            <img
              className="modal-image"
              src={launch.links.mission_patch}
              alt={`${launch.mission_name} mission patch`}
            />
          ) : (
            <div className="image-placeholder">
              No image
            </div>
          )}

          <div className="modal-info">
            <p className="modal-label">Mission name:</p>
            <p>{launch.mission_name}</p>

            <p className="modal-label">Rocket name:</p>
            <p>
              {launch.rocket?.rocket_name || 'Unknown rocket'}
            </p>

            <p className="modal-label">Details:</p>
            <p>
              {launch.details || 'No details available'}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
