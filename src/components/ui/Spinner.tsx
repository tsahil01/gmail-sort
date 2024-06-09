import React from 'react';

export const Spinner = () => (
  <div className="flex items-center justify-center">
    <div className="loader"></div>
    <style jsx>{`
      .loader {
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-left-color: #000;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </div>
);
