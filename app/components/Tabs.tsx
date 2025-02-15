'use client'

interface Tab {
  id: string
  name: string
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="sticky top-0 z-50 bg-background-light dark:bg-background-dark border-t border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-center overflow-x-auto no-scrollbar py-6">
          {tabs.map((tab, index) => (
            <div key={tab.id} className="flex items-center">
              <button
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center px-8 py-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <span className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                  activeTab === tab.id
                    ? 'bg-blue-400 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {index + 1}
                </span>
                <span className="text-sm font-medium whitespace-nowrap">
                  {tab.name}
                </span>
              </button>
              {index < tabs.length - 1 && (
                <div className="h-[2px] w-16 bg-gray-300 dark:bg-gray-700"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 