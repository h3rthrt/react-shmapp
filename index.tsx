import React, { useEffect, useRef } from 'react';

interface ShadowDOMWrapperProps {
  children: React.ReactNode;
  styles?: string;
  mode?: 'open' | 'closed';
}

const ShadowDOMWrapper = React.forwardRef<HTMLDivElement, ShadowDOMWrapperProps>(
  ({ children, styles = '', mode = 'open' }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const shadowRootRef = useRef<ShadowRoot | null>(null);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      // Attach Shadow DOM
      const shadowRoot = container.attachShadow({ mode });
      shadowRootRef.current = shadowRoot;

      // Add styles to Shadow DOM
      if (styles) {
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        shadowRoot.appendChild(styleElement);
      }

      // Add default styles to isolate content
      const defaultStyles = document.createElement('style');
      defaultStyles.textContent = `
        :host {
          all: initial;
          display: block;
        }
        * {
          box-sizing: border-box;
        }
      `;
      shadowRoot.appendChild(defaultStyles);

      // Create a slot for children
      const slot = document.createElement('slot');
      shadowRoot.appendChild(slot);

      return () => {
        // Cleanup if needed
      };
    }, [styles]);

    return (
      <div ref={containerRef || ref}>
        {children}
      </div>
    );
  }
);

ShadowDOMWrapper.displayName = 'ShadowDOMWrapper';

export default ShadowDOMWrapper;