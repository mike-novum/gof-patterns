# Паттерны проектирования — GoF

> Интерактивная презентация 23 классических паттернов проектирования из книги «Банды четырёх» (Gang of Four). Адаптивная глубина разбора, тёмная и светлая темы, понятные слайды для начинающих.

[![Live](https://img.shields.io/badge/Live-GitHub%20Pages-orange)](https://mike-novum.github.io/gof-patterns/)
[![Astro](https://img.shields.io/badge/Astro-5.3-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

---

## ✨ Возможности

- **23 паттерна** — полная коллекция GoF: 5 порождающих, 7 структурных, 11 поведенческих
- **Адаптивная глубина** — базовые 4 слайда (аналогия → проблема → решение → код) + раздел «Глубже» (плюсы/минусы, применение)
- **Тёмная и светлая темы** — переключение с сохранением в `localStorage`, тёмная по умолчанию
- **Адаптивный интерфейс** — от 320px mobile до 4K desktop
- **Клавиатурная навигация** — `←` / `→` / `Space` / `Home` / `End` для переключения слайдов
- **Рабочие примеры на TypeScript** — для каждого паттерна
- **Связи между паттернами** — блок «Связанные» на странице паттерна

---

## 📚 Что внутри

| Категория | Кол-во | Паттерны |
|---|---|---|
| **Порождающие** | 5 | Singleton, Factory Method, Abstract Factory, Builder, Prototype |
| **Структурные** | 7 | Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy |
| **Поведенческие** | 11 | Chain of Responsibility, Command, Interpreter, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor |

Каждый паттерн раскрывается через 6 слайдов:

1. **Аналогия** — метафора из жизни для интуитивного понимания
2. **Проблема** — что не так с наивным кодом
3. **Решение** — как паттерн это исправляет
4. **Реализация** — рабочий код на TypeScript
5. **Плюсы и минусы** — когда использовать, когда нет
6. **Применение** — реальные примеры из практики

---

## 🛠 Технологии

| Слой | Инструмент |
|---|---|
| Сборка | Astro 5.3 (статическая генерация) |
| Интерактив | React 19 (острова) |
| Типизация | TypeScript strict |
| Стили | Tailwind CSS 3.4 + кастомные CSS-переменные |
| Display шрифт | [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) |
| Body шрифт | [Geist](https://vercel.com/font) |
| Mono шрифт | [JetBrains Mono](https://www.jetbrains.com/lp/mono/) |

---

## 🚀 Запуск локально

```bash
# 1. Установить зависимости
npm install

# 2. Запустить dev-сервер
npm run dev
# → http://localhost:4321/gof-patterns/

# 3. Сборка для продакшена
npm run build
# → dist/

# 4. Превью продакшен-сборки
npm run preview
```

Требования: **Node.js 20+**.

---

## 📁 Структура проекта

```
.
├── src/
│   ├── data/
│   │   └── patterns.ts          # 23 паттерна с полным контентом слайдов
│   ├── types/
│   │   └── pattern.ts           # типы Pattern, SlideSection, Category
│   ├── lib/
│   │   └── paths.ts             # url() — учёт base path для GitHub Pages
│   ├── components/
│   │   ├── ThemeToggle.tsx      # переключатель темы (persist в localStorage)
│   │   ├── PatternCard.tsx      # карточка паттерна на главной
│   │   ├── CategorySection.tsx  # секция категории (Creational / Structural / Behavioral)
│   │   ├── PatternSlides.tsx    # state-контейнер слайдов
│   │   ├── SlideRenderer.tsx    # рендер слайда по kind (analogy/problem/solution/...)
│   │   ├── SlideNav.tsx         # prev/next + клавиатура + прогресс
│   │   └── CodeBlock.tsx        # блок кода
│   ├── layouts/
│   │   └── BaseLayout.astro     # базовый layout, тема-скрипт до рендера
│   ├── pages/
│   │   ├── index.astro          # главная (hero + 3 секции карточек)
│   │   └── patterns/
│   │       └── [slug].astro     # страница паттерна (getStaticPaths)
│   └── styles/
│       └── global.css           # CSS-переменные тем, типографика, анимации
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions → GitHub Pages
├── astro.config.mjs             # base: '/gof-patterns' для project site
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## 🎨 Дизайн-решения

- **Technical Editorial стиль** — крупная выразительная типографика (Bricolage Grotesque) как у Spec, blueprint-сетка на фоне hero, нумерация паттернов 01/23 для ориентации
- **Оранжевая палитра** — `#f97316` как точка напряжения на тёмном фоне; меняет оттенок между темами (`#ea580c` для светлой)
- **Stagger-анимации** — карточки появляются последовательно через `animation-delay`
- **Hover-микро-интеракции** — карточки приподнимаются с оранжевым свечением; prev/next смещают стрелки
- **Без JS на главной** — Astro генерирует чистую статику, JS нужен только для переключения темы и навигации по слайдам

---

## 🚢 Деплой

Проект автоматически деплоится на **GitHub Pages** при каждом пуше в `main`.

Workflow находится в [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

### Первый деплой — настройка

После пуша в репозиторий:

1. Откройте **Settings → Pages**
2. В разделе **Source** выберите **GitHub Actions**
3. Дождитесь окончания первого workflow run (вкладка **Actions**)
4. Сайт будет доступен по адресу:

   ```
   https://<ваш-username>.github.io/gof-patterns/
   ```

### Последующие изменения

Любой `push` в `main` запускает workflow:
1. `npm ci` — установка зависимостей
2. `npm run build` — сборка Astro в `dist/`
3. Deploy Pages artifact

---

## ➕ Добавление нового паттерна

1. Откройте [`src/data/patterns.ts`](src/data/patterns.ts)
2. Добавьте новый объект в массив `PATTERNS`:

```typescript
{
  slug: 'mvp',
  name: 'MVP',
  category: 'creational', // 'creational' | 'structural' | 'behavioral'
  intent: 'Краткое описание назначения паттерна',
  related: ['observer', 'mediator'],
  slides: [
    { kind: 'analogy', title: 'Аналогия', analogy: '...' },
    { kind: 'problem', title: 'Проблема', body: '...', points: [...] },
    { kind: 'solution', title: 'Решение', body: '...', points: [...] },
    { kind: 'code', title: 'Реализация', code: { lang: 'ts', source: '...' } },
    { kind: 'proscons', title: 'Плюсы и минусы', pros: [...], cons: [...] },
    { kind: 'usage', title: 'Когда использовать', body: '...', points: [...] },
  ],
}
```

3. Пересоберите: `npm run build`
4. Закоммитьте и запушьте — новый паттерн автоматически появится на сайте.

---

## 📜 Лицензия

MIT © 2026 — используйте, форкайте, учитесь.

---

## 🙏 Источники

- [Design Patterns: Elements of Reusable Object-Oriented Software](https://en.wikipedia.org/wiki/Design_Patterns) — книга «Банды четырёх» (Gang of Four)
- [Refactoring Guru — Design Patterns](https://refactoring.guru/design-patterns) — отличные визуализации и примеры


## Инструменты

Данный проект собран полностью с помощью следующих инстурментов:

- Claude Code CLI
- MiniMax-M3
- Cursor