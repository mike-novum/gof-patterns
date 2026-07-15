# Design: Site-presentation about GoF Design Patterns

**Date:** 2026-07-15
**Stack:** Astro 5.3 + React 19 + TypeScript + Tailwind 3

## Goal

Презентационный сайт с 23 паттернами GoF. Тёмная тема по умолчанию, оранжевая палитра, адаптивный интерфейс, понятные слайды для начинающих.

## Decisions

- **Объём:** все 23 паттерна GoF (5 creational + 7 structural + 11 behavioral)
- **Язык UI:** русский, идентификаторы/комментарии в коде — английские
- **Структура слайдов:** адаптивная глубина — 4 базовых + секция «Глубже»
- **Навигация:** главная — сетка карточек; страница паттерна — слайды с prev/next
- **Контент:** типизированный массив в `src/data/patterns.ts` (типобезопасность, единообразие)
- **Код в примерах:** TypeScript
- **Рендер:** Astro страницы статические, интерактив — React-острова
- **Тема:** `data-theme` атрибут + Tailwind dark: + скрипт до рендера (без мигания)
- **Подсветка кода:** встроенный в Astro Shiki (нулевой JS на клиенте)

## Architecture

```
src/
├── data/patterns.ts          # 23 паттерна, типизированный массив
├── types/pattern.ts          # Pattern, SlideSection, Category
├── components/
│   ├── ThemeToggle.tsx       # переключатель темы, persist localStorage
│   ├── PatternCard.tsx       # карточка на главной
│   ├── CategorySection.tsx   # секция категории
│   ├── SlideRenderer.tsx     # рендер слайда по kind
│   ├── SlideNav.tsx          # prev/next + клавиатура + прогресс
│   ├── Diagram.tsx           # inline SVG-схемы классов
│   └── KeyboardHints.tsx     # подсказки горячих клавиш
├── layouts/BaseLayout.astro  # html, theme script, fonts, meta
├── pages/
│   ├── index.astro           # главная
│   └── patterns/[slug].astro # страница паттерна (getStaticPaths)
└── styles/global.css         # tailwind + утилиты
```

## Data Model

```ts
type Category = 'creational' | 'structural' | 'behavioral';
type SlideKind = 'analogy' | 'problem' | 'solution' | 'code' | 'proscons' | 'usage' | 'diagram';

interface SlideSection {
  kind: SlideKind;
  title: string;
  body?: string;
  analogy?: string;
  points?: string[];
  code?: { lang: 'ts' | 'js'; source: string };
  diagramKind?: 'class';
}

interface Pattern {
  slug: string;
  name: string;
  category: Category;
  intent: string;
  icon: string;
  slides: SlideSection[];
  related?: string[];
}
```

## Pages

- `/` — Hero + три секции карточек (по категории) + footer
- `/patterns/[slug]` — шапка с категорией + один слайд + nav + related

## Responsive

- `< 640px`: 1 колонка, drawer nav, крупные кнопки
- `640–1024px`: 2 колонки карточек
- `> 1024px`: 3 колонки, sticky header

## Themes

- `data-theme="dark"` по умолчанию
- localStorage persist
- Toggle в header
- Плавный transition при смене

## Patterns List

**Creational (5):** Singleton, Factory Method, Abstract Factory, Builder, Prototype
**Structural (7):** Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy
**Behavioral (11):** Chain of Responsibility, Command, Interpreter, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor

## Out of Scope

- Авторизация, бэкенд, аналитика
- i18n (только русский)
- Поиск/фильтры (23 элемента — manageable)
- Тесты (презентационный сайт, не продакшн-приложение)