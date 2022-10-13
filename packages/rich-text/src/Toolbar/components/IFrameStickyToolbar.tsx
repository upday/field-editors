import React, { ReactNode, useEffect, useRef } from 'react';

import { css } from 'emotion';

const styles = {
  wrapper: css`
    position: sticky;
    z-index: 2;
    left: 0;
    top: 0;
    right: 0;
  `,
  elementContainer: css`
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    pointerevents: none;
    overflow: hidden;
  `,
};

const CONTAINER_HEIGHT = 100;
const threshold = [...new Array(CONTAINER_HEIGHT + 1).fill(0)].map((_, i) => i / CONTAINER_HEIGHT);

function registerScrollPositionHandler(handler: (top: number) => void): () => void {
  const elementContainer = document.createElement('div');
  elementContainer.className = styles.elementContainer;
  document.body.appendChild(elementContainer);

  const elements: HTMLDivElement[] = [];
  let intersectionObserver: IntersectionObserver | undefined;
  const resizeObserver = new ResizeObserver(() => {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isTopEntry = entry.target === elements[0];
          const isIntersecting = entry.intersectionRatio > 0;
          if (
            isIntersecting &&
            (entry.intersectionRect.top > entry.boundingClientRect.top || isTopEntry)
          ) {
            handler(entry.intersectionRect.top);
          }
        });
      },
      { threshold }
    );

    const count = Math.ceil(document.documentElement.offsetHeight / CONTAINER_HEIGHT);
    for (let i = 0; i < count; i++) {
      if (!elements[i]) {
        elements[i] = document.createElement('div');
        Object.assign(elements[i].style, {
          position: 'absolute',
          top: `${i * CONTAINER_HEIGHT}px`,
          height: `${CONTAINER_HEIGHT}px`,
          width: '100%',
        });
        elementContainer.appendChild(elements[i]);
        intersectionObserver.observe(elements[i]);
      }
    }
  });
  resizeObserver.observe(document.documentElement);

  return () => {
    resizeObserver.disconnect();
    intersectionObserver?.disconnect();
    elementContainer.remove();
  };
}

function useStickyElement() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return registerScrollPositionHandler((scrollPosition) => {
      const heightWithOffset =
        document.documentElement.offsetHeight - (ref.current?.getBoundingClientRect().height || 0);

      const isAtStartingPosition = scrollPosition < 0;
      const isAtEndPosition = scrollPosition >= heightWithOffset;

      const offset = isAtStartingPosition ? 0 : isAtEndPosition ? heightWithOffset : scrollPosition;

      window.requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.transform = `translateY(${offset}px)`;
        }
      });
    });
  }, [ref]);

  return ref;
}

export interface Props {
  children: ReactNode;
}

export function IFrameStickyToolbar({ children }: Props) {
  const ref = useStickyElement();

  return (
    <div ref={ref} className={styles.wrapper}>
      {children}
    </div>
  );
}
