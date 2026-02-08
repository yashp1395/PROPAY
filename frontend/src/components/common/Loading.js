import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loading = ({ size = 'lg', text = 'Loading...' }) => {
  return (
    <div className="loading-spinner">
      <div className="text-center">
        <Spinner animation="border" variant="primary" size={size} />
        <div className="mt-2">
          <small className="text-muted">{text}</small>
        </div>
      </div>
    </div>
  );
};

export default Loading;