import type { Pattern } from '../types/pattern';

export const PATTERNS: Pattern[] = [
  // ========== CREATIONAL ==========
  {
    slug: 'singleton',
    name: 'Singleton',
    category: 'creational',
    intent: 'Гарантирует, что у класса есть только один экземпляр, и предоставляет глобальную точку доступа к нему.',
    related: ['factory-method', 'abstract-factory'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Президент страны. В любой момент времени существует ровно один действующий президент. Когда вы хотите узнать, кто сейчас президент — вы обращаетесь к одному и тому же источнику правды, а не создаёте нового «президента» каждый раз.',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Некоторые классы должны иметь строго один экземпляр: пул соединений, драйвер БД, кеш приложения, логгер, конфигурация среды. Создание нового экземпляра каждый раз тратит ресурсы или нарушает логику (например, два логгера пишут в разные файлы — хаос).',
        points: [
          'Глобальная переменная — нарушает инкапсуляцию и усложняет тесты',
          'Простое «не создавать второй раз» — нет защиты от случайного `new`',
          'Нужна единая точка доступа с гарантией единственности',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'Сделать конструктор приватным. Класс сам управляет своим единственным экземпляром и предоставляет статический метод доступа. Потокобезопасность — через ленивую инициализацию или статический инициализатор.',
        points: [
          'Приватный конструктор — никто не вызовет `new` снаружи',
          'Статическое поле хранит единственный экземпляр',
          'Статический метод `getInstance()` возвращает его',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `class Logger {
  private static instance: Logger;
  private logFile = 'app.log';

  // Приватный конструктор — нельзя создать через new
  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(message: string) {
    console.log(\`[\${new Date().toISOString()}] \${message}\`);
    // запись в файл...
  }
}

// Использование
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();
console.log(logger1 === logger2); // true`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Гарантия единственного экземпляра',
          'Глобальная точка доступа',
          'Ленивая инициализация (объект создаётся при первом обращении)',
        ],
        cons: [
          'Нарушает Single Responsibility Principle (класс сам управляет своей жизнью)',
          'Усложняет unit-тестирование (глобальное состояние)',
          'В многопоточной среде нужна синхронизация',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        body: 'Singleton — спорный паттерн. Современная альтернатива: dependency injection.',
        points: [
          'Конфигурация приложения (один источник настроек)',
          'Логгер (один файл, одна очередь)',
          'Кеш или пул ресурсов (соединения с БД)',
          'Драйверы оборудования (принтер, COM-порт)',
        ],
      },
    ],
  },
  {
    slug: 'factory-method',
    name: 'Factory Method',
    category: 'creational',
    intent: 'Определяет интерфейс для создания объекта, но оставляет подклассам решение о том, какой класс инстанцировать.',
    related: ['abstract-factory', 'builder', 'prototype'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Логистическая компания: есть общий процесс доставки (создать транспорт, погрузить, отправить), но какой именно транспорт использовать — грузовик, корабль, самолёт — решает подкласс. Клиент работает с логистикой, не зная о деталях транспорта.',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Код напрямую создаёт объекты через `new`. При добавлении нового типа приходится править все места создания. Невозможно подменить реализацию без изменения кода.',
        points: [
          'Жёсткая связь с конкретным классом',
          'Нарушение Open/Closed Principle',
          'Невозможно подменить реализацию в тестах',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'Заменить прямое создание объектов вызовом специального фабричного метода. Подклассы переопределяют этот метод и решают, что именно создавать.',
        points: [
          'Абстрактный класс Creator объявляет фабричный метод',
          'Подклассы ConcreteCreator реализуют создание',
          'Клиент работает с интерфейсом Product, не зная деталей',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `interface Button {
  render(): void;
  onClick(): void;
}

class WindowsButton implements Button {
  render() { console.log('Отрисовка кнопки Windows'); }
  onClick() { console.log('Событие Windows'); }
}

class HTMLButton implements Button {
  render() { console.log('<button>HTML</button>'); }
  onClick() { console.log('DOM событие'); }
}

abstract class Dialog {
  // Фабричный метод
  abstract createButton(): Button;

  render() {
    const okButton = this.createButton();
    okButton.render();
    okButton.onClick();
  }
}

class WindowsDialog extends Dialog {
  createButton(): Button { return new WindowsButton(); }
}

class WebDialog extends Dialog {
  createButton(): Button { return new HTMLButton(); }
}`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Избавляет код от привязки к конкретным классам',
          'Упрощает добавление новых продуктов',
          'Single Responsibility: код создания в одном месте',
        ],
        cons: [
          'Может привести к большим параллельным иерархиям',
          'Усложняет код (больше классов)',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        points: [
          'Когда заранее неизвестны типы и зависимости объектов',
          'Когда нужна расширяемость (библиотеки, фреймворки)',
          'Когда есть общая логика обработки, но детали разные',
          'UI-фреймворки (кросс-платформенные виджеты)',
          'Парсеры разных форматов',
        ],
      },
    ],
  },
  {
    slug: 'abstract-factory',
    name: 'Abstract Factory',
    category: 'creational',
    intent: 'Предоставляет интерфейс для создания семейств связанных или зависимых объектов без указания их конкретных классов.',
    related: ['factory-method', 'builder'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Мебельный магазин «в одном стиле». Вы покупаете комплект: диван, кресло, стол — всё в стиле «Модерн» или «Классика». Нельзя смешать диван в стиле модерн с викторианским столом — это нарушит гармонию. Abstract Factory гарантирует, что все элементы интерьера будут из одного набора.',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Нужно создавать семейства связанных объектов (кнопка + чекбокс + меню одной темы). Нельзя смешивать элементы разных тем — это сломает визуальную или логическую целостность.',
        points: [
          'Прямое создание привязывает к конкретным классам',
          'Нет гарантии совместимости элементов',
          'Сложно переключаться между семействами',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'Объявить интерфейсы для каждого типа продукта (Button, Checkbox). Объявить интерфейс AbstractFactory, который создаёт все эти продукты. Для каждого семейства реализовать свою фабрику (WinFactory, MacFactory).',
        points: [
          'Каждая фабрика создаёт полное семейство',
          'Продукты одной фабрики совместимы',
          'Клиентский код зависит только от интерфейсов',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `interface Button { render(): void; }
interface Checkbox { render(): void; }

interface GUIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

class WinButton implements Button {
  render() { console.log('Win кнопка'); }
}
class WinCheckbox implements Checkbox {
  render() { console.log('Win чекбокс'); }
}

class MacButton implements Button {
  render() { console.log('Mac кнопка'); }
}
class MacCheckbox implements Checkbox {
  render() { console.log('Mac чекбокс'); }
}

class WinFactory implements GUIFactory {
  createButton() { return new WinButton(); }
  createCheckbox() { return new WinCheckbox(); }
}

class MacFactory implements GUIFactory {
  createButton() { return new MacButton(); }
  createCheckbox() { return new MacCheckbox(); }
}

// Приложение
class Application {
  private factory: GUIFactory;
  constructor(factory: GUIFactory) { this.factory = factory; }
  render() {
    this.factory.createButton().render();
    this.factory.createCheckbox().render();
  }
}`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Гарантия совместимости продуктов',
          'Избавление от привязки к конкретным классам',
          'Single Responsibility и Open/Closed',
        ],
        cons: [
          'Много интерфейсов и классов',
          'Сложно добавить новый тип продукта (править все фабрики)',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        points: [
          'Кросс-платформенный UI',
          'Темы оформления',
          'Семейства драйверов (Win/Linux/Mac)',
          'Игровые движки (разные стили врагов, оружия)',
        ],
      },
    ],
  },
  {
    slug: 'builder',
    name: 'Builder',
    category: 'creational',
    intent: 'Разделяет конструирование сложного объекта от его представления, позволяя использовать один и тот же процесс для разных представлений.',
    related: ['abstract-factory', 'prototype'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Ресторан с конструктором бургера. Вы говорите: булочка — да, котлета — говядина, сыр — чеддер, соус — острый, овощи — без лука. Официант (Director) принимает заказ, но бургер (Product) собирается пошагово. Можно заказать бургер и без соуса — порядок шагов гибкий.',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Конструктор с 10 параметрами — антипаттерн «telescoping constructor». Некоторые параметры опциональны, и не очевидно, что есть что. Нужен способ собирать объект пошагово.',
        points: [
          'Перегрузки конструктора с разными комбинациями параметров',
          'Куча setter-ов — объект может быть в «полуготовом» состоянии',
          'Сложно читать код создания',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'Вынести логику конструирования в отдельный класс Builder с методами для каждого шага. Метод `build()` возвращает готовый объект. Необязательно вызывать все шаги.',
        points: [
          'Builder предоставляет fluent-интерфейс (метод возвращает this)',
          'Каждый метод настраивает одну часть',
          'build() собирает итоговый объект',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `class Pizza {
  constructor(
    public dough: string = '',
    public sauce: string = '',
    public topping: string[] = [],
  ) {}
}

class PizzaBuilder {
  private dough = '';
  private sauce = '';
  private topping: string[] = [];

  setDough(dough: string): this {
    this.dough = dough;
    return this;
  }
  setSauce(sauce: string): this {
    this.sauce = sauce;
    return this;
  }
  addTopping(t: string): this {
    this.topping.push(t);
    return this;
  }
  build(): Pizza {
    return new Pizza(this.dough, this.sauce, [...this.topping]);
  }
}

// Использование — читается как предложение
const pizza = new PizzaBuilder()
  .setDough('тонкое тесто')
  .setSauce('томатный')
  .addTopping('моцарелла')
  .addTopping('пепперони')
  .build();`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Пошаговое конструирование, можно пропускать шаги',
          'Переиспользование кода для разных представлений',
          'Single Responsibility: код сборки отдельно от бизнес-логики',
        ],
        cons: [
          'Усложняет код из-за дополнительных классов',
          'Builder дублирует поля продукта',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        points: [
          'Объекты с множеством опциональных параметров',
          'SQL-запросы (QueryBuilder)',
          'HTTP-клиенты (запрос с заголовками, телом, параметрами)',
          'Конфигурационные объекты',
          'HTML-элементы (jQuery-style: .addClass().css().on())',
        ],
      },
    ],
  },
  {
    slug: 'prototype',
    name: 'Prototype',
    category: 'creational',
    intent: 'Создаёт новые объекты путём клонирования существующего экземпляра (прототипа), а не через new.',
    related: ['factory-method', 'builder'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Деление клетки: биологический организм не собирает новую клетку с нуля из отдельных молекул — он копирует себя. Так и Prototype: вместо сложного `new SomeClass(args)` мы клонируем готовый объект и при необходимости модифицируем.',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Создание объекта «с нуля» дорого: сложная инициализация, загрузка ресурсов, обращение к БД. Иногда нужно «такой же, но слегка другой» — без повторения всей логики инициализации.',
        points: [
          'Дорогостоящая инициализация',
          'Объект создаётся во время выполнения (тип неизвестен компилятору)',
          'Нужна копия существующего с минимальными изменениями',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'Делегировать процесс создания самому объекту. Объект знает, как клонировать себя. Клиент получает копию и может её менять.',
        points: [
          'Объект реализует метод clone()',
          'Клонирование может быть поверхностным или глубоким',
          'Реестр прототипов хранит готовые шаблоны',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `interface Prototype<T> {
  clone(): T;
}

class Shape implements Prototype<Shape> {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public color: string = 'black',
  ) {}

  clone(): Shape {
    // Возвращаем копию с теми же полями
    const clone = Object.create(this);
    Object.assign(clone, structuredClone({
      x: this.x,
      y: this.y,
      color: this.color,
    }));
    return clone;
  }
}

const circle = new Shape(10, 20, 'orange');
const anotherCircle = circle.clone();
anotherCircle.color = 'blue';

console.log(circle.color);     // orange
console.log(anotherCircle.color); // blue`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Клонирование быстрее создания с нуля',
          'Альтернатива наследованию (не нужно создавать иерархию)',
          'Можно клонировать объекты, не зная их конкретного типа',
        ],
        cons: [
          'Глубокое копирование сложно для объектов с циклическими ссылками',
          'Клонирование объектов со сложной семантикой может быть нетривиальным',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        points: [
          'Сложная инициализация (например, кешированные конфиги)',
          'Игры: спавн одинаковых врагов',
          'Объекты с большим числом полей (копия одной строкой)',
          'DOM-элементы (клон шаблона)',
        ],
      },
    ],
  },

  // ========== STRUCTURAL ==========
  {
    slug: 'adapter',
    name: 'Adapter',
    category: 'structural',
    intent: 'Преобразует интерфейс одного класса в интерфейс другого, который ожидает клиент. Позволяет классам с несовместимыми интерфейсами работать вместе.',
    related: ['decorator', 'facade', 'bridge'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Переходник для розетки. У вас европейская вилка, а розетка — американская. Переходник не меняет напряжение, но согласовывает форму контактов. Так и Adapter: не меняет функциональность, адаптирует интерфейс.',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Есть полезный класс, но его интерфейс не совпадает с тем, что ожидает ваш код. Переписывать класс нельзя (чужой код, legacy). Переписывать клиента тоже дорого.',
        points: [
          'Сторонняя библиотека с другим API',
          'Legacy-код нельзя менять',
          'Нужно интегрировать несколько несовместимых систем',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'Создать класс-адаптер, который реализует целевой интерфейс и внутри делегирует вызовы адаптируемому объекту.',
        points: [
          'Target — интерфейс, который нужен клиенту',
          'Adaptee — существующий класс с неподходящим интерфейсом',
          'Adapter — реализует Target, использует Adaptee внутри',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `// Целевой интерфейс — то, что ожидает клиент
interface MediaPlayer {
  play(filename: string): void;
}

// Адаптируемый класс — есть в проекте, API неудобное
class AdvancedPlayer {
  playVlc(filename: string) { console.log(\`Воспроизведение VLC: \${filename}\`); }
  playMp4(filename: string) { console.log(\`Воспроизведение MP4: \${filename}\`); }
}

// Адаптер
class MediaAdapter implements MediaPlayer {
  private advanced = new AdvancedPlayer();

  play(filename: string): void {
    if (filename.endsWith('.vlc')) {
      this.advanced.playVlc(filename);
    } else if (filename.endsWith('.mp4')) {
      this.advanced.playMp4(filename);
    }
  }
}

// Клиент работает только с MediaPlayer
class AudioPlayer implements MediaPlayer {
  private adapter = new MediaAdapter();

  play(filename: string): void {
    if (filename.endsWith('.mp3')) {
      console.log(\`MP3: \${filename}\`);
    } else {
      this.adapter.play(filename);
    }
  }
}`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Отделяет интерфейс от бизнес-логики',
          'Повторное использование существующих классов',
          'Single Responsibility',
        ],
        cons: [
          'Усложняет код из-за новых классов и интерфейсов',
          'Иногда проще переписать клиента',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        points: [
          'Интеграция со сторонними библиотеками',
          'Legacy-код',
          'Преобразование форматов данных',
          'Унификация нескольких API',
        ],
      },
    ],
  },
  {
    slug: 'bridge',
    name: 'Bridge',
    category: 'structural',
    intent: 'Разделяет абстракцию и реализацию так, чтобы они могли изменяться независимо.',
    related: ['adapter', 'strategy', 'state'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Пульт от телевизора (абстракция) и сам телевизор (реализация). Один пульт может работать с разными телевизорами (Sony, Samsung) через универсальный интерфейс. Можно сделать пульт для разных моделей или телевизор с разными пультами — они развиваются независимо.',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Два независимых измерения вариативности (форма × цвет, форма × материал, ОС × тип окна). Наследование приводит к взрывному росту подклассов: 3 формы × 4 цвета = 12 классов.',
        points: [
          'Множественное наследование классов → комбинаторный взрыв',
          'Изменение одного измерения ломает другое',
          'Нужно расширять обе оси независимо',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'Выделить две независимые иерархии: абстракцию и реализацию. Абстракция хранит ссылку на реализацию и делегирует ей работу.',
        points: [
          'Abstraction содержит Implementor',
          'RefinedAbstraction расширяет абстракцию',
          'ConcreteImplementor реализует платформу',
          'Композиция вместо наследования',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `// Implementor — реализация
interface Renderer {
  renderShape(name: string): void;
}

class VectorRenderer implements Renderer {
  renderShape(name: string) {
    console.log(\`Рисуем \${name} векторно\`);
  }
}

class RasterRenderer implements Renderer {
  renderShape(name: string) {
    console.log(\`Рисуем \${name} пиксельно\`);
  }
}

// Abstraction
abstract class Shape {
  constructor(protected renderer: Renderer) {}
  abstract draw(): void;
}

class Circle extends Shape {
  draw() { this.renderer.renderShape('круг'); }
}

class Square extends Shape {
  draw() { this.renderer.renderShape('квадрат'); }
}

// Использование — комбинируем свободно
new Circle(new VectorRenderer()).draw();   // векторный круг
new Square(new RasterRenderer()).draw();  // пиксельный квадрат`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Независимое расширение абстракции и реализации',
          'Single Responsibility',
          'Open/Closed: новые комбинации без взрыва классов',
        ],
        cons: [
          'Усложняет дизайн (нужно заранее выделить измерения)',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        points: [
          'Кросс-платформенные UI (Window × Theme)',
          'Драйверы устройств и API',
          'ORM-абстракции',
          'Сетевые протоколы с разными транспортами',
        ],
      },
    ],
  },
  {
    slug: 'composite',
    name: 'Composite',
    category: 'structural',
    intent: 'Компонует объекты в древовидные структуры для представления иерархий часть-целое. Позволяет клиенту единообразно работать с отдельными объектами и их композициями.',
    related: ['iterator', 'decorator', 'flyweight'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Армия. Генерал командует полками, полки — ротами, роты — взводами. Приказы одинаковые для всех уровней. Генерал может скомандовать «Атака!» — и вся армия двинется, не важно, обращается он к одному солдату или к дивизии.',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Есть древовидная структура (файлы и папки, меню и подменю, организация). Клиенту нужно работать одинаково с листом и группой — иначе код обрастает проверками типов.',
        points: [
          'Множество `if (это группа)` и `if (это элемент)`',
          'Сложно добавить новый тип узла',
          'Код дублируется на каждом уровне иерархии',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'Определить общий интерфейс Component с операциями для листа и группы. Группа хранит массив Component и делегирует операции детям.',
        points: [
          'Component — общий интерфейс (leaf + composite)',
          'Leaf — конечный элемент, не имеет детей',
          'Composite — содержит детей и реализует операции через них',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `interface FileSystemNode {
  getSize(): number;
  display(indent: string): void;
}

class File implements FileSystemNode {
  constructor(private name: string, private size: number) {}
  getSize() { return this.size; }
  display(indent: string) {
    console.log(\`\${indent}📄 \${this.name} (\${this.size}KB)\`);
  }
}

class Directory implements FileSystemNode {
  private children: FileSystemNode[] = [];
  constructor(private name: string) {}

  add(node: FileSystemNode) { this.children.push(node); }

  getSize(): number {
    return this.children.reduce((sum, c) => sum + c.getSize(), 0);
  }

  display(indent: string = '') {
    console.log(\`\${indent}📁 \${this.name}\`);
    this.children.forEach(c => c.display(indent + '  '));
  }
}

const root = new Directory('project');
const src = new Directory('src');
src.add(new File('index.ts', 12));
src.add(new File('app.ts', 8));
root.add(src);
root.add(new File('README.md', 4));
root.display();   // обходим рекурсивно
console.log('Total:', root.getSize(), 'KB');`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Единообразная работа с листьями и группами',
          'Open/Closed: легко добавить новые типы',
          'Рекурсивные структуры становятся тривиальными',
        ],
        cons: [
          'Сложно ограничить типы детей (только файлы? или подпапки тоже?)',
          'Может быть трудно соблюсти контракт интерфейса для листа',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        points: [
          'Файловая система, DOM',
          'Организационные структуры',
          'Меню и вложенные категории',
          'Граф сцен в играх (группы объектов)',
          'UI-компоненты с вложенностью (React/Vue деревья)',
        ],
      },
    ],
  },
  {
    slug: 'decorator',
    name: 'Decorator',
    category: 'structural',
    intent: 'Динамически добавляет объекту новые обязанности. Гибкая альтернатива наследованию для расширения функциональности.',
    related: ['adapter', 'composite', 'proxy'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Одежда. Вы берёте базовое платье и можете «обернуть» его шарфом, курткой, шапкой. Каждый слой добавляет функциональность (тепло, стиль), но платье остаётся платьем. Можно снять шарф — базовая функциональность не пострадала.',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Нужно добавить/убрать поведение объекта на лету. Наследование — статично, комбинации взрываются (10 поведений × 20 объектов = 200 классов).',
        points: [
          'Хотим комбинировать поведения без наследования',
          'Нужно добавлять/убирать функциональность в runtime',
          'Не хочется плодить подклассы',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'Обернуть объект в декоратор, реализующий тот же интерфейс. Декоратор делегирует базовую работу обёрнутому объекту и добавляет своё поведение до/после.',
        points: [
          'Component — общий интерфейс',
          'ConcreteComponent — базовый объект',
          'Decorator — обёртка, делегирует Component',
          'ConcreteDecorator — конкретное расширение',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `interface Coffee {
  cost(): number;
  description(): string;
}

class Espresso implements Coffee {
  cost() { return 100; }
  description() { return 'Эспрессо'; }
}

// Базовый декоратор
abstract class CoffeeDecorator implements Coffee {
  constructor(protected coffee: Coffee) {}
  abstract cost(): number;
  abstract description(): string;
}

class MilkDecorator extends CoffeeDecorator {
  cost() { return this.coffee.cost() + 30; }
  description() { return this.coffee.description() + ' + молоко'; }
}

class SugarDecorator extends CoffeeDecorator {
  cost() { return this.coffee.cost() + 10; }
  description() { return this.coffee.description() + ' + сахар'; }
}

// Свободно комбинируем
let coffee: Coffee = new Espresso();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
console.log(coffee.description()); // Эспрессо + молоко + сахар
console.log(coffee.cost(), 'руб'); // 140`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Гибкое расширение без наследования',
          'Open/Closed: новое поведение через новый декоратор',
          'Композиция вместо взрыва подклассов',
        ],
        cons: [
          'Много мелких классов',
          'Сложно отлаживать (цепочка обёрток)',
          'Порядок декораторов имеет значение',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        points: [
          'Middleware в HTTP-фреймворках (Express)',
          'Streams в Node.js',
          'Потоки ввода-вывода (сжатие, шифрование)',
          'UI-компоненты с дополнительным поведением',
        ],
      },
    ],
  },
  {
    slug: 'facade',
    name: 'Facade',
    category: 'structural',
    intent: 'Предоставляет единый интерфейс к набору интерфейсов подсистемы. Делает подсистему проще в использовании.',
    related: ['adapter', 'mediator'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Оператор колл-центра. Клиенту не нужно знать, какие отделы обрабатывают заказ. Он звонит оператору, тот сам координирует работу отделов. Оператор — Facade для сложной внутренней системы.',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Сложная подсистема из множества классов. Клиенту нужна только часть функциональности. Прямое использование запутывает.',
        points: [
          'Клиент видит десятки классов',
          'Логика «как пользоваться» размазана по подсистеме',
          'Слабая связанность желательна, но полная изоляция неудобна',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'Добавить класс Facade с простыми методами, которые делегируют работу нужным классам подсистемы в правильном порядке.',
        points: [
          'Facade — единая точка входа',
          'Подсистемы остаются доступными напрямую (не обязательно)',
          'Facade знает, как правильно их скомбинировать',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `// Подсистема: сложная логика заказа
class InventoryService {
  check(productId: string): boolean { /* ... */ return true; }
}
class PaymentService {
  charge(amount: number): boolean { /* ... */ return true; }
}
class ShippingService {
  ship(productId: string, address: string): string {
    return 'TRACK-12345';
  }
}
class NotificationService {
  send(email: string, message: string) { /* ... */ }
}

// Facade — простой API для клиента
class OrderFacade {
  private inventory = new InventoryService();
  private payment = new PaymentService();
  private shipping = new ShippingService();
  private notify = new NotificationService();

  placeOrder(productId: string, amount: number, email: string, address: string) {
    if (!this.inventory.check(productId)) throw new Error('Нет в наличии');
    if (!this.payment.charge(amount)) throw new Error('Платёж отклонён');
    const track = this.shipping.ship(productId, address);
    this.notify.send(email, \`Заказ оформлен: \${track}\`);
    return track;
  }
}

// Клиент
const order = new OrderFacade();
order.placeOrder('SKU-001', 5000, 'user@example.com', 'Москва');`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Изолирует клиента от сложной подсистемы',
          'Упрощает использование',
          'Слабая связанность',
        ],
        cons: [
          'Facade может стать «божественным объектом» (God Object)',
          'Дополнительный слой абстракции',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        points: [
          'Сложные сторонние библиотеки',
          'Устаревший код, который нужно изолировать',
          'Слои сервисов в приложении',
          'API gateway в микросервисах',
        ],
      },
    ],
  },
  {
    slug: 'flyweight',
    name: 'Flyweight',
    category: 'structural',
    intent: 'Экономит память, разделяя общее состояние между множеством объектов вместо хранения его в каждом.',
    related: ['composite', 'prototype'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Сеть кофеен. У всех стаканчиков одинаковый дизайн (логотип, цвет). Нет смысла рисовать логотип на каждом — достаточно один раз «поделить» дизайн между всеми стаканчиками. Уникальным остаётся только содержимое (кофе, имя клиента).',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Много объектов с дублирующимися данными. Память заканчивается, потому что 1000000 объектов × 1KB общих данных = 1GB впустую.',
        points: [
          'Большое число похожих объектов',
          'Бо́льшая часть состояния одинакова',
          'Высокое потребление памяти',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'Разделить состояние на внутреннее (общее, хранится в Flyweight) и внешнее (уникальное, передаётся клиентом). Flyweight-объекты переиспользуются.',
        points: [
          'Внутреннее состояние — общее, неизменное',
          'Внешнее состояние — уникальное для каждого случая',
          'Flyweight Factory кеширует и выдаёт уже созданные',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `// Внутреннее состояние — общее для всех деревьев одного типа
class TreeType {
  constructor(
    public name: string,
    public color: string,
    public texture: string, // тяжёлая текстура, не дублируем
  ) {}
  draw(x: number, y: number) {
    console.log(\`\${this.name} (\${this.color}) at (\${x},\${y})\`);
  }
}

// Фабрика — хранит и переиспользует типы
class TreeFactory {
  private static types = new Map<string, TreeType>();

  static getType(name: string, color: string, texture: string): TreeType {
    const key = \`\${name}-\${color}-\${texture}\`;
    if (!this.types.has(key)) {
      this.types.set(key, new TreeType(name, color, texture));
      console.log('Создан новый тип дерева');
    }
    return this.types.get(key)!;
  }
}

// Внешнее состояние — уникальное
class Tree {
  constructor(
    public x: number,
    public y: number,
    public type: TreeType, // ссылка на общий тип
  ) {}
  draw() { this.type.draw(this.x, this.y); }
}

// Создаём миллион деревьев, типов — всего 3
const forest: Tree[] = [];
for (let i = 0; i < 1_000_000; i++) {
  const type = TreeFactory.getType('Дуб', 'зелёный', 'oak.png');
  forest.push(new Tree(Math.random() * 1000, Math.random() * 1000, type));
}`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Экономия памяти',
          'Меньше объектов в куче',
        ],
        cons: [
          'Усложняет код (разделение состояния)',
          'Внешнее состояние нужно передавать каждый раз',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        points: [
          'Игры (один тип врага/пули × тысячи экземпляров)',
          'Текстовые редакторы (символы с разделяемыми глифами)',
          'Кеши и пулы',
        ],
      },
    ],
  },
  {
    slug: 'proxy',
    name: 'Proxy',
    category: 'structural',
    intent: 'Подставляет объект-заместитель вместо реального объекта для контроля доступа, ленивой загрузки, кеширования и т.д.',
    related: ['decorator', 'adapter', 'facade'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Банковская карта — proxy для наличных. Карта сама по себе не деньги, но даёт доступ к деньгам на счёте. Контролирует траты (лимит), безопасно (не нужна пачка наличных в кармане), ленивая загрузка (деньги уже в банке, а не у вас).',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Нужен объект, но обращаться к нему напрямую нежелательно или невозможно: тяжёлый ресурс, требуется защита, нужна статистика.',
        points: [
          'Объект дорого создавать (загрузка большого файла, БД)',
          'Нужен контроль доступа (авторизация)',
          'Нужно логировать/кешировать вызовы',
          'Объект на удалённом сервере',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'Создать класс Proxy с тем же интерфейсом, что и реальный объект. Внутри Proxy хранит ссылку (или создаёт при необходимости) на реальный объект и перехватывает вызовы.',
        points: [
          'Виртуальный proxy — ленивая загрузка',
          'Защищающий proxy — проверка прав',
          'Кеширующий proxy — мемоизация',
          'Удалённый proxy — RPC',
          'Логирующий proxy — отслеживание вызовов',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `interface Image {
  display(): void;
}

class HeavyImage implements Image {
  constructor(private filename: string) {
    console.log(\`Загружаем \${filename} из диска (10MB)...\`);
  }
  display() { console.log(\`Показываем \${this.filename}\`); }
}

// Виртуальный proxy — загружает только когда нужно
class ImageProxy implements Image {
  private real: HeavyImage | null = null;
  constructor(private filename: string) {}

  display(): void {
    if (!this.real) {
      this.real = new HeavyImage(this.filename); // ленивая загрузка
    }
    this.real.display();
  }
}

// Клиент не знает, что файл ещё не загружен
const img = new ImageProxy('photo.jpg');
// ... проходит время, дисплей не вызывается — файл не грузится
img.display(); // только сейчас грузим и показываем`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Контроль доступа без изменения реального объекта',
          'Ленивая инициализация',
          'Кеширование и оптимизация',
        ],
        cons: [
          'Замедление вызовов (дополнительный слой)',
          'Усложнение кода',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        points: [
          'Lazy loading изображений',
          'Защита API (роли, права)',
          'ORM (lazy loading связанных сущностей)',
          'RPC / gRPC клиенты',
          'Встроенный JavaScript Proxy для мета-программирования',
        ],
      },
    ],
  },

  // ========== BEHAVIORAL ==========
  {
    slug: 'chain-of-responsibility',
    name: 'Chain of Responsibility',
    category: 'behavioral',
    intent: 'Передаёт запрос по цепочке обработчиков. Каждый обработчик решает, обработать запрос или передать дальше.',
    related: ['command', 'mediator', 'decorator'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Запрос на отпуск в компании. Сначала заявку видит руководитель группы. Если отпуск до 3 дней — он сам одобряет. Если больше — передаёт директору. Директор: до 2 недель — его уровень, больше — CEO. Запрос идёт по цепочке, пока кто-то не примет решение.',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Запрос нужно обработать одним из нескольких объектов, и набор обработчиков может меняться. Жёстко привязывать отправителя к получателю — негибко.',
        points: [
          'Несколько возможных обработчиков',
          'Набор обработчиков заранее неизвестен',
          'Нужно динамически задавать цепочку',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'Связать объекты-обработчики в цепочку. Каждый обработчик имеет ссылку на следующий. Передаёт запрос, если не может обработать сам.',
        points: [
          'Handler — общий интерфейс (handle, setNext)',
          'BaseHandler — ссылка на next',
          'ConcreteHandler — конкретная логика',
          'Запрос идёт по цепочке до первого успешного обработчика',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `abstract class Handler {
  protected next: Handler | null = null;
  setNext(h: Handler): Handler {
    this.next = h;
    return h;
  }
  handle(req: Request): string | null {
    if (this.canHandle(req)) return this.process(req);
    return this.next?.handle(req) ?? null;
  }
  protected abstract canHandle(req: Request): boolean;
  protected abstract process(req: Request): string;
}

class AuthHandler extends Handler {
  protected canHandle(r: Request) { return r.type === 'auth'; }
  protected process(r: Request) { return 'Авторизация пройдена'; }
}

class ValidationHandler extends Handler {
  protected canHandle(r: Request) { return r.type === 'validation'; }
  protected process(r: Request) { return 'Валидация ОК'; }
}

class LoggerHandler extends Handler {
  // Этот — для всех запросов (логирует, не решает)
  protected canHandle(r: Request) { return true; }
  protected process(r: Request) {
    console.log(\`[LOG] \${r.type}\`);
    return this.next?.handle(r) ?? 'logged';
  }
}

interface Request { type: 'auth' | 'validation' | 'other'; }

// Строим цепочку
const chain = new LoggerHandler();
chain.setNext(new AuthHandler()).setNext(new ValidationHandler());

console.log(chain.handle({ type: 'auth' }));
// [LOG] auth
// Авторизация пройдена`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Слабая связанность отправителя и получателя',
          'Динамическая настройка цепочки',
          'Single Responsibility: каждый обработчик — одна задача',
        ],
        cons: [
          'Запрос может остаться необработанным (нужен fallback)',
          'Сложно отследить выполнение в длинных цепочках',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        points: [
          'Middleware в HTTP-серверах (Express, Koa)',
          'Цепочки валидации',
          'UI-обработка событий (пузырь в DOM)',
          'Pipeline-обработка данных',
        ],
      },
    ],
  },
  {
    slug: 'command',
    name: 'Command',
    category: 'behavioral',
    intent: 'Превращает запрос в самостоятельный объект с информацией о действии и аргументах. Позволяет параметризовать клиентов, ставить команды в очередь, отменять.',
    related: ['chain-of-responsibility', 'strategy', 'memento'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Заказ в ресторане. Вы (клиент) пишете на бумажке «стейк medium rare». Официант несёт бумажку на кухню. Повар читает и готовит. Бумажка — Command: она содержит действие и параметры, и может стоять в очереди, быть отменена или повторена.',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Нужно ставить операции в очередь, логировать, отменять или повторять их. Прямой вызов метода это не позволяет.',
        points: [
          'Нужна история операций',
          'Нужна отмена (undo/redo)',
          'Нужна очередь или отложенное выполнение',
          'Нужно параметризовать объекты действиями',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'Вынести запрос в отдельный объект Command с методом execute(). Передать команду Invoker-у (кнопка, меню). Invoker не знает о Receiver — только вызывает execute().',
        points: [
          'Command — интерфейс с execute() и undo()',
          'Receiver — объект, выполняющий работу',
          'Invoker — инициатор (кнопка, очередь)',
          'Client — создаёт команды и связывает их с receiver',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `// Receiver
class TextEditor {
  text = '';
  write(s: string) { this.text += s; }
  erase(n: number) { this.text = this.text.slice(0, -n); }
}

// Command
interface Command {
  execute(): void;
  undo(): void;
}

class WriteCommand implements Command {
  constructor(private editor: TextEditor, private text: string) {}
  execute() { this.editor.write(this.text); }
  undo() { this.editor.erase(this.text.length); }
}

// Invoker — хранит историю
class EditorInvoker {
  private history: Command[] = [];
  run(cmd: Command) {
    cmd.execute();
    this.history.push(cmd);
  }
  undo() {
    const cmd = this.history.pop();
    cmd?.undo();
  }
}

const editor = new TextEditor();
const invoker = new EditorInvoker();

invoker.run(new WriteCommand(editor, 'Привет, '));
invoker.run(new WriteCommand(editor, 'мир!'));
console.log(editor.text); // Привет, мир!

invoker.undo();
console.log(editor.text); // Привет,`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Single Responsibility: разделение запроса и выполнения',
          'Open/Closed: новые команды без изменения существующих',
          'Отмена, очередь, история',
        ],
        cons: [
          'Много классов (по классу на команду)',
          'Усложнение кода для простых случаев',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        points: [
          'Undo/Redo в редакторах',
          'Очереди задач',
          'Транзакции',
          'GUI — пункты меню, кнопки как команды',
          'Job queues в фоне',
        ],
      },
    ],
  },
  {
    slug: 'interpreter',
    name: 'Interpreter',
    category: 'behavioral',
    intent: 'Для заданного языка определяет представление его грамматики и интерпретатор, использующий это представление.',
    related: ['composite', 'visitor', 'strategy'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Переводчик языка. Ему дают грамматику (правила: «существительное + глагол = предложение») и текст. Он разбирает текст по правилам и переводит. Interpreter — то же самое, только для формального языка.',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Нужно обрабатывать предложения простого языка (формулы, регулярки, конфиги) и выполнять их. Парсить каждый раз строку — медленно и ненадёжно.',
        points: [
          'Язык простой и редко меняется',
          'Нужна неоднократная интерпретация выражений',
          'Эффективность важнее гибкости',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'Определить грамматику как классы. Каждое правило — узел в дереве. Построить AST из входной строки и обойти его.',
        points: [
          'AbstractExpression — interpret()',
          'TerminalExpression — конечные символы',
          'NonterminalExpression — составные правила',
          'Context — глобальное состояние интерпретатора',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `// Простой калькулятор: числа, +, *
interface Expression {
  interpret(): number;
}

class Number implements Expression {
  constructor(private value: number) {}
  interpret() { return this.value; }
}

class Plus implements Expression {
  constructor(private left: Expression, private right: Expression) {}
  interpret() { return this.left.interpret() + this.right.interpret(); }
}

class Multiply implements Expression {
  constructor(private left: Expression, private right: Expression) {}
  interpret() { return this.left.interpret() * this.right.interpret(); }
}

// AST для "3 + 5 * 2"
const expr: Expression = new Plus(
  new Number(3),
  new Multiply(new Number(5), new Number(2))
);
console.log(expr.interpret()); // 13`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Простота реализации для простых грамматик',
          'Легко расширять язык',
        ],
        cons: [
          'Сложные грамматики → взрыв классов',
          'Производительность (дерево объектов вместо строки)',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        points: [
          'SQL-подобные языки запросов',
          'DSL (Domain Specific Language)',
          'Формулы в Excel',
          'Парсинг регулярных выражений',
          'Шаблонизаторы',
        ],
      },
    ],
  },
  {
    slug: 'iterator',
    name: 'Iterator',
    category: 'behavioral',
    intent: 'Предоставляет способ последовательного доступа к элементам составного объекта, не раскрывая его внутреннего представления.',
    related: ['composite', 'visitor', 'memento'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Телевизор с пультом. Вам не нужно знать, как устроен канал внутри (спутник, кабель, IPTV). Пульт даёт единый интерфейс: «следующий канал», «предыдущий». Итератор — тот же пульт для коллекции.',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Есть сложная структура данных (дерево, граф, БД-курсор), и нужен единый способ обхода. Без итератора клиент должен знать внутреннее устройство.',
        points: [
          'Разные коллекции — разные способы обхода',
          'Дублирование кода обхода в клиентском коде',
          'Хотим несколько одновременных обходов',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'Выделить обход в отдельный объект Iterator с методами next(), hasNext(). Коллекция предоставляет метод создания итератора.',
        points: [
          'Iterator — hasNext(), next()',
          'Aggregate (Collection) — createIterator()',
          'Конкретные коллекции — конкретные итераторы',
          'Клиент использует только интерфейс',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `interface Iterator<T> {
  next(): T | null;
  hasNext(): boolean;
}

class NumberList implements Iterator<number> {
  private i = 0;
  constructor(private items: number[]) {}

  next(): number | null {
    return this.hasNext() ? this.items[this.i++] : null;
  }
  hasNext(): boolean {
    return this.i < this.items.length;
  }
}

const list = new NumberList([1, 2, 3, 4]);
while (list.hasNext()) {
  console.log(list.next());
}

// Встроенный пример — Symbol.iterator в JS
const arr = [10, 20, 30];
for (const value of arr) {
  console.log(value); // 10, 20, 30
}

// Map, Set, строки — все итерабельные
console.log([...'hello']); // ['h','e','l','l','o']`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Single Responsibility: обход отдельно от коллекции',
          'Несколько итераторов по одной коллекции',
          'Единообразный интерфейс',
        ],
        cons: [
          'Избыточно для простых коллекций',
          'Overhead на маленьких структурах',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        points: [
          'Встроен в JavaScript (Symbol.iterator)',
          'Генераторы Python/JS',
          'LINQ в C#',
          'Курсоры в БД',
          'DFS/BFS-обход деревьев и графов',
        ],
      },
    ],
  },
  {
    slug: 'mediator',
    name: 'Mediator',
    category: 'behavioral',
    intent: 'Определяет объект, инкапсулирующий способ взаимодействия множества объектов. Слабая связанность: коллеги общаются через посредника, а не напрямую.',
    related: ['facade', 'observer', 'chain-of-responsibility'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Диспетчер в аэропорту. Самолёты не разговаривают друг с другом («Эй, Boeing 737, я сажусь первым!»). Они общаются с диспетчером, а тот координирует взлёт, посадку и руление. Mediator — такой диспетчер для компонентов.',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Много объектов общаются друг с другом напрямую. Каждый знает обо всех — спагетти-связи, сложно менять.',
        points: [
          'N объектов × N связей',
          'Изменение одного требует менять всех',
          'Логика взаимодействия размазана',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'Создать Mediator, через который общаются все. Коллеги знают только о посреднике.',
        points: [
          'Mediator — интерфейс с уведомлениями',
          'ConcreteMediator — координирует коллег',
          'Colleague — знает только о Mediator',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `interface ChatMediator {
  send(message: string, from: User): void;
  add(user: User): void;
}

class ChatRoom implements ChatMediator {
  private users: User[] = [];
  add(user: User) { this.users.push(user); }
  send(message: string, from: User) {
    this.users
      .filter(u => u !== from)
      .forEach(u => u.receive(message, from));
  }
}

class User {
  constructor(public name: string, private mediator: ChatMediator) {
    mediator.add(this);
  }
  send(message: string) { this.mediator.send(message, this); }
  receive(message: string, from: User) {
    console.log(\`\${this.name} получил от \${from.name}: \${message}\`);
  }
}

const room = new ChatRoom();
const alice = new User('Алиса', room);
const bob = new User('Боб', room);
const carol = new User('Карина', room);

alice.send('Привет всем!');
// Боб получил от Алиса: Привет всем!
// Карина получил от Алиса: Привет всем!`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Single Responsibility: общение в одном месте',
          'Open/Closed: новые коллеги без изменения существующих',
          'Слабая связанность',
        ],
        cons: [
          'Mediator может стать God Object',
          'Сложнее отлаживать (всё через одну точку)',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        points: [
          'Чаты и форумы',
          'UI-формы с зависимыми полями',
          'Диалоги между окнами',
          'Координация микросервисов (saga)',
        ],
      },
    ],
  },
  {
    slug: 'memento',
    name: 'Memento',
    category: 'behavioral',
    intent: 'Не нарушая инкапсуляции, фиксирует и сохраняет внутреннее состояние объекта, чтобы потом можно было восстановить его.',
    related: ['command', 'iterator'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Снимок экрана в Photoshop. Запоминает всё текущее состояние документа: слои, цвета, историю. Можно «откатить» редактирование. Снимок — Memento. История снимков — Caretaker.',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Нужна возможность откатить объект к предыдущему состоянию, не раскрывая его внутренности и не нарушая инкапсуляцию.',
        points: [
          'Нужен undo',
          'Состояние сложное (много полей)',
          'Хотим сохранять историю',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'Originator создаёт Memento со своим снимком. Caretaker хранит список снимков, но не имеет к ним доступа. По запросу — восстанавливает состояние.',
        points: [
          'Memento — снимок состояния (иммутабельный)',
          'Originator — создаёт и применяет Memento',
          'Caretaker — хранит историю',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `class EditorMemento {
  constructor(public readonly state: string) {}
}

class Editor {
  constructor(private text: string = '') {}
  type(s: string) { this.text += s; }
  getText() { return this.text; }
  save(): EditorMemento { return new EditorMemento(this.text); }
  restore(m: EditorMemento) { this.text = m.state; }
}

class History {
  private stack: EditorMemento[] = [];
  push(m: EditorMemento) { this.stack.push(m); }
  pop(): EditorMemento | undefined { return this.stack.pop(); }
}

const editor = new Editor();
const history = new History();

editor.type('Привет');
history.push(editor.save());

editor.type(', мир');
console.log(editor.getText()); // Привет, мир

editor.restore(history.pop()!);
console.log(editor.getText()); // Привет`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Не нарушает инкапсуляцию',
          'Упрощает структуру Originator (не хранит историю сам)',
        ],
        cons: [
          'Тяжёлая память при больших состояниях',
          'Не забывайте чистить историю',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        points: [
          'Undo/Redo в редакторах',
          'Сохранение прогресса в играх (checkpoint)',
          'Транзакции',
        ],
      },
    ],
  },
  {
    slug: 'observer',
    name: 'Observer',
    category: 'behavioral',
    intent: 'Определяет зависимость «один ко многим» между объектами: при изменении состояния одного все зависимые уведомляются автоматически.',
    related: ['mediator', 'iterator', 'state'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Подписка на YouTube-канал. Вы подписались (стали Observer-ом). Канал (Subject) публикует видео — все подписчики получают уведомление. Канал не знает, кто подписан, но рассылает обновления всем.',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Объект изменился — нужно обновить несколько других. Прямые вызовы делают код запутанным и трудно расширяемым.',
        points: [
          'Subject жёстко связан с подписчиками',
          'Невозможно добавить новый подписчик без правки Subject',
          'Нужен механизм уведомлений',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'Subject хранит список Observer. При изменении вызывает notify() и каждый observer делает update().',
        points: [
          'Subject — интерфейс подписки/уведомления',
          'Observer — интерфейс обновления',
          'ConcreteSubject — реализация с состоянием',
          'ConcreteObserver — реакция на изменение',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `interface Observer {
  update(temperature: number): void;
}

class WeatherStation {
  private observers: Observer[] = [];
  private temperature = 0;

  attach(o: Observer) { this.observers.push(o); }
  detach(o: Observer) {
    this.observers = this.observers.filter(x => x !== o);
  }

  setTemperature(t: number) {
    this.temperature = t;
    this.notify();
  }

  private notify() {
    this.observers.forEach(o => o.update(this.temperature));
  }
}

class Display implements Observer {
  constructor(private name: string) {}
  update(t: number) {
    console.log(\`[\${this.name}] Температура: \${t}°C\`);
  }
}

const station = new WeatherStation();
const homeDisplay = new Display('Дом');
const officeDisplay = new Display('Офис');

station.attach(homeDisplay);
station.attach(officeDisplay);

station.setTemperature(25);
// [Дом] Температура: 25°C
// [Офис] Температура: 25°C`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Open/Closed: новые подписчики без изменения Subject',
          'Динамические связи (подписка/отписка в runtime)',
        ],
        cons: [
          'Случайный порядок уведомлений',
          'Утечки памяти (забытый observer)',
          'При сильной связанности через события — сложно отлаживать',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        points: [
          'EventEmitter в Node.js',
          'DOM-события (addEventListener)',
          'Redux/MobX (подписки на store)',
          'WebSocket клиенты',
          'RxJS Observables',
          'Pub/Sub системы (Kafka, Redis)',
        ],
      },
    ],
  },
  {
    slug: 'state',
    name: 'State',
    category: 'behavioral',
    intent: 'Позволяет объекту изменять своё поведение при изменении внутреннего состояния. Внешне выглядит как будто объект сменил класс.',
    related: ['strategy', 'iterator', 'observer'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Светофор. У него три состояния: красный, жёлтый, зелёный. В каждом состоянии он ведёт себя по-разному: красный — стоять, зелёный — ехать. Переходы между состояниями чёткие.',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Объект имеет много состояний, и в каждом он ведёт себя по-разному. Логика состояний обычно размазана по if/else или switch — сложно поддерживать.',
        points: [
          'Множество условных веток по состоянию',
          'Добавление нового состояния требует править существующий код',
          'Переходы между состояниями запутаны',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'Выделить каждое состояние в отдельный класс с одинаковым интерфейсом. Context делегирует поведение текущему состоянию.',
        points: [
          'State — общий интерфейс поведения',
          'ConcreteState — реализация для конкретного состояния',
          'Context — хранит ссылку на текущее состояние',
          'Состояния могут переключать Context',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `interface State {
  handle(ctx: Player): void;
}

class PlayingState implements State {
  handle(ctx: Player) {
    console.log('Пауза');
    ctx.setState(new PausedState());
  }
}

class PausedState implements State {
  handle(ctx: Player) {
    console.log('Воспроизведение');
    ctx.setState(new PlayingState());
  }
}

class StoppedState implements State {
  handle(ctx: Player) {
    console.log('Запуск');
    ctx.setState(new PlayingState());
  }
}

class Player {
  private state: State = new StoppedState();
  setState(s: State) { this.state = s; }
  pressButton() { this.state.handle(this); }
}

const player = new Player();
player.pressButton(); // Запуск
player.pressButton(); // Пауза
player.pressButton(); // Воспроизведение`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Single Responsibility: каждое состояние в своём классе',
          'Open/Closed: новые состояния без правки существующих',
          'Избавление от больших switch/if',
        ],
        cons: [
          'Может быть избыточно для простых случаев (3 состояния)',
          'Много классов',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        points: [
          'UI-элементы (loading, error, success)',
          'Парсеры (начальное состояние → чтение токенов → конец)',
          'TCP-соединения',
          'Заказы (новый → оплачен → доставлен → завершён)',
        ],
      },
    ],
  },
  {
    slug: 'strategy',
    name: 'Strategy',
    category: 'behavioral',
    intent: 'Определяет семейство алгоритмов, инкапсулирует каждый из них и делает их взаимозаменяемыми.',
    related: ['state', 'template-method', 'command'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Способы добраться из точки А в точку Б: пешком, на машине, на автобусе, на такси. Каждый способ — алгоритм (стратегия) с разными временем, стоимостью и комфортом. Контекст (ваша поездка) выбирает стратегию.',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Класс имеет несколько вариантов поведения. Выбор через if/else. Изменение алгоритма требует правки класса. Тестировать сложно.',
        points: [
          'Множество похожих вариантов поведения',
          'Нужно переключаться в runtime',
          'Логика выбора размазана по коду',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'Выделить каждый алгоритм в отдельный класс с общим интерфейсом. Контекст хранит ссылку на стратегию и делегирует ей работу.',
        points: [
          'Strategy — интерфейс алгоритма',
          'ConcreteStrategy — реализация',
          'Context — хранит стратегию',
          'Клиент выбирает и передаёт стратегию',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `interface SortStrategy {
  sort(data: number[]): number[];
}

class BubbleSort implements SortStrategy {
  sort(data: number[]): number[] {
    const arr = [...data];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }
}

class QuickSort implements SortStrategy {
  sort(data: number[]): number[] {
    if (data.length <= 1) return data;
    const [pivot, ...rest] = data;
    const left = rest.filter(x => x < pivot);
    const right = rest.filter(x => x >= pivot);
    return [...this.sort(left), pivot, ...this.sort(right)];
  }
}

class Sorter {
  constructor(private strategy: SortStrategy) {}
  setStrategy(s: SortStrategy) { this.strategy = s; }
  sort(data: number[]) { return this.strategy.sort(data); }
}

const data = [5, 2, 8, 1, 9];
const sorter = new Sorter(new QuickSort());
console.log(sorter.sort(data));
sorter.setStrategy(new BubbleSort());
console.log(sorter.sort(data));`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Горячая замена алгоритмов в runtime',
          'Изоляция кода алгоритма',
          'Open/Closed: новые стратегии без правки контекста',
        ],
        cons: [
          'Усложнение кода (дополнительные классы)',
          'Клиент должен знать о различиях стратегий',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        points: [
          'Сортировки (выбор по объёму данных)',
          'Валидация (разные правила)',
          'Ценообразование (скидки, налоги)',
          'Маршрутизация (разные алгоритмы пути)',
        ],
      },
    ],
  },
  {
    slug: 'template-method',
    name: 'Template Method',
    category: 'behavioral',
    intent: 'Определяет скелет алгоритма в методе, перекладывая реализацию шагов на подклассы. Позволяет подклассам переопределять шаги, не меняя структуру алгоритма.',
    related: ['strategy', 'factory-method'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Рецепт блюда. Шаги одни и те же: «подготовь ингредиенты → смешай → готовь → подавай». Но конкретные действия (что смешивать, как готовить) разные для разных блюд. Сам рецепт — Template Method.',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Несколько классов делают похожие вещи с небольшими отличиями. Дублирование кода или жёсткое наследование.',
        points: [
          'Один и тот же алгоритм, разные детали',
          'Хотим переиспользовать структуру, меняя детали',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'В базовом классе определить метод templateMethod(), который вызывает шаги. Шаги — абстрактные или с дефолтной реализацией. Подклассы переопределяют шаги.',
        points: [
          'AbstractClass — templateMethod() и шаги',
          'ConcreteClass — реализация шагов',
          'Структура алгоритма неизменна',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `abstract class DataMiner {
  // Шаблонный метод — финальная структура
  mine(path: string): void {
    const file = this.openFile(path);
    const raw = this.extractData(file);
    const parsed = this.parseData(raw);
    const analyzed = this.analyze(parsed);
    this.sendReport(analyzed);
  }

  protected openFile(path: string): string {
    return \`Открыт файл: \${path}\`;
  }

  protected abstract extractData(file: string): string;
  protected abstract parseData(raw: string): number[];
  protected analyze(data: number[]): number {
    return data.reduce((s, x) => s + x, 0);
  }
  protected sendReport(result: number): void {
    console.log(\`Отчёт: \${result}\`);
  }
}

class CsvMiner extends DataMiner {
  protected extractData(file: string) { return file + ' (CSV-данные)'; }
  protected parseData(raw: string) { return [1, 2, 3, 4, 5]; }
}

class PdfMiner extends DataMiner {
  protected extractData(file: string) { return file + ' (PDF-текст)'; }
  protected parseData(raw: string) { return [10, 20, 30]; }
}

new CsvMiner().mine('data.csv');   // Отчёт: 15
new PdfMiner().mine('doc.pdf');    // Отчёт: 60`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Переиспользование кода (общая структура)',
          'Подклассы контролируют только детали',
          'Инкапсуляция неизменяемых частей',
        ],
        cons: [
          'Жёсткая структура (сложно менять порядок шагов)',
          'Наследование (вместо композиции)',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        points: [
          'Фреймворки (жизненный цикл: init → render → destroy)',
          'Юнит-тесты (setUp → test → tearDown)',
          'Парсеры разных форматов',
          'Шаблоны документов (HTML, PDF, Markdown)',
        ],
      },
    ],
  },
  {
    slug: 'visitor',
    name: 'Visitor',
    category: 'behavioral',
    intent: 'Добавляет новые операции к объектам, не изменяя их классы. Операция выносится в отдельный класс Visitor.',
    related: ['iterator', 'composite', 'strategy'],
    slides: [
      {
        kind: 'analogy',
        title: 'Аналогия',
        analogy: 'Страховой агент приходит к вам домой и оценивает имущество. Ему не нужно знать, как устроен ваш дом — только навестить каждую комнату. Если агент знает правила оценки — он может осмотреть любой дом.',
      },
      {
        kind: 'problem',
        title: 'Проблема',
        body: 'Есть структура объектов (AST, DOM, граф). Нужно выполнять разные операции (сериализация, расчёт метрик, экспорт). Добавлять методы в каждый класс — много изменений.',
        points: [
          'Много похожих объектов',
          'Часто добавляются новые операции (реже — новые типы)',
          'Не хочется править классы объектов',
        ],
      },
      {
        kind: 'solution',
        title: 'Решение',
        body: 'Вынести операции в Visitor. Каждый элемент имеет метод accept(visitor), который вызывает visitor.visit(this).',
        points: [
          'Visitor — visitConcreteElementA/B/C...',
          'Element — accept(visitor)',
          'ConcreteElement — реализует accept',
          'Client — обходит структуру с Visitor',
        ],
      },
      {
        kind: 'code',
        title: 'Реализация',
        code: {
          lang: 'ts',
          source: `interface Visitor {
  visitCircle(c: Circle): void;
  visitSquare(s: Square): void;
}

interface Shape {
  accept(v: Visitor): void;
}

class Circle implements Shape {
  constructor(public r: number) {}
  accept(v: Visitor) { v.visitCircle(this); }
}

class Square implements Shape {
  constructor(public side: number) {}
  accept(v: Visitor) { v.visitSquare(this); }
}

// Операция 1 — расчёт площади
class AreaVisitor implements Visitor {
  total = 0;
  visitCircle(c: Circle) { this.total += Math.PI * c.r ** 2; }
  visitSquare(s: Square) { this.total += s.side ** 2; }
}

// Операция 2 — экспорт в JSON
class JsonVisitor implements Visitor {
  parts: string[] = [];
  visitCircle(c: Circle) { this.parts.push(\`{"circle":\${c.r}}\`); }
  visitSquare(s: Square) { this.parts.push(\`{"square":\${s.side}}\`); }
}

const shapes: Shape[] = [new Circle(5), new Square(4)];
const area = new AreaVisitor();
shapes.forEach(s => s.accept(area));
console.log('Area:', area.total.toFixed(2));`,
        },
      },
      {
        kind: 'proscons',
        title: 'Плюсы и минусы',
        pros: [
          'Open/Closed: новые операции без изменения классов',
          'Single Responsibility: логика операций в Visitor',
          'Сбор данных из разнородных объектов',
        ],
        cons: [
          'Сложно добавить новый тип Element (править все Visitor)',
          'Нарушение инкапсуляции (Visitor видит всё)',
        ],
      },
      {
        kind: 'usage',
        title: 'Когда использовать',
        points: [
          'AST компилятора (вывод кода, оптимизации)',
          'Обход сложных структур (DOM, JSON)',
          'Сериализация в разные форматы',
        ],
      },
    ],
  },
];

export const PATTERNS_BY_SLUG: Record<string, Pattern> = PATTERNS.reduce(
  (acc, p) => ({ ...acc, [p.slug]: p }),
  {},
);

export function getRelatedPatterns(pattern: Pattern): Pattern[] {
  if (!pattern.related) return [];
  return pattern.related
    .map(slug => PATTERNS_BY_SLUG[slug])
    .filter(Boolean);
}