import Icon from "@/components/ui/icon";

type Tab = "home" | "calculator" | "orders";

interface HomePageProps {
  onNavigate: (tab: Tab) => void;
}

const features = [
  {
    icon: "Calculator",
    title: "Калькулятор стоимости",
    desc: "Мгновенный расчёт перевода для любого документа с учётом языка, срочности и нотариального удостоверения.",
  },
  {
    icon: "ShieldCheck",
    title: "Проверка данных",
    desc: "Система проверяет корректность введённых данных и подсказывает ошибки до отправки заявки.",
  },
  {
    icon: "Clock",
    title: "Срочный перевод",
    desc: "Доступны тарифы 2 часа и 1 день. Цена рассчитывается автоматически.",
  },
  {
    icon: "FileStack",
    title: "История заявок",
    desc: "Все поданные заявки сохраняются в личном кабинете с актуальным статусом.",
  },
];

const documents = [
  "Заграничный паспорт",
  "Свидетельство о рождении",
  "Диплом об образовании",
  "Водительское удостоверение",
  "Адресный лист убытия",
  "Справка о несудимости",
];

const HomePage = ({ onNavigate }: HomePageProps) => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="mb-20">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-widest mb-8 border border-gray-200 rounded px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"></span>
          Перевод документов онлайн
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6 max-w-2xl">
          Рассчитайте стоимость перевода
          <br />
          <span className="text-gray-400 font-normal">за 30 секунд</span>
        </h1>
        <p className="text-gray-500 text-lg mb-10 max-w-xl leading-relaxed">
          Выберите документ, язык и срочность — система мгновенно посчитает цену.
          Отправьте заявку прямо с сайта.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("calculator")}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 text-sm font-medium rounded hover:bg-gray-800 transition-colors"
          >
            <Icon name="Calculator" size={16} />
            Рассчитать стоимость
          </button>
          <button
            onClick={() => onNavigate("orders")}
            className="inline-flex items-center gap-2 text-gray-600 border border-gray-200 px-6 py-3 text-sm font-medium rounded hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Icon name="FileText" size={16} />
            Мои заявки
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-20" />

      {/* Features */}
      <div className="mb-20">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-10">Возможности</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-100 border border-gray-100 rounded-lg overflow-hidden">
          {features.map((f) => (
            <div key={f.title} className="bg-white p-8">
              <div className="w-9 h-9 rounded bg-gray-50 flex items-center justify-center mb-5">
                <Icon name={f.icon} size={18} className="text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Documents list */}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-6">Переводим документы</p>
        <div className="flex flex-wrap gap-2">
          {documents.map((doc) => (
            <span
              key={doc}
              className="text-sm text-gray-600 bg-gray-50 border border-gray-100 px-4 py-2 rounded"
            >
              {doc}
            </span>
          ))}
          <span className="text-sm text-gray-400 bg-white border border-dashed border-gray-200 px-4 py-2 rounded">
            и другие...
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
