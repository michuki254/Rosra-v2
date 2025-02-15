import Image from 'next/image'
import ThemeToggle from './components/ThemeToggle'
import FloatingCard from './components/FloatingCard'
import Link from 'next/link'
import Navbar from './components/Navbar'

export default function Home() {
  const valueProps = [
    {
      title: 'Data',
      icon: '/icon-data.png',
      description: 'We bring the best of global data paired with exemplary analysis to provide governments and partners with the most tailored and effective recommendations.'
    },
    {
      title: 'Experience & Expertise',
      icon: '/icon-experience-expertise.png',
      description: 'We have global experience on municipal finance issues in many countries and contexts. Our network of experts bring extensive knowledge.'
    },
    {
      title: 'Funds Mobilization',
      icon: '/icon-funds-mobilization.png',
      description: 'When you are supported by a UN agency, it becomes easier to mobilize funding from other sources.'
    },
    {
      title: 'Political Weight',
      icon: '/icon-political-weight.png',
      description: 'The UN name in partnership with your government will be sure to provide credibility and political stature to act on recommendations.'
    }
  ]

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <Navbar />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-8">
        {/* Hero Section - Full width background with contained content */}
        <div className="relative -mx-8">
          <div className="bg-gradient-to-br from-blue-900 via-black to-black py-24">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat"></div>
            </div>
            
            {/* Hero Content - Contained */}
            <div className="max-w-7xl mx-auto px-8">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                  <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                    Rapid Own Source Revenue Analysis
                  </h1>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    Empower your local government with data-driven revenue optimization. ROSRA helps you analyze, visualize, and improve your revenue systems.
                  </p>
                  <div className="flex gap-4 pt-4">
                    <Link 
                      href="/rosra-v1" 
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      SAMPLE REPORT V1
                    </Link>
                    <a 
                      href="#" 
                      className="px-6 py-3 border border-blue-600 text-blue-400 hover:bg-blue-600/10 rounded-lg font-medium transition-colors"
                    >
                      SAMPLE REPORT V2
                    </a>
                  </div>
                </div>

                {/* Pie Chart Section */}
                <div className="flex-1 relative">
                  <div className="relative w-[500px] h-[500px]">
                    {/* Animated Glow Effect */}
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                    
                    {/* Pie Chart */}
                    <Image 
                      src="/pie-chart.png"
                      alt="OSR Revenue Distribution"
                      fill
                      priority
                      className="object-contain relative z-10"
                    />
                    
                    {/* Labels */}
                    <div className="absolute inset-0 z-20">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 bg-blue-900/80 px-4 py-2 rounded-full">
                        <p className="text-sm text-blue-200">OSR Distribution</p>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-4 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <span className="text-sm text-gray-300">OSR</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                      <span className="text-sm text-gray-300">Intergovernmental Transfers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <span className="text-sm text-gray-300">Other</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="py-12">
          {/* What is ROSRA Section */}
          <section className="mb-24">
            <h2 className="text-3xl md:text-4xl text-center text-primary-light dark:text-primary-dark font-bold mb-12">
              What is the ROSRA?
            </h2>

            {/* Main Description Card */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 mb-12">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xl text-text-light dark:text-text-dark">
                    ROSRA stands for <span className="font-bold">Rapid Own Source Revenue Analysis</span>
                  </p>
                </div>
                
                <div className="space-y-4 text-gray-500 dark:text-gray-400">
                  <p>
                    The ROSRA is a online software developed by UN-Habitat between 2018 and 2022. The objective of the ROSRA is to assist local governments in determining their need for OSR reform and identifying their key OSR shortcomings.
                  </p>
                  <p>
                    By supporting local revenue administrations to clearly communicate and visualize distinct OSR shortcomings and gaps, the ROSRA tool facilitates strategic decision making and senior management buy-in for OSR reform.
                  </p>
                  <p>
                    By helping to understand the importance of various OSR shortcomings, the ROSRA facilitates prioritization of reform interventions and effective resource allocation. In contributing towards an improved OSR system, the ROSRA ultimately strengthens the Municipal Finance foundations of local governments, enhances creditworthiness and enables local governments to gain increased access to external resources to fund their development.
                  </p>
                </div>
              </div>
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-primary-dark/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">Strategic Decision Making</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Facilitates informed decision-making through clear visualization of OSR gaps
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-primary-dark/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">Reform Prioritization</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Helps prioritize interventions and allocate resources effectively
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-primary-dark/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">Enhanced Creditworthiness</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Strengthens municipal finance foundations and improves access to resources
                </p>
              </div>
            </div>
          </section>

          {/* OSR Info Section */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl text-primary-light dark:text-primary-dark font-bold mb-6">What is Own Source Revenue (OSR)?</h2>
            
            <div className="flex flex-col gap-8">
              {/* Description */}
              <div className="flex justify-between text-center">
                <p className="text-text-light dark:text-text-dark max-w-md">
                  OSR is one of several revenues of local governments
                </p>
                <p className="text-text-light dark:text-text-dark max-w-md">
                  OSRs are taxes, fees, licenses, etc. which are directly controlled by local governments
                </p>
              </div>

              <div className="grid grid-cols-2 gap-12">
                {/* Pie Chart */}
                <div className="relative h-[500px] w-[500px] -ml-8">
                  {/* Animated Glow Effect */}
                  <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl"></div>
                  
                  <Image 
                    src="/pie-chart.png"
                    alt="OSR Revenue Distribution"
                    fill
                    className="object-contain relative z-10"
                  />
                </div>

                {/* Common OSRs Table */}
                <div className="bg-surface-light dark:bg-surface-dark rounded">
                  <div className="bg-gray-200 dark:bg-[#1A1A1A] p-4 rounded-t">
                    <h3 className="text-xl font-bold text-center text-text-light dark:text-text-dark">Common OSR's</h3>
                  </div>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="p-4 text-text-light dark:text-text-dark">Property Tax</td>
                        <td className="p-4 text-text-light dark:text-text-dark">Recurrent tax on land or property</td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="p-4 text-text-light dark:text-text-dark">Other Taxes</td>
                        <td className="p-4 text-text-light dark:text-text-dark">Local Sales Tax, Selective Sales Tax (Excise/Sin Tax: Fuel Tax, Hotel Tax, Advertisement Tax, Vehicle Tax, etc.), Local Income Taxes, etc.</td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="p-4 text-text-light dark:text-text-dark">User Fees / Utility Charges</td>
                        <td className="p-4 text-text-light dark:text-text-dark">Public Service Fee, Parking Fee, Road Tolls, Hospital Fees, Market Fees, Public Transportation, Libraries, etc.</td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="p-4 text-text-light dark:text-text-dark">Developer Fees, Tax Increment Financing, Land Transfer Tax, etc.</td>
                        <td className="p-4 text-text-light dark:text-text-dark">Property & Land related charges/fees</td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="p-4 text-text-light dark:text-text-dark">Fines or Penalties</td>
                        <td className="p-4 text-text-light dark:text-text-dark">Parking Fines, Late Payment, etc.</td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="p-4 text-text-light dark:text-text-dark">Regulatory fees/licenses/permits</td>
                        <td className="p-4 text-text-light dark:text-text-dark">Business Permit, Liquor License, Health license, etc.</td>
                      </tr>
                      <tr>
                        <td className="p-4 text-text-light dark:text-text-dark">Revenue from Assets</td>
                        <td className="p-4 text-text-light dark:text-text-dark">Public land/buildings, investments, gov. owned factories, etc.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Why Optimize Section */}
          <section className="mb-24">
            <h2 className="text-3xl md:text-4xl text-center text-primary-light dark:text-primary-dark font-bold mb-12">
              Why optimize OSR?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Increases resources */}
              <div className="group bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-primary-dark/50 transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Increases Resources</h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  It helps close unfunded mandates, maintain existing infrastructure and invest in development.
                </p>
              </div>

              {/* Increases autonomy */}
              <div className="group bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-primary-dark/50 transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Increases Autonomy</h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  When OSR is low, local governments are likely to be dependent on inter-governmental transfers (IGT) to cover the expenditure needs.
                </p>
              </div>

              {/* Strengthens social contract */}
              <div className="group bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-primary-dark/50 transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Strengthens Social Contract</h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  When local governments collect taxes and fees, they become more accountable to their constituency.
                </p>
              </div>

              {/* Improves institutional capacity */}
              <div className="group bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-primary-dark/50 transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Improves Institutional Capacity</h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Optimizing local revenue also often requires improvements in the space of accounting, expenditure, procurement, usage of technology and auditing practices.
                </p>
              </div>

              {/* Enables leveraging */}
              <div className="group bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-primary-dark/50 transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Enables Leveraging</h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  The local revenue system impacts economic growth, income distribution, and can be used to correct other market failures e.g. urban sprawl.
                </p>
              </div>

              {/* Increases creditworthiness */}
              <div className="group bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-primary-dark/50 transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Increases Creditworthiness</h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Creditors assess the overall likelihood of debt repayment in part based on local revenue generation.
                </p>
              </div>
            </div>

            {/* Expandable Details */}
            <div className="mt-12 space-y-6">
             
              
              {/* Add more details sections as needed */}
            </div>
          </section>

          {/* Who is the ROSRA for Section */}
          <section className="mb-24">
            <h2 className="text-3xl md:text-4xl text-center text-primary-light dark:text-primary-dark font-bold mb-6">
              Who is the ROSRA for?
            </h2>
            
            {/* Main Description */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-lg text-text-light dark:text-text-dark mb-4">
                The ROSRA was designed primarily for government officials in local governments in <span className="text-primary-light dark:text-primary-dark font-semibold">low-income</span> and <span className="text-primary-light dark:text-primary-dark font-semibold">fragile state</span> contexts.
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                It can also be used by non-governmental partners as long as these have access to revenue related data of local governments.
              </p>
            </div>

            {/* Feature Cards - 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-primary-dark/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-text-light dark:text-text-dark">
                  Better suited for secondary cities rather than very large urban metropoles
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-primary-dark/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-text-light dark:text-text-dark">
                  Functions best when supported by senior management with technical staff input
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-primary-dark/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-text-light dark:text-text-dark">
                  Particularly helpful where land-based finance systems are present at the local level
                </p>
              </div>
            </div>
          </section>

          {/* How does the ROSRA work Section */}
          <section className="mb-24">
            <h2 className="text-3xl md:text-4xl text-center text-primary-light dark:text-primary-dark font-bold mb-12">
              How does the ROSRA work?
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Process Steps - Now on the left */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-primary-light dark:text-primary-dark mb-4">Analysis Process</h3>
                  <p className="text-text-light dark:text-text-dark mb-6">
                    The ROSRA analyses user data by comparing it with accepted benchmarks and the specific characteristics of well-functioning OSR systems observed in peer local governments.
                  </p>
                  <div className="space-y-4 ml-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-primary-light dark:text-primary-dark">1</div>
                      <p className="text-text-light dark:text-text-dark">The authority and incentives of local government to raise OSR</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-primary-light dark:text-primary-dark">2</div>
                      <p className="text-text-light dark:text-text-dark">The capacity and incentives of the revenue administration</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-primary-light dark:text-primary-dark">3</div>
                      <p className="text-text-light dark:text-text-dark">The strategy, management and collection processes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Facts - Now on the right */}
              <div className="lg:col-span-1">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Completion Time</p>
                      <p className="text-lg text-text-light dark:text-text-dark font-semibold">1 hour</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Analysis Type</p>
                      <p className="text-lg text-text-light dark:text-text-dark font-semibold">Automated</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Requirements Section */}
          <section className="mb-24">
            <h2 className="text-3xl md:text-4xl text-center text-primary-light dark:text-primary-dark font-bold mb-12">
              Data Requirements
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* What data needs subsection */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Required Input Data</h3>
                </div>

                <div className="space-y-4">
                  {/* Data Type Cards */}
                  <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-light dark:text-text-dark">Socio-economic data</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">GDP, population statistics</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-light dark:text-text-dark">Budget data</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Revenue and OSR data from past financial year</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-light dark:text-text-dark">Management data</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Overall OSR environment, management and administration details</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Privacy subsection */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Data Privacy</h3>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-text-light dark:text-text-dark">
                      <span className="font-bold">Only visible to the local government itself</span>
                    </p>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      UN-Habitat will only use the data after gaining explicit formal permission from the local government
                    </p>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      The data input into the ROSRA is <span className="font-bold">completely confidential</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* UN-Habitat Value Props */}
          <section className="mb-16 py-24">
            <h2 className="text-4xl text-center text-primary-light dark:text-primary-dark font-bold mb-16">
              Why Choose UN-Habitat?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {valueProps.map((prop, index) => (
                <FloatingCard key={prop.title}>
                  <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-primary-dark/50 transition-colors">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 border-2 border-primary-light dark:border-primary-dark rounded-full"></div>
                      <div className="absolute inset-[-4px] border-2 border-primary-light dark:border-primary-dark rounded-full border-dashed animate-spin-slow"></div>
                      <Image 
                        src={prop.icon}
                        alt={prop.title}
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                    <h3 className="text-xl text-primary-light dark:text-primary-dark font-bold mb-4 text-center">
                      {prop.title}
                    </h3>
                    <p className="text-text-light dark:text-text-dark text-center">
                      {prop.description}
                    </p>
                  </div>
                </FloatingCard>
              ))}
            </div>
          </section>

          {/* Selected Comments Section */}
          <section className="mb-16">
            <h2 className="text-2xl text-primary-light dark:text-primary-dark font-bold mb-6">Selected Comments about the ROSRA</h2>
            
            <div className="space-y-4">
              {/* Comment 1 */}
              <div className="bg-surface-light dark:bg-surface-dark p-6 rounded">
                <p className="text-primary-light dark:text-primary-dark mb-2">
                  "The ROSRA shows us that we have essentially been doing everything wrong in regard to OSR"
                </p>
                <p className="text-text-light dark:text-text-dark text-sm">
                  Mr George Okong'o - County Executive Committee Member for Finance and Economic Planning
                </p>
              </div>

              {/* Comment 2 */}
              <div className="bg-surface-light dark:bg-surface-dark p-6 rounded">
                <p className="text-primary-light dark:text-primary-dark mb-2">
                  "This is the most accurate analysis of our OSR system that we have received until now and it is spot on"
                </p>
                <p className="text-text-light dark:text-text-dark text-sm">
                  Mr. Eric Orangi - Former Chief Officer Finance Kisumu County
                </p>
              </div>

              {/* Comment 3 */}
              <div className="bg-surface-light dark:bg-surface-dark p-6 rounded">
                <p className="text-primary-light dark:text-primary-dark mb-2">
                  "I am not aware that such a tool exists, and it is quite needed to support local governments in optimizing their OSR"
                </p>
                <p className="text-text-light dark:text-text-dark text-sm">
                  Professor Enid Slack - Professor, University of Toronto
                </p>
              </div>

              {/* Comment 4 */}
              <div className="bg-surface-light dark:bg-surface-dark p-6 rounded">
                <p className="text-primary-light dark:text-primary-dark mb-2">
                  "This tool adopts an interesting and promising methodology to support local governments in the critical area of OSR"
                </p>
                <p className="text-text-light dark:text-text-dark text-sm">
                  Professor William McCluskey - Professor, African Tax Institute
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer - Full width background with contained content */}
      <footer className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <p className="text-center text-sm text-text-light dark:text-text-dark">
            © 2012-2024 United Nations Human Settlements Programme
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="text-primary-light dark:text-primary-dark hover:opacity-80">Contact</a>
            <a href="#" className="text-primary-light dark:text-primary-dark hover:opacity-80">Privacy Notice</a>
          </div>
        </div>
      </footer>
    </main>
  )
} 