import { useState } from "react";
import HomePage from "@/components/HomePage";
import CalculatorPage from "@/components/CalculatorPage";
import OrdersPage from "@/components/OrdersPage";
import Icon from "@/components/ui/icon";

type Tab = "home" | "calculator" | "orders";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono-num text-sm font-medium tracking-widest text-gray-400 uppercase">TransDoc</span>
          </div>
          <nav className="flex items-center gap-1">
            {([
              { id: "home", label: "Главная", icon: "Home" },
              { id: "calculator", label: "Калькулятор", icon: "Calculator" },
              { id: "orders", label: "Заявки", icon: "FileText" },
            ] as { id: Tab; label: string; icon: string }[]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded transition-all duration-150 ${
                  activeTab === tab.id
                    ? "bg-gray-900 text-white font-medium"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon name={tab.icon} size={15} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <div key={activeTab} className="animate-slide-up">
          {activeTab === "home" && <HomePage onNavigate={setActiveTab} />}
          {activeTab === "calculator" && <CalculatorPage />}
          {activeTab === "orders" && <OrdersPage />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-xs text-gray-400">
          <span>© 2026 TransDoc</span>
          <span>Перевод документов</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
