import { useState } from "react";
import Icon from "@/components/ui/icon";

interface FormData {
  name: string;
  phone: string;
  email: string;
  comment: string;
  agreed: boolean;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  agreed?: string;
}

interface Order {
  id: number;
  date: string;
  status: "new" | "calculating" | "ready";
  docs: string;
  total: string;
}

const MOCK_ORDERS: Order[] = [
  { id: 193492, date: "23.04", status: "calculating", docs: "Заграничный паспорт", total: "2 500 ₽" },
  { id: 193491, date: "22.04", status: "ready", docs: "Адресный лист убытия", total: "11 100 ₽" },
  { id: 193488, date: "18.04", status: "ready", docs: "Диплом об образовании", total: "4 200 ₽" },
];

const STATUS_LABELS: Record<Order["status"], { label: string; color: string }> = {
  new: { label: "Новая", color: "text-blue-600 bg-blue-50" },
  calculating: { label: "Рассчитывается", color: "text-amber-600 bg-amber-50" },
  ready: { label: "Рассчитана", color: "text-green-700 bg-green-50" },
};

const validatePhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 10 && cleaned.length <= 12;
};

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const OrdersPage = () => {
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    comment: "",
    agreed: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const validate = (data: FormData): FormErrors => {
    const errs: FormErrors = {};
    if (!data.name.trim() || data.name.trim().length < 2) {
      errs.name = "Введите имя (минимум 2 символа)";
    }
    if (!data.phone.trim()) {
      errs.phone = "Введите номер телефона";
    } else if (!validatePhone(data.phone)) {
      errs.phone = "Некорректный номер телефона";
    }
    if (!data.email.trim()) {
      errs.email = "Введите email";
    } else if (!validateEmail(data.email)) {
      errs.email = "Некорректный email адрес";
    }
    if (!data.agreed) {
      errs.agreed = "Необходимо согласие на обработку данных";
    }
    return errs;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => new Set(prev).add(field));
    setErrors(validate(form));
  };

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched.has(field)) {
      setErrors(validate(updated));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = new Set(["name", "phone", "email", "agreed"]);
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
    }
  };

  const FieldError = ({ field }: { field: keyof FormErrors }) =>
    touched.has(field) && errors[field] ? (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <Icon name="AlertCircle" size={11} />
        {errors[field]}
      </p>
    ) : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Кабинет</p>
        <h2 className="text-3xl font-bold text-gray-900">Заявки</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="border border-gray-100 rounded-lg p-6">
            <p className="text-sm font-medium text-gray-900 mb-6">Новая заявка</p>

            {submitted ? (
              <div className="text-center py-14">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <Icon name="CheckCircle" size={24} className="text-green-600" />
                </div>
                <p className="text-gray-900 font-medium mb-1">Заявка отправлена</p>
                <p className="text-sm text-gray-400">Мы свяжемся с вами в течение часа</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", comment: "", agreed: false }); setTouched(new Set()); }}
                  className="mt-6 text-sm text-gray-500 underline underline-offset-2 hover:text-gray-900 transition-colors"
                >
                  Отправить ещё одну
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Имя <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Иван Петров"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    className={`w-full border rounded px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none transition-colors placeholder:text-gray-300 ${
                      touched.has("name") && errors.name
                        ? "border-red-300 focus:border-red-400"
                        : "border-gray-200 focus:border-gray-400"
                    }`}
                  />
                  <FieldError field="name" />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Телефон <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    className={`w-full border rounded px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none transition-colors placeholder:text-gray-300 ${
                      touched.has("phone") && errors.phone
                        ? "border-red-300 focus:border-red-400"
                        : "border-gray-200 focus:border-gray-400"
                    }`}
                  />
                  <FieldError field="phone" />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="ivan@example.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={`w-full border rounded px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none transition-colors placeholder:text-gray-300 ${
                      touched.has("email") && errors.email
                        ? "border-red-300 focus:border-red-400"
                        : "border-gray-200 focus:border-gray-400"
                    }`}
                  />
                  <FieldError field="email" />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Комментарий</label>
                  <textarea
                    rows={3}
                    placeholder="Дополнительные пожелания..."
                    value={form.comment}
                    onChange={(e) => handleChange("comment", e.target.value)}
                    className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-400 transition-colors placeholder:text-gray-300 resize-none"
                  />
                </div>

                {/* Agreement */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.agreed}
                      onChange={(e) => { handleChange("agreed", e.target.checked); handleBlur("agreed"); }}
                      className="mt-0.5 accent-gray-900"
                    />
                    <span className="text-sm text-gray-500 leading-relaxed">
                      Я соглашаюсь на обработку персональных данных
                    </span>
                  </label>
                  <FieldError field="agreed" />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-3 text-sm font-medium rounded hover:bg-gray-800 transition-colors"
                >
                  Отправить заявку
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Orders list */}
        <div className="lg:col-span-1">
          <div className="border border-gray-100 rounded-lg p-5">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-5">История</p>
            <div className="space-y-3">
              {MOCK_ORDERS.map((order) => {
                const s = STATUS_LABELS[order.status];
                return (
                  <div key={order.id} className="py-3 border-b border-gray-50 last:border-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono-num text-sm font-medium text-gray-900">#{order.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${s.color}`}>
                        {s.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{order.docs}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-400">{order.date} апр.</span>
                      <span className="font-mono-num text-sm font-medium text-gray-900">{order.total}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
