export type Category = 'creational' | 'structural' | 'behavioral';

export type SlideKind =
  | 'analogy'
  | 'problem'
  | 'solution'
  | 'code'
  | 'diagram'
  | 'proscons'
  | 'usage';

export interface CodeBlock {
  lang: 'ts' | 'js' | 'tsx';
  source: string;
}

export interface SlideSection {
  kind: SlideKind;
  title: string;
  body?: string;
  analogy?: string;
  points?: string[];
  code?: CodeBlock;
  pros?: string[];
  cons?: string[];
  diagram?: 'factory' | 'observer' | 'state' | 'strategy' | 'decorator' | 'adapter';
}

export interface Pattern {
  slug: string;
  name: string;
  category: Category;
  intent: string;
  slides: SlideSection[];
  related?: string[];
}

export const CATEGORY_META: Record<Category, { title: string; subtitle: string; index: string }> = {
  creational: {
    title: 'Порождающие',
    subtitle: 'Механизмы создания объектов',
    index: '01',
  },
  structural: {
    title: 'Структурные',
    subtitle: 'Композиция классов и объектов',
    index: '02',
  },
  behavioral: {
    title: 'Поведенческие',
    subtitle: 'Коммуникация между объектами',
    index: '03',
  },
};

export const CATEGORY_ORDER: Category[] = ['creational', 'structural', 'behavioral'];