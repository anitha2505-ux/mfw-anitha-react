import React, { useEffect } from "react";

export default function FlashMessage({ flash, onClose, timeout = 2500 }) {
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(onClose, timeout);
    return () => clearTimeout(t);
  }, [flash, onClose, timeout]);

  if (!flash) return null;

  return (
    <div className="flash-wrap" aria-live="polite" aria-atomic="true">
      <div
        className={`alert alert-${flash.type} alert-dismissible fade show flash-animate flash-strong`}
        role="alert"
      >
        <div className="fw-semibold">{flash.title}</div>
        <div>{flash.message}</div>

        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        />
      </div>
    </div>
  );
}
