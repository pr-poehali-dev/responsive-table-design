import { useState } from "react";
import Icon from "@/components/ui/icon";

const DOCUMENTS = [
  { id: "zagran", name: "Заграничный паспорт", pages: 1, pricePerPage: 1000 },
  { id: "birth", name: "Свидетельство о рождении", pages: 1, pricePerPage: 800 },
  { id: "diploma", name: "Диплом об образовании", pages: 2, pricePerPage: 900 },
  { id: "driver", name: "Водительское удостоверение", pages: 1, pricePerPage: 700 },
  { id: "address", name: "Адресный лист убытия", pages: 1, pricePerPage: 600 },
  { id: "criminal", name: "Справка о несудимости", pages: 1, pricePerPage: 850 },
];

const LANGUAGES = [
  "английского", "немецкого", "французского", "испанского",
  "итальянского", "армянского", "белорусского", "болгарского",
  "польского", "чешского",
];

interface CartItem {
  docId: string;
  docName: string;
  language: string;
  direction: "to_ru" | "from_ru";
  notarial: boolean;
  extraCopies: number;
  pages: number;
  pricePerPage: number;
}

const calcPrice = (item: CartItem, urgent: boolean) => {
  const base = item.pricePerPage * item.pages;
  const notarialFee = item.notarial ? 1500 : 0;
  const copies = item.extraCopies * 500;
  const urgentMult = urgent ? 1.5 : 1;
  return Math.round((base + copies) * urgentMult + notarialFee);
};

const CalculatorPage = () => {
  const [selectedDoc, setSelectedDoc] = useState(DOCUMENTS[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [direction, setDirection] = useState<"to_ru" | "from_ru">("to_ru");
  const [notarial, setNotarial] = useState(false);
  const [extraCopies, setExtraCopies] = useState(0);
  const [urgent, setUrgent] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [added, setAdded] = useState(false);

  const currentPrice = calcPrice(
    { docId: selectedDoc.id, docName: selectedDoc.name, language, direction, notarial, extraCopies, pages: selectedDoc.pages, pricePerPage: selectedDoc.pricePerPage },
    urgent
  );

  const totalPrice = cart.reduce((sum, item) => sum + calcPrice(item, urgent), 0);

  const handleAdd = () => {
    const item: CartItem = {
      docId: selectedDoc.id,
      docName: selectedDoc.name,
      language,
      direction,
      notarial,
      extraCopies,
      pages: selectedDoc.pages,
      pricePerPage: selectedDoc.pricePerPage,
    };
    setCart((prev) => [...prev, item]);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleRemove = (idx: number) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Инструмент</p>
        <h2 className="text-3xl font-bold text-gray-900">Расчёт стоимости</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1 */}
          <div className="border border-gray-100 rounded-lg p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-5">
              1 — Документ и язык
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Документ</label>
                <select
                  value={selectedDoc.id}
                  onChange={(e) => {
                    const doc = DOCUMENTS.find((d) => d.id === e.target.value)!;
                    setSelectedDoc(doc);
                  }}
                  className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-400 transition-colors"
                >
                  {DOCUMENTS.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={direction === "to_ru"}
                    onChange={() => setDirection("to_ru")}
                    className="accent-gray-900"
                  />
                  <span className="text-sm text-gray-700">на русский</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={direction === "from_ru"}
                    onChange={() => setDirection("from_ru")}
                    className="accent-gray-900"
                  />
                  <span className="text-sm text-gray-700">с русского</span>
                </label>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Язык перевода</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-400 transition-colors"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>с {l}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="border border-gray-100 rounded-lg p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-5">
              2 — Нотариальное удостоверение
            </p>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={notarial}
                  onChange={() => setNotarial(true)}
                  className="accent-gray-900"
                />
                <span className="text-sm text-gray-700">Да (+1 500 ₽)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!notarial}
                  onChange={() => setNotarial(false)}
                  className="accent-gray-900"
                />
                <span className="text-sm text-gray-700">Нет</span>
              </label>
            </div>
          </div>

          {/* Step 3 */}
          <div className="border border-gray-100 rounded-lg p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-5">
              3 — Дополнительные экземпляры
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setExtraCopies(Math.max(0, extraCopies - 1))}
                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-600 hover:border-gray-400 transition-colors"
              >
                <Icon name="Minus" size={14} />
              </button>
              <span className="font-mono-num text-lg font-medium text-gray-900 w-6 text-center">{extraCopies}</span>
              <button
                onClick={() => setExtraCopies(extraCopies + 1)}
                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-600 hover:border-gray-400 transition-colors"
              >
                <Icon name="Plus" size={14} />
              </button>
              <span className="text-sm text-gray-400">шт. × 500 ₽</span>
            </div>
          </div>

          {/* Step 4: Срочность */}
          <div className="border border-gray-100 rounded-lg p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-5">
              4 — Срочность
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setUrgent(false)}
                className={`p-4 border rounded text-left transition-all ${
                  !urgent ? "border-gray-900 bg-gray-50" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <p className="text-sm font-medium text-gray-900">1 день</p>
                <p className="text-xs text-gray-400 mt-0.5">Стандартный тариф</p>
              </button>
              <button
                onClick={() => setUrgent(true)}
                className={`p-4 border rounded text-left transition-all ${
                  urgent ? "border-gray-900 bg-gray-50" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <p className="text-sm font-medium text-gray-900">2 часа</p>
                <p className="text-xs text-gray-400 mt-0.5">×1.5 к стоимости</p>
              </button>
            </div>
          </div>

          {/* Price block */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-6">
            <div>
              <p className="text-xs text-gray-400 mb-1">Стоимость документа</p>
              <p className="font-mono-num text-3xl font-medium text-gray-900">
                {currentPrice.toLocaleString("ru-RU")} ₽
              </p>
            </div>
            <button
              onClick={handleAdd}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded transition-all ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              <Icon name={added ? "Check" : "Plus"} size={15} />
              {added ? "Добавлено" : "В заявку"}
            </button>
          </div>
        </div>

        {/* Right: cart */}
        <div className="lg:col-span-1">
          <div className="border border-gray-100 rounded-lg p-5 sticky top-24">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-5">Заявка</p>

            {cart.length === 0 ? (
              <div className="text-center py-10">
                <Icon name="ShoppingCart" size={28} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Добавьте документы</p>
              </div>
            ) : (
              <div className="space-y-3 mb-5">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3 py-3 border-b border-gray-50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.docName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.direction === "to_ru" ? "на рус." : "с рус."} / с {item.language}
                        {item.notarial ? " / нотар." : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono-num text-sm font-medium text-gray-900">
                        {calcPrice(item, urgent).toLocaleString("ru-RU")} ₽
                      </span>
                      <button
                        onClick={() => handleRemove(idx)}
                        className="text-gray-300 hover:text-gray-600 transition-colors"
                      >
                        <Icon name="X" size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm text-gray-600">Итого</span>
                  <span className="font-mono-num text-xl font-bold text-gray-900">
                    {totalPrice.toLocaleString("ru-RU")} ₽
                  </span>
                </div>
                <button className="w-full bg-gray-900 text-white py-2.5 text-sm font-medium rounded hover:bg-gray-800 transition-colors">
                  Оформить заявку
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
