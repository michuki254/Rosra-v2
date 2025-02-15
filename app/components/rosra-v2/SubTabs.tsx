'use client'

interface SubTab {
  id: string
  name: string
}

interface SubTabsProps {
  tabs: SubTab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function SubTabs({ tabs, activeTab, onTabChange }: SubTabsProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm
              ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
            `}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  )
} 