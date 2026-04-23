import { useState } from "react";
import Icon from "@/components/ui/icon";

/* ─── типы ─── */
interface Language {
  name: string;
  visas: number;
  stamps: number;
}

interface CartItem {
  id: number;
  doc: string;
  price1day: number;
  price2h: number;
}

interface CalculatedOrder {
  date: string;
  num: number;
  status: "calculating" | "done";
}

/* ─── mock данные ─── */
const DOCUMENTS = [
  "Заграничный паспорт",
  "Свидетельство о рождении",
  "Диплом об образовании",
  "Водительское удостоверение",
  "Адресный лист убытия",
  "Справка о несудимости",
];

const CALC_ORDERS: CalculatedOrder[] = [
  { date: "05.03", num: 193492, status: "calculating" },
  { date: "05.03", num: 193491, status: "done" },
];

/* ─── строки таблицы результата ─── */
interface ResultRow {
  service: string;
  lang: string;
  qty: number;
  pages: number | string;
  price6h: number | string;
  price2h: number | string;
  highlight?: boolean;
}

const MOCK_ROWS: ResultRow[] = [
  { service: "копия паспорта",         lang: "",               qty: 5,   pages: "",     price6h: 1500,  price2h: 1500 },
  { service: "перевод загранич...",    lang: "с армянского",   qty: 1,   pages: 1,      price6h: 1000,  price2h: 1500 },
  { service: "перевод виз",            lang: "с армянского",   qty: 1,   pages: 0.5,    price6h: 500,   price2h: 750  },
  { service: "перевод штампов",        lang: "с белорусского", qty: 3,   pages: 0.15,   price6h: 150,   price2h: 225, highlight: true },
  { service: "перевод виз",            lang: "с болгарского",  qty: 3,   pages: 1.5,    price6h: 1800,  price2h: 2700 },
  { service: "нот. удостоверение",     lang: "с армянского",   qty: 5,   pages: "",     price6h: 5500,  price2h: 5500 },
  { service: "нот. удостоверение",     lang: "с болгарского",  qty: 5,   pages: "",     price6h: 5500,  price2h: 5500, highlight: true },
  { service: "доп. экземпляр",         lang: "",               qty: 4,   pages: "",     price6h: 2000,  price2h: 2000 },
];

const fmt = (n: number | string) =>
  typeof n === "number" ? n.toLocaleString("ru-RU") : n;

