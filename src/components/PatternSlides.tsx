import { useState } from 'react';
import type { Pattern } from '../types/pattern';
import { SlideRenderer } from './SlideRenderer';
import { SlideNav } from './SlideNav';

interface Props {
  pattern: Pattern;
}

export function PatternSlides({ pattern }: Props) {
  const [index, setIndex] = useState(0);
  const slide = pattern.slides[index];

  return (
    <>
      <style>{`
        .slide-enter {
          animation: slideEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideEnter {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div key={index}>
        <SlideRenderer slide={slide} />
      </div>
      <SlideNav total={pattern.slides.length} current={index} onChange={setIndex} />
    </>
  );
}