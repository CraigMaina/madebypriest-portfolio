import { useRef, useEffect, useState, useMemo, useId } from 'react';

// One curved marquee row. Auto-scrolls at `speed`, is draggable, and reacts to
// page scroll velocity (scrollSign lets stacked rows react in opposite ways).
const MarqueeRow = ({
  text: rawText,
  speed = 3,
  curveAmount = 16,
  direction = 'left',
  scrollSign = 1,
  interactive = true,
  className,
}) => {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(rawText);
    return (hasTrailing ? rawText.replace(/\s+$/, '') : rawText) + '\u00A0';
  }, [rawText]);

  const measureRef = useRef(null);
  const textPathRef = useRef(null);
  const pathRef = useRef(null);
  const containerRef = useRef(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);
  const uid = useId();
  const pathId = `curve-${uid}`;
  // Baseline centered in a short viewBox; a gentle quadratic gives the arc
  // without clipping the glyphs (svg is overflow-visible).
  const pathD = `M-100,56 Q720,${56 + curveAmount} 1540,56`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef(direction);
  const velRef = useRef(0);
  const scrollVelRef = useRef(0);
  const lastScrollRef = useRef(0);

  const textLength = spacing;
  const totalText = textLength
    ? Array(Math.ceil(1800 / textLength) + 2)
        .fill(text)
        .join('')
    : text;
  const ready = spacing > 0;

  useEffect(() => {
    if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());
  }, [text, className]);

  useEffect(() => {
    if (!spacing) return;
    if (textPathRef.current) {
      const initial = -spacing;
      textPathRef.current.setAttribute('startOffset', initial + 'px');
      setOffset(initial);
    }
  }, [spacing]);

  useEffect(() => {
    if (!spacing || !ready) return;
    // Respect prefers-reduced-motion: hold static (dragging still works).
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let running = false;
    const step = () => {
      // Scroll-velocity influence, smoothed and clamped so fast flings stay tasteful.
      const y = window.scrollY || 0;
      const dv = y - lastScrollRef.current;
      lastScrollRef.current = y;
      scrollVelRef.current = scrollVelRef.current * 0.85 + dv * scrollSign * 0.5;

      if (!dragRef.current && textPathRef.current) {
        const base = dirRef.current === 'right' ? speed : -speed;
        let delta = base + scrollVelRef.current;
        delta = Math.max(-40, Math.min(40, delta));
        const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
        let newOffset = currentOffset + delta;
        const wrapPoint = spacing;
        if (newOffset <= -wrapPoint) newOffset += wrapPoint;
        if (newOffset > 0) newOffset -= wrapPoint;
        textPathRef.current.setAttribute('startOffset', newOffset + 'px');
        setOffset(newOffset);
      }
      frame = requestAnimationFrame(step);
    };
    const start = () => {
      if (running) return;
      running = true;
      lastScrollRef.current = window.scrollY || 0;
      frame = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    // Only tick while the band is on screen — no wasted rAF/battery offscreen.
    const el = containerRef.current;
    let observer;
    if (el && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
      observer.observe(el);
    } else {
      start();
    }
    return () => {
      stop();
      observer?.disconnect();
    };
  }, [spacing, speed, ready, scrollSign]);

  const onPointerDown = (e) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    e.target.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;
    const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
    let newOffset = currentOffset + dx;
    const wrapPoint = spacing;
    if (newOffset <= -wrapPoint) newOffset += wrapPoint;
    if (newOffset > 0) newOffset -= wrapPoint;
    textPathRef.current.setAttribute('startOffset', newOffset + 'px');
    setOffset(newOffset);
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? 'right' : 'left';
  };

  const cursorStyle = interactive ? (dragRef.current ? 'grabbing' : 'grab') : 'auto';

  return (
    <div
      ref={containerRef}
      className="w-full flex items-center justify-center overflow-hidden"
      style={{ visibility: ready ? 'visible' : 'hidden', cursor: cursorStyle }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg
        className="select-none w-full overflow-visible block aspect-[1440/84] text-[2.25rem] md:text-[2.75rem] font-bold uppercase leading-none font-heading"
        viewBox="0 0 1440 84"
      >
        <text ref={measureRef} xmlSpace="preserve" style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>
          {text}
        </text>
        <defs>
          <path ref={pathRef} id={pathId} d={pathD} fill="none" stroke="transparent" />
        </defs>
        {ready && (
          <text xmlSpace="preserve" className={`fill-fog-100 ${className ?? ''}`}>
            <textPath ref={textPathRef} href={`#${pathId}`} startOffset={offset + 'px'} xmlSpace="preserve">
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
};

// Dual-row curved marquee. The rows travel in opposite directions and lean into
// page scroll from opposite sides, so scrolling visibly perturbs the band.
const CurvedLoop = ({
  marqueeText = '',
  secondaryText,
  speed = 3,
  curveAmount = 16,
  direction = 'left',
  interactive = true,
}) => {
  const opposite = direction === 'left' ? 'right' : 'left';
  return (
    <div className="w-full bg-ink-900 relative z-10 py-3 md:py-4">
      <MarqueeRow
        text={marqueeText}
        speed={speed}
        curveAmount={curveAmount}
        direction={direction}
        scrollSign={1}
        interactive={interactive}
        className="fill-fog-100"
      />
      <MarqueeRow
        text={secondaryText || marqueeText}
        speed={speed * 0.85}
        curveAmount={curveAmount}
        direction={opposite}
        scrollSign={-1}
        interactive={interactive}
        className="fill-transparent [-webkit-text-stroke:1px_theme(colors.fog.500)]"
      />
    </div>
  );
};

export default CurvedLoop;
