import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ShadowPortalProps {
  children: React.ReactNode;
  styles?: string;
  className?: string;
  mode?: "open" | "closed";
}

const ShadowPortal = React.forwardRef<HTMLDivElement, ShadowPortalProps>(
  ({ children, styles, className, mode = "open" }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const shadowRef = useRef<ShadowRoot | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      if (!containerRef.current) return;

      // Создаём Shadow DOM
      if (!shadowRef.current) {
        shadowRef.current = containerRef.current.attachShadow({ mode });

        // Добавляем стили
        const styleElement = document.createElement("style");
        const defaultStyles = `
          :host {
            all: initial;
            display: block;
          }
          :host * {
            box-sizing: border-box;
          }
        `;
        styleElement.textContent = `${defaultStyles}${styles || ""}`;
        shadowRef.current.appendChild(styleElement);

        // Создаём контейнер для контента
        contentRef.current = document.createElement("div");
        shadowRef.current.appendChild(contentRef.current);

        setMounted(true);
      } else if (styles) {
        // Обновляем стили если они изменились
        const styleElement = shadowRef.current.querySelector("style");
        if (styleElement) {
          const defaultStyles = `
            :host {
              all: initial;
              display: block;
            }
            :host * {
              box-sizing: border-box;
            }
          `;
          styleElement.textContent = `${defaultStyles}${styles}`;
        }
      }
    }, [styles, mode]);

    return (
      <>
        <div
          ref={containerRef}
          className={className}
          style={{ all: "initial" } as React.CSSProperties}
        />
        {mounted &&
          contentRef.current &&
          createPortal(children, contentRef.current)}
      </>
    );
  },
);

ShadowPortal.displayName = "ShadowPortal";

export default ShadowPortal;
