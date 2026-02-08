import { useEffect, useRef } from "react";
import "./Accordion.css";

export default function Accordion({ title, isOpen, onToggle, status = "invalid", children }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isOpen) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isOpen]);

  return (
    <section ref={ref} className="acc">
      <button
        type="button"
        className="acc-header"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className={`acc-dot ${status}`}></span>
        <span className="acc-title">{title}</span>
        <span className={`acc-arrow ${isOpen ? "open" : ""}`}>⌄</span>
      </button>

      <div className={`acc-body ${isOpen ? "open" : ""}`}>
        <div className="acc-inner">{children}</div>
      </div>
    </section>
  );
}

