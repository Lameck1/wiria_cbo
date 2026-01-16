export type HRTab = 'CAREERS' | 'OPPORTUNITIES' | 'APPLICATIONS';

interface HRTabsProps {
  activeTab: HRTab;
  setActiveTab: (tab: HRTab) => void;
}

export function HRTabs({ activeTab, setActiveTab }: HRTabsProps) {
  return (
    <div className="flex gap-1 rounded-xl border border-gray-100 bg-white p-1 shadow-sm">
      {(['CAREERS', 'OPPORTUNITIES', 'APPLICATIONS'] as HRTab[]).map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${activeTab === tab
              ? 'bg-wiria-blue-dark text-white shadow-md'
              : 'text-gray-500 hover:bg-gray-50 hover:text-wiria-blue-dark'
            }`}
        >
          {tab.charAt(0) + tab.slice(1).toLowerCase()}
        </button>
      ))}
    </div>
  );
}