/* ══════════════════════════════════════════════════════ */
const DocumentConstructor = () => {
  const [doc, setDoc] = useState(DOCUMENTS[0]);
  const [toRu, setToRu] = useState(true);
  const [langFrom, setLangFrom] = useState("армянского");
  const [notarial, setNotarial] = useState(true);
  const [extraCopy, setExtraCopy] = useState(true);
  const [notarialCopy, setNotarialCopy] = useState(false);
  const [extraCount, setExtraCount] = useState(4);
  const [translateAll, setTranslateAll] = useState(true);
  const [languages, setLanguages] = useState<Language[]>([
    { name: "армянский", visas: 1, stamps: 0 },
    { name: "белорусский", visas: 0, stamps: 3 },
    { name: "болгарский", visas: 3, stamps: 0 },
  ]);
  const [cart, setCart] = useState<CartItem[]>([
    { id: 1, doc: "Заграничный ...", price1day: 2500, price2h: 3200 },
    { id: 2, doc: "Адресный лис...", price1day: 11100, price2h: 12500 },
  ]);
  const [comment, setComment] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");


  const total1day = cart.reduce((s, i) => s + i.price1day, 0);
  const total2h = cart.reduce((s, i) => s + i.price2h, 0);

  const addLanguage = () =>
    setLanguages((prev) => [...prev, { name: "английский", visas: 0, stamps: 0 }]);

  const removeLanguage = (idx: number) =>
    setLanguages((prev) => prev.filter((_, i) => i !== idx));

  const updateLang = (idx: number, field: keyof Language, value: string | number) =>
    setLanguages((prev) =>
      prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l))
    );

  const removeCartItem = (id: number) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  /* ── Панель «Заявка» (правая колонка) ── */
  const OrderPanel = () => (
    <div className="bg-white border border-gray-200 rounded">
      {/* Заявка — таблица */}
      <div className="p-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 text-sm mb-2">Заявка</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-1 text-gray-500 font-medium w-6">№</th>
              <th className="text-left py-1 text-gray-500 font-medium">Документ</th>
              <th className="text-right py-1 text-gray-500 font-medium">1 день</th>
              <th className="text-right py-1 text-gray-500 font-medium">2 часа</th>
              <th className="w-4"></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, idx) => (
              <tr key={item.id} className="border-b border-gray-50">
                <td className="py-1.5 text-gray-500">{idx + 1}</td>
                <td className="py-1.5 text-gray-800 max-w-[90px] truncate">{item.doc}</td>
                <td className="py-1.5 text-right text-gray-800">{fmt(item.price1day)}</td>
                <td className="py-1.5 text-right text-gray-800">{fmt(item.price2h)}</td>
                <td className="py-1.5 pl-1">
                  <button onClick={() => removeCartItem(item.id)} className="text-gray-300 hover:text-gray-600">
                    <Icon name="X" size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="pt-2 text-xs font-semibold text-gray-700">Итого</td>
              <td className="pt-2 text-right text-xs font-semibold text-gray-800">{fmt(total1day)}</td>
              <td className="pt-2 text-right text-xs font-semibold text-gray-800">{fmt(total2h)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Прикрепить файлы */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 border border-gray-300 text-xs font-medium text-gray-700 rounded hover:bg-gray-50 transition-colors">
            ПРИКРЕПИТЬ
          </button>
          <span className="text-xs text-gray-400">Прикрепите файлы</span>
        </div>
      </div>

      {/* Поля */}
      <div className="p-3 space-y-2">
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">Комментарий</p>
          <textarea
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-gray-400 resize-none"
          />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">Телефон</p>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-gray-400"
          />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">Эл. почта</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-gray-400"
          />
        </div>
        <button className="w-full mt-1 py-2 border border-gray-300 text-xs font-medium text-gray-600 rounded hover:bg-gray-50 transition-colors">
          ОТПРАВИТЬ
        </button>
      </div>

      {/* Рассчитанные заявки */}
      <div className="p-3 border-t border-gray-200">
        <h3 className="font-semibold text-gray-800 text-sm mb-2">Рассчитанные заявки</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-1 text-gray-500 font-medium">Дата</th>
              <th className="text-left py-1 text-gray-500 font-medium">№</th>
              <th className="text-left py-1 text-gray-500 font-medium">Статус</th>
            </tr>
          </thead>
          <tbody>
            {CALC_ORDERS.map((o) => (
              <tr key={o.num} className="border-b border-gray-50">
                <td className="py-1.5 text-gray-500">{o.date}</td>
                <td className="py-1.5 text-gray-800">{o.num}</td>
                <td className="py-1.5">
                  <span className={`px-1.5 py-0.5 rounded text-xs ${
                    o.status === "calculating"
                      ? "bg-red-100 text-red-600"
                      : "text-gray-500"
                  }`}>
                    {o.status === "calculating" ? "Рассчитывается" : "Рассчитан (см.)"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ── Форма настройки (левая колонка) ── */
  const ConfigForm = () => (
    <div className="space-y-5">
      {/* 1. Документ и язык */}
      <section>
        <h2 className="text-sm font-semibold text-blue-700 mb-2">1. Выберите документ и язык</h2>
        <select
          value={doc}
          onChange={(e) => setDoc(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-800 mb-2 focus:outline-none focus:border-gray-500"
        >
          {DOCUMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" checked={toRu} onChange={() => setToRu(true)} className="accent-blue-600" />
            <span className="text-gray-700">на русский</span>
            <span className="text-gray-500 ml-1">с</span>
            <select
              value={langFrom}
              onChange={(e) => setLangFrom(e.target.value)}
              className="border border-gray-300 rounded px-1.5 py-0.5 text-xs text-gray-800 focus:outline-none"
            >
              {["армянского","белорусского","болгарского","английского","немецкого","французского"].map(l => <option key={l}>{l}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" checked={!toRu} onChange={() => setToRu(false)} className="accent-blue-600" />
            <span className="text-gray-700">с русского</span>
          </label>
        </div>
      </section>

      {/* 2. Нотариальное */}
      <section>
        <h2 className="text-sm font-semibold text-blue-700 mb-2">2. Нотариальное удостоверение</h2>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" checked={notarial} onChange={() => setNotarial(true)} className="accent-blue-600" />
            <span className="text-gray-700">да</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" checked={!notarial} onChange={() => setNotarial(false)} className="accent-blue-600" />
            <span className="text-gray-700">нет</span>
          </label>
        </div>
      </section>

      {/* 3. Доп. услуги */}
      <section>
        <h2 className="text-sm font-semibold text-blue-700 mb-2">3. Дополнительные услуги</h2>
        <div className="space-y-1.5 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={extraCopy} onChange={(e) => setExtraCopy(e.target.checked)} className="accent-blue-600" />
            <span className="text-gray-700">дополнительный экземпляр перевода</span>
            <select
              value={extraCount}
              onChange={(e) => setExtraCount(Number(e.target.value))}
              className="border border-gray-300 rounded px-1.5 py-0.5 text-xs w-14 focus:outline-none"
            >
              {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n}>{n}</option>)}
            </select>
            <span className="text-gray-500">шт.</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={notarialCopy} onChange={(e) => setNotarialCopy(e.target.checked)} className="accent-blue-600" />
            <span className="text-gray-700">нотариальная копия с перевода</span>
          </label>
        </div>
      </section>

      {/* 4. Перевести */}
      <section>
        <h2 className="text-sm font-semibold text-blue-700 mb-2">4. Перевести</h2>
        <div className="space-y-1.5 text-sm">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" checked={!translateAll} onChange={() => setTranslateAll(false)} className="accent-blue-600" />
            <span className="text-gray-700">главный разворот с фото</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" checked={translateAll} onChange={() => setTranslateAll(true)} className="accent-blue-600" />
            <span className="text-gray-700">весь паспорт с визами и штампами</span>
          </label>
        </div>
      </section>

      {/* 5. Визы и штампы */}
      <section>
        <h2 className="text-sm font-semibold text-blue-700 mb-2">5. Визы и штампы</h2>
        <div className="overflow-x-auto">
          <table className="text-sm border-collapse">
            <thead>
              <tr className="text-gray-500 text-xs">
                <th className="text-left font-medium pr-3 pb-1 min-w-[120px]">язык</th>
                <th className="text-left font-medium pr-3 pb-1 w-20">визы</th>
                <th className="text-left font-medium pr-3 pb-1 w-20">штампы</th>
                <th className="w-6"></th>
              </tr>
            </thead>
            <tbody>
              {languages.map((lang, idx) => (
                <tr key={idx}>
                  <td className="pr-3 py-1">
                    <select
                      value={lang.name}
                      onChange={(e) => updateLang(idx, "name", e.target.value)}
                      className="border border-gray-300 rounded px-1.5 py-0.5 text-xs w-full focus:outline-none"
                    >
                      {["армянский","белорусский","болгарский","английский","немецкий","французский"].map(l => <option key={l}>{l}</option>)}
                    </select>
                  </td>
                  <td className="pr-3 py-1">
                    <select
                      value={lang.visas}
                      onChange={(e) => updateLang(idx, "visas", Number(e.target.value))}
                      className="border border-gray-300 rounded px-1.5 py-0.5 text-xs w-full focus:outline-none"
                    >
                      {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n}>{n}</option>)}
                    </select>
                  </td>
                  <td className="pr-3 py-1">
                    <select
                      value={lang.stamps}
                      onChange={(e) => updateLang(idx, "stamps", Number(e.target.value))}
                      className="border border-gray-300 rounded px-1.5 py-0.5 text-xs w-full focus:outline-none"
                    >
                      {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n}>{n}</option>)}
                    </select>
                  </td>
                  <td className="py-1">
                    {idx > 0 && (
                      <button onClick={() => removeLanguage(idx)} className="text-gray-400 hover:text-gray-700">
                        <Icon name="X" size={13} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={addLanguage}
          className="mt-2 px-3 py-1.5 border border-gray-300 text-xs text-gray-600 rounded hover:bg-gray-50 transition-colors"
        >
          ДОБАВИТЬ ЯЗЫК
        </button>
      </section>
    </div>
  );

  /* ── Таблица результата ── */
  const ResultTable = () => (
    <div className="mt-4">
      <p className="text-sm font-semibold text-gray-700 mb-2">Документ №3: Заграничный паспорт</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border border-gray-200 rounded">
          <thead>
            <tr className="bg-gray-50 text-gray-500">
              <th className="text-left px-2 py-1.5 font-medium border-b border-gray-200">Услуга</th>
              <th className="text-left px-2 py-1.5 font-medium border-b border-gray-200">Язык</th>
              <th className="text-right px-2 py-1.5 font-medium border-b border-gray-200">Кол.</th>
              <th className="text-right px-2 py-1.5 font-medium border-b border-gray-200">Стр.</th>
              <th className="text-right px-2 py-1.5 font-medium border-b border-gray-200">6 ч.</th>
              <th className="text-right px-2 py-1.5 font-medium border-b border-gray-200">2 ч.</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ROWS.map((row, idx) => (
              <tr key={idx} className={row.highlight ? "bg-yellow-50" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                <td className="px-2 py-1.5 text-gray-700 border-b border-gray-100">{row.service}</td>
                <td className="px-2 py-1.5 text-gray-600 border-b border-gray-100">{row.lang}</td>
                <td className="px-2 py-1.5 text-right text-gray-700 border-b border-gray-100">{row.qty}</td>
                <td className="px-2 py-1.5 text-right text-gray-500 border-b border-gray-100">{row.pages}</td>
                <td className="px-2 py-1.5 text-right text-gray-800 border-b border-gray-100">{fmt(row.price6h)}</td>
                <td className="px-2 py-1.5 text-right font-medium text-gray-800 border-b border-gray-100">{fmt(row.price2h)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan={4} className="px-2 py-1.5 text-right text-xs font-semibold text-gray-700">Итого</td>
              <td className="px-2 py-1.5 text-right text-xs font-semibold text-gray-800">17 950</td>
              <td className="px-2 py-1.5 text-right text-xs font-semibold text-gray-800">19 675</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
        <p className="text-xs text-gray-500">Для подтверждения расчёта добавьте документ в заявку</p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-gray-300 text-xs font-medium text-gray-600 rounded hover:bg-gray-50 transition-colors">
            СБРОСИТЬ
          </button>
          <button className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors">
            ДОБАВИТЬ В ЗАЯВКУ
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col text-gray-900">

      {/* ── Шапка ── */}
      <header className="bg-gray-200 border-b border-gray-300">
        <div className="max-w-[1200px] mx-auto px-4 py-2 flex items-center justify-between">
          <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
            <Icon name="ChevronLeft" size={14} />
            назад
          </button>
          <h1 className="text-base font-bold text-blue-700">Расчёт стоимости</h1>
          <a href="#" className="text-sm text-blue-600 hover:underline">Задать вопрос</a>
        </div>
      </header>

      {/* ── Подзаголовок ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 py-2">
          <p className="text-xs text-gray-500 text-center">
            С помощью данного сервиса Вы можете самостоятельно рассчитать стоимость перевода документа.
          </p>
        </div>
      </div>

      {/* ══════════ ДЕСКТОП ══════════ */}
      <div className="hidden md:block flex-1">
        <div className="max-w-[1200px] mx-auto px-4 py-4">
          <div className="flex gap-4 items-start">

            {/* Левая колонка: форма + таблица */}
            <div className="flex-1 min-w-0 bg-white border border-gray-200 rounded p-4">
              <ConfigForm />
              <ResultTable />
            </div>

            {/* Правая колонка: заявка */}
            <div className="w-[280px] shrink-0">
              <OrderPanel />
            </div>

          </div>
        </div>
      </div>

      {/* ══════════ МОБИЛКА ══════════ */}
      <div className="md:hidden flex-1">
        <div className="p-3 space-y-3">

          {/* 1. Настройки */}
          <div className="bg-white border border-gray-200 rounded p-4">
            <ConfigForm />
          </div>

          {/* 2. Таблица результата — всегда видна */}
          <div className="bg-white border border-gray-200 rounded p-4">
            <ResultTable />
          </div>

          {/* 3. Заявка */}
          <div className="bg-white border border-gray-200 rounded">
            {/* Шапка заявки */}
            <div className="px-4 pt-4 pb-2 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 text-sm">Заявка</h3>
            </div>
            <div className="p-4">
              {/* Таблица документов в заявке */}
              {cart.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-3">Добавьте документы в заявку</p>
              ) : (
                <div className="overflow-x-auto mb-3">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-1 text-gray-500 font-medium w-6">№</th>
                        <th className="text-left py-1 text-gray-500 font-medium">Документ</th>
                        <th className="text-right py-1 text-gray-500 font-medium">1 день</th>
                        <th className="text-right py-1 text-gray-500 font-medium">2 часа</th>
                        <th className="w-5"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item, idx) => (
                        <tr key={item.id} className="border-b border-gray-50">
                          <td className="py-1.5 text-gray-500">{idx + 1}</td>
                          <td className="py-1.5 text-gray-800 max-w-[100px] truncate">{item.doc}</td>
                          <td className="py-1.5 text-right text-gray-800">{fmt(item.price1day)}</td>
                          <td className="py-1.5 text-right text-gray-800">{fmt(item.price2h)}</td>
                          <td className="py-1.5 pl-1">
                            <button onClick={() => removeCartItem(item.id)} className="text-gray-300 hover:text-gray-600">
                              <Icon name="X" size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={2} className="pt-2 text-xs font-semibold text-gray-700">Итого</td>
                        <td className="pt-2 text-right text-xs font-semibold text-gray-800">{fmt(total1day)}</td>
                        <td className="pt-2 text-right text-xs font-semibold text-gray-800">{fmt(total2h)}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {/* Прикрепить файлы */}
              <div className="flex items-center gap-2 py-2 border-t border-gray-100">
                <button className="px-3 py-1.5 border border-gray-300 text-xs font-medium text-gray-700 rounded hover:bg-gray-50 transition-colors">
                  ПРИКРЕПИТЬ
                </button>
                <span className="text-xs text-gray-400">Прикрепите файлы</span>
              </div>

              {/* Поля формы */}
              <div className="space-y-2 mt-2">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Комментарий</p>
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-gray-400 resize-none"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Телефон</p>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Эл. почта</p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-gray-400"
                  />
                </div>
                <button className="w-full py-2 border border-gray-300 text-xs font-medium text-gray-600 rounded hover:bg-gray-50 transition-colors mt-1">
                  ОТПРАВИТЬ
                </button>
              </div>
            </div>
          </div>

          {/* 4. Рассчитанные заявки */}
          <div className="bg-white border border-gray-200 rounded p-4">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">Рассчитанные заявки</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-1 text-gray-500 font-medium pb-2">Дата</th>
                    <th className="text-left py-1 text-gray-500 font-medium pb-2">№</th>
                    <th className="text-left py-1 text-gray-500 font-medium pb-2">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {CALC_ORDERS.map((o) => (
                    <tr key={o.num} className="border-b border-gray-50">
                      <td className="py-2 text-gray-500">{o.date}</td>
                      <td className="py-2 text-gray-800">{o.num}</td>
                      <td className="py-2">
                        <span className={`px-1.5 py-0.5 rounded text-xs ${
                          o.status === "calculating"
                            ? "bg-red-100 text-red-600"
                            : "text-gray-500"
                        }`}>
                          {o.status === "calculating" ? "Рассчитывается" : "Рассчитан (см.)"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* ── Нижнее меню ── */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex overflow-x-auto">
            {["Сохранённые расчеты", "Рассчитанные заявки", "Мои заказы", "Авторизация"].map((item, idx) => (
              <button
                key={item}
                className={`flex-shrink-0 px-4 py-3 text-xs transition-colors ${
                  idx === 2 ? "text-gray-400 cursor-default" : "text-blue-600 hover:bg-gray-50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 py-1.5 flex flex-wrap gap-x-4 gap-y-0.5 justify-center">
            {["Согласие на обработку данных", "Оферта", "Пользовательское соглашение", "Политика конфиденциальности", "Способы оплаты", "Возврат", "Реквизиты"].map(l => (
              <a key={l} href="#" className="text-[10px] text-gray-400 hover:text-gray-600">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DocumentConstructor;