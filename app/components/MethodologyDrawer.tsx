'use client'

import Image from 'next/image'

interface MethodologyDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function MethodologyDrawer({ isOpen, onClose }: MethodologyDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-[800px] bg-background-light dark:bg-background-dark border-l border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-8">
          {/* Header with Logo */}
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-primary-light dark:text-primary-dark">
                Methodology Guide
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <Image 
                src="/rosra-un-habitat-logo.png"
                alt="ROSRA UN-HABITAT Logo"
                width={120}
                height={40}
                className="hidden dark:block"
              />
              <Image 
                src="/Light-theme-logo.png"
                alt="ROSRA UN-HABITAT Logo"
                width={120}
                height={40}
                className="block dark:hidden"
              />
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="space-y-8 text-text-light dark:text-text-dark">
            {/* Overview Section */}
            <section className="space-y-4">
              <h3 className="text-2xl font-semibold text-primary-light dark:text-primary-dark">
                Overview
              </h3>
              <p className="leading-relaxed">
                The ROSRA tool is designed to holistically review local government own source revenue (OSR) systems to identify and 
                prioritize barriers to effective OSR administration within all levels of governance. National-level laws have a significant 
                impact on local OSR. If the main barriers to effective local OSR administration lie at the national level, local changes might 
                have little impact.
              </p>
              <p className="leading-relaxed">
                This guide is intended to provide brief explanations of the methodology and reasoning behind ROSRA scoring and 
                problem identification. The guide is broken up into two sections:
              </p>
            </section>

            {/* Performance Analysis Table Section */}
            <section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-2xl font-semibold text-primary-light dark:text-primary-dark">
                Performance Analysis
              </h3>
              <p className="leading-relaxed">
                The <span className="font-semibold">overall performance score</span> is calculated as a weighted average of the below categories. All calculations are based on 
                the numbers input into the &#39;General&#39; and &#39;Performance&#39; tabs on the ROSRA site.
              </p>

              {/* Performance Analysis Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-surface-light dark:bg-surface-dark">
                      <th className="p-3 text-left align-top border-b border-gray-200 dark:border-gray-700">Category</th>
                      <th className="p-3 text-left align-top border-b border-gray-200 dark:border-gray-700">Metric</th>
                      <th className="p-3 text-left align-top border-b border-gray-200 dark:border-gray-700">Weight</th>
                      <th className="p-3 text-left align-top border-b border-gray-200 dark:border-gray-700">Calculation Methodology</th>
                      <th className="p-3 text-left align-top border-b border-gray-200 dark:border-gray-700">Reasoning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Potential Analysis Row */}
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 align-top font-medium">Potential Analysis</td>
                      <td className="p-3 align-top">OSR Potential</td>
                      <td className="p-3 align-top">27%</td>
                      <td className="p-3 align-top">
                        <p>Maximum points are awarded if the total actual OSR collected is greater than 50% of the estimated potential OSR. The estimated potential OSR is calculated by taking the average expected OSR/capita of $50 in a context with a GDP/capita of $1,500 and then scaling the figure based on the local jurisdiction&#39;s GDP/capita.</p>
                        <p className="mt-2 italic">For example: In a context with a local GDP per capita of $500, we would expect a per capita OSR of $16.67 ($500/$1,500*$50).</p>
                        <p className="mt-2">*Note: This calculation assumes a linear relationship between GDP and OSR.</p>
                      </td>
                      <td className="p-3 align-top">The higher percentage of potential OSR that is collected, the more effective the OSR system.</td>
                    </tr>

                    {/* Historic Analysis Row */}
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 align-top font-medium">Historic Analysis</td>
                      <td className="p-3 align-top">Slope of OSR past 5 years</td>
                      <td className="p-3 align-top">9%</td>
                      <td className="p-3 align-top">Points are allocated if the actual total OSR per capita has increased over time.</td>
                      <td className="p-3 align-top">This indicates OSR has improved over time. Additionally, as the cost-of-living increases over time, OSR should also increase so that governments can afford to maintain services.</td>
                    </tr>

                    {/* Transactional OSR Analysis Row */}
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 align-top font-medium">Transactional OSR Analysis</td>
                      <td className="p-3 align-top">Transactional % of OSR</td>
                      <td className="p-3 align-top">9%</td>
                      <td className="p-3 align-top">Points are allocated if the portion of transactional OSR out of total OSR has decreased over time.</td>
                      <td className="p-3 align-top">Transactional OSR, which includes non-recurrent government revenue, such as asset sales, is an unstable revenue stream and creates challenges projecting revenue and budgeting expenditures.</td>
                    </tr>

                    {/* Budget Analysis Row */}
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 align-top font-medium">Budget Analysis</td>
                      <td className="p-3 align-top">Actual as % of Budgeted OSR</td>
                      <td className="p-3 align-top">9%</td>
                      <td className="p-3 align-top">Points are allocated if the gap between budgeted and actual OSR has decreased over time.</td>
                      <td className="p-3 align-top">If the gap between budgeted and actual OSR is increasing, this indicates OSR is inconsistent, which creates challenges for capital planning.</td>
                    </tr>

                    {/* Administrative Cost Analysis Rows */}
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 align-top font-medium" rowSpan={2}>Administrative Cost Analysis</td>
                      <td className="p-3 align-top">Comparison with Global Benchmark</td>
                      <td className="p-3 align-top">5%</td>
                      <td className="p-3 align-top">Points are allocated if the five-year average cost of revenue administration for all OSRs, as a fraction of total actual OSR, is less than 5%.</td>
                      <td className="p-3 align-top">Based on UN-Habitat&#39;s experience working with local tax administrations, administrative costs should be less than 5% of collected OSR.</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 align-top">Trend</td>
                      <td className="p-3 align-top">5%</td>
                      <td className="p-3 align-top">Points are allocated if the efficiency of revenue collection (the cost of revenue administration as a fraction of total actual OSR) has decreased over time.</td>
                      <td className="p-3 align-top">It is important to maximize administrative efficiency. Decreasing efficiency indicates flaws in the collection strategy.</td>
                    </tr>

                    {/* Peer Analysis Row */}
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 align-top font-medium">Peer Analysis</td>
                      <td className="p-3 align-top">OSR per capita compared to peers</td>
                      <td className="p-3 align-top">27%</td>
                      <td className="p-3 align-top">Maximum points are awarded if the most recent year&#39;s OSR/capita is greater than or equal to 75% of the average OSR/capita of peer countries. Peers are countries with a GDP/capita between 50% and 200% of input GDP per capita.</td>
                      <td className="p-3 align-top">Peer analysis provides another indication of potential revenue collection. If revenue per capita is lower than peers with similar GDPs, the local government should be able to increase OSR.</td>
                    </tr>

                    {/* Overall Performance Score Row */}
                    <tr className="border-b border-gray-200 dark:border-gray-700 font-medium">
                      <td className="p-3 align-top" colSpan={2}>Overall Performance Score</td>
                      <td className="p-3 align-top">100%</td>
                      <td className="p-3 align-top" colSpan={2}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Problem Analysis Section */}
            <section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-2xl font-semibold text-primary-light dark:text-primary-dark">
                Problem Analysis
              </h3>
              <p className="leading-relaxed">
                The <span className="font-semibold">most significant challenges</span> are determined based on the number of points awarded in each of the nine sections 
                below. Points are allocated based on responses input in the &#39;Problem&#39; tab of the ROSRA website. A low score on a 
                question indicates a potential challenge to OSR collection. The two lowest scoring sections are called out on the Problem 
                Analysis &#39;Overview&#39; tab as the most significant challenges. These areas are likely to be the largest impediments to 
                increasing OSR.
              </p>

              {/* National OSR Environment Section */}
              <div className="mt-8 space-y-4">
                <h4 className="text-xl font-semibold text-primary-light dark:text-primary-dark">
                  National OSR Environment
                </h4>
                <div className="space-y-4">
                  <h5 className="font-medium">Authority of local government to raise OSR</h5>
                  <p className="text-sm">This section&#39;s score is determined based on the following three factors:</p>
                  
                  <ol className="list-decimal pl-5 space-y-4 text-sm">
                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p className="font-medium">Possible tax authority: This score is based on the number of devolved OSRs. The more OSRs that local governments have control over, the higher the score</p>
                      <p className="mt-1 text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> The more sources of revenue that are devolved, the greater potential for local governments to independently increase OSR.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p className="font-medium">Property tax devolution: If the local government has control over the property tax, points are awarded.</p>
                      <p className="mt-1 text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Property taxes are often the most lucrative source of local government revenue. Without control over the property tax, local governments may have little opportunity to significantly increase OSR.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p className="font-medium">The average score of responses to the below questions in the Authority section:</p>
                      <ul className="pl-5 space-y-4 text-sm list-disc">
                        <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark">
                          <p>Can this local government pass its own OSR-related legislation? (Changing tax rates, tax bases, administrative practices)?</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Scoring:</span> Maximum points are awarded if the local government has the authority to singlehandedly pass OSR legislation.
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Reasoning:</span> Decentralizing OSR legislative power provides flexibility to local governments and allows tax rates, tax enforcement provisions, and other OSR administrative regulations to be adjusted based on local conditions. Extensive time and political will may be required to adjust these OSR regulations on the national level, and local OSR administration may significantly suffer as a result.
                          </p>
                        </li>

                        <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark">
                          <p>Can local governments take legal sanction in the event of non-compliance?</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Scoring:</span> Maximum points are awarded if the local government can take sufficient enforcement measures itself.
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Reasoning:</span> Without meaningful power to enforce taxes and sanction non-compliance based in the law, tax compliance can significantly erode revenue.
                          </p>
                        </li>

                        <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                          <p>Does the local government have control over the recruitment, extension, and termination of its own government officials?</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Scoring:</span> Maximum points are awarded if the local government has control over the recruitment, extension, and termination of its own employees
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Reasoning:</span> Without the ability to adjust the tax administration workforce, local governments may not be able to maintain the necessary number of employees to administer their OSR program and may be saddled with ineffective patronage appointments. Additionally, an inability to terminate employees may lead to corruption and poor performance.
                          </p>
                        </li>
                      </ul>
                    </li>
                  </ol>
                </div>

                {/* Incentives Section */}
                <div className="space-y-4 mt-8">
                  <h5 className="font-medium">Incentives of local government to raise OSR</h5>
                  <p className="text-sm">This section&#39;s scoring is determined based on responses to the questions below in the Incentives section.</p>
                  
                  <ol className="list-decimal pl-5 space-y-4 text-sm">
                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Compared to neighboring local governments, how much funding does the local government receive from the national government on a per capita basis?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if the local government receives less than peers on a per capita basis.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Fiscal transfers can disincentivize local governments from implementing OSR reforms since there is no reason to spend time and effort reforming OSR systems if adequate revenue is provided by the national government. A reliance on fiscal transfers undermines local governments&#39; independence and ability to make locally-responsive decisions.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>What percentage of the local government&#39;s annual recurrent expenditures is covered by OSR revenue?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> More points are awarded the higher percentage of annual recurrent expenditures are covered.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Ideally, OSR should cover all recurrent government expenditures.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Is the national government politically aligned with the local government?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if the national government is not politically aligned with the local government.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> A lack of political alignment with the national government may motivate local governments to strengthen their OSR administration out of fear that fiscal transfers will be reduced.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Is OSR collected by the national government on behalf of the local government? Does the national government send the corresponding amount back to the local government?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Points are awarded if OSRs are locally collected.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Nationally collected and/or redistributed tax revenue diminishes local incentives for improving OSR, as the national government may not redistribute the same amount that was collected from the municipality.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Is the allocation of inter-governmental transfers strongly linked to OSR performance?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> The highest number of points are awarded if national transfer increases are linked to OSR increases.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> If higher local revenue results in more fiscal transfers from the national government, local governments will be incentivized to improve and reform OSR.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Which place does the country occupy in the <span className="text-blue-500">Corruption Perception Index</span>?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Countries with a lower rank on the corruption perception index (less corrupt) receive more points.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Corruption can result in revenue leakages and the misuse of funds. Additionally, a low ranking on the Corruption Perception Index reflects that there is a poor perception of the government, which lowers public trust and decreases tax compliance.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Is there a national audit that is regularly carried out, includes an OSR assessment, and provides publicly available results?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if there is a regular audit that includes an OSR assessment and provides publicly available results.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Audits are essential for local governments to catch errors and issues with OSR collection, provide incentives to municipal staff to adhere to regulations, and provide assurance to the public that funds are being collected according to the regulations.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Do the audit reports suggest compliance with existing government regulations?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Points are awarded if the audit reports suggest strong compliance.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Strong compliance suggests that the revenue administration is performing its job based on the law.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Are national audit reports usually followed by any actions?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Points are awarded if action is taken following an audit.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> To see benefits from an audit, action must be taken to rectify any observed issues.
                      </p>
                    </li>
                  </ol>
                </div>
              </div>

              {/* Local OSR Environment Section */}
              <div className="mt-8 space-y-4">
                <h4 className="text-xl font-semibold text-primary-light dark:text-primary-dark">
                  Local OSR Environment
                </h4>
                <div className="space-y-4">
                  <h5 className="font-medium">Capacity of Revenue Administration</h5>
                  <p className="text-sm">This section's score is determined based on the average score of responses to the below questions.</p>
                  
                  <ol className="list-decimal pl-5 space-y-4 text-sm">
                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Is there a revenue department that administers the majority of OSRs?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if the revenue department administers nearly all OSRs.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> One central revenue department, rather than separate departments for each revenue source, is a more effective and efficient way to administer OSRs.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Does the revenue department receive sufficient resources to pay competitive salaries, purchase technology, make important capital investments, etc.?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if the revenue department receives sufficient resources.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> To function effectively, the revenue department needs funding for administration.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Has the Revenue Administration been provided with the necessary IT systems and infrastructure (internet, computers, etc.)?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if the revenue department has the necessary IT systems and infrastructure.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Technology can help revenue departments to function more efficiently, fairly, and transparently. Basic IT systems, including computers, Point of Sale (POS) systems, IT security, GIS maps, and more are all necessary to operate a digitized taxation system.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Can the revenue department decide on the hiring and firing of its employees?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if the revenue department has full control over the hiring and firing of its employees.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Without the ability to adjust its workforce, the revenue department may not be able to maintain the necessary number of employees to effectively administer its OSR program. Additionally, an inability to terminate employees may encourage corruption or inefficiency.
                      </p>
                    </li>
                  </ol>
                </div>

                {/* Incentives of Revenue Administration Section */}
                <div className="space-y-4 mt-8">
                  <h5 className="font-medium">Incentives of Revenue Administration</h5>
                  <p className="text-sm">This section's score is determined based on the average score of responses to the below questions:</p>
                  
                  <ol className="list-decimal pl-5 space-y-4 text-sm">
                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>How many of the following analytical options are included in regular reporting of the revenue department to senior leadership of the local government: (1) actual and budgeted revenue (2) month on month and year on year comparison of actual revenue (3) registered taxpayers per OSR (4) billed taxpayers per OSR (5) compliant taxpayers per OSR (6) total arrears per OSR?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> The more analytical options included in regular reporting, the more points are awarded.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Regular reporting of as many significant metrics as possible will enable revenue departments to notice revenue changes or irregularities and will allow trends and issues to become clear over time. Senior leadership will become invested and informed about revenue changes so that swift action can correct any issues that arise.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Are revenue reports publicly accessible?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if all revenue reports are publicly accessible.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Publicly accessible revenue reports promote accountability within the revenue administration, discourage corruption, and build trust with the public.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Is there a functional internal audit team, and does it examine OSR performance on a regular basis?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if there is an audit team that regularly reviews OSR performance.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> An audit team will encourage compliance with regulations, discourage corruption, promote public trust, and allow governments to observe and correct errors in tax administration.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Does the Internal Audit team carry out unannounced spot checks of the Revenue Department?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if spot checks are performed weekly.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Frequent spot checks will allow the revenue department to quickly identify issues and worsening trends before they become larger issues. Additionally, frequent spot checks will discourage corruption and encourage adherence to regulations.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Has the internal audit team found any issues in the OSR system?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if the audit team has found significant issues in the OSR system or if no issues or only minor issues have been found because the OSR system is well-functioning.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Discovering issues in the OSR system indicates that the audit team is functioning effectively, being provided accurate data, and is allowed to follow-through on issues found.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Are internal audit reports usually pursued by any actions?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Points are awarded if recommendations are implemented swiftly.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Without action to implement audit recommendations, audits will have no impact on OSR.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Are there harsh measures in place for OSR related fraud?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if harsh measures are in place for OSR related fraud.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Harsh measures will disincentivize fraud and corruption.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Have any OSR officials been found guilty of fraud and received sanctions in the last 12 months?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if quite a few OSR officials have been found guilty of fraud and received sanctions in the last 12 months or if no officials have been found guilty of fraud because there is little or no fraud.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> A high number of officials sanctioned indicates that systems in place to capture and penalize fraud are working.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Is the leadership of the revenue administration held accountable for poor performance?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if the leadership is changed after poor performance.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Holding revenue department leadership accountable for poor performance will incentivize effective revenue administration and policy. Impactful repercussions, such as requiring a change in leadership, will have the largest effect.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Is a particular group clearly favored by existing OSR policy and administration? Does local politics interfere with the work of the OSR administration?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Points are awarded if no group is favored over another in the OSR system.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Favoring one group over another is fundamentally unfair and a result of poor policy decisions. Favoring one group over another will lead to inequality, breed distrust of the system, and disincentivize public compliance.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>When was the last valuation of land/property carried out?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> The more recent the valuation, the higher number of points are awarded.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> For property taxes to work effectively, property values need to accurately reflect current market conditions, which requires frequent valuation updates. Without regular valuation updates, property tax revenues will not increase alongside property values.
                      </p>
                    </li>
                  </ol>
                </div>
              </div>

              {/* Revenue Administration Section */}
              <div className="mt-8 space-y-4">
                <h4 className="text-xl font-semibold text-primary-light dark:text-primary-dark">
                  Revenue Administration
                </h4>
                
                {/* Strategy Subsection */}
                <div className="space-y-4">
                  <h5 className="font-medium">Strategy</h5>
                  <p className="text-sm">Revenue Administration Strategy is scored based on an average of the following three factors:</p>
                  
                  <ol className="list-decimal pl-5 space-y-4 text-sm">
                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Value of the Top 5 OSRs compared to Total OSR Revenue.</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> If the Top 5 OSRs generate more than 80% of Total OSR, points are awarded.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Local governments should focus on administering high-revenue OSRs well, rather than introducing a myriad of different OSRs that require staff resources and administrative costs but return little revenue.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Ratio of Tax Collectors to Revenue</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> If the Top 5 revenue-generating OSRs have a higher average ratio of tax collectors-to-revenues than the Top 10 OSRs' average ratio, points are awarded. Please note: This question is only applicable if tax compliance and enforcement have not been digitized.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Revenue authorities should allocate staff resources according to revenue return. If low-revenue OSRs have a higher ratio of staffing, staff resources should be reallocated to the high-revenue OSRs.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>The average score awarded based on responses to the below 'Revenue Administration Strategy' questions:</p>
                      <ol className="list-roman pl-5 space-y-4 text-sm">
                        <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                          <p>What % of OSRs that the revenue administration administers generate less than 1% of total OSR?</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Scoring:</span> The fewer OSRs that generate less than 1% of total OSR, the more points awarded.
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Reasoning:</span> Low-revenue OSRs can drain resources, including staff time, that could be better allocated to higher-revenue OSRs.
                          </p>
                        </li>

                        <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                          <p>Does the revenue administration have an accurate sense of the cost of administering each OSR?</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Scoring:</span> Maximum points are awarded if the revenue administration has an accurate sense of the cost to administer each OSR.
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Reasoning:</span> Knowing the cost to administer each OSR will help the revenue administration evaluate whether certain OSRs do not generate enough revenue to justify the cost of collection.
                          </p>
                        </li>

                        <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                          <p>How does the Revenue Administration determine where to focus its administration efforts / resources?</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Scoring:</span> Maximum points are awarded when efforts and resources are allocated based on the potential of OSR and an understanding of the required administrative resources. The second highest score is given when efforts and resources are focused based on ease of collection.
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Reasoning:</span> Resources should be focused on taxes with the highest revenues and the best ratio of revenue to cost of collection. Basing efforts and resources on prior years strategies and/or tax collector preferences will not maximize revenue.
                          </p>
                        </li>
                      </ol>
                    </li>
                  </ol>
                </div>

                {/* Data & Digital Revenue Systems Subsection */}
                <div className="space-y-4 mt-8">
                  <h5 className="font-medium">Data & Digital Revenue Systems</h5>
                  <p className="text-sm">Revenue Administration Data & Digital Revenue Systems is scored based on the average scores of the below question responses:</p>
                  
                  <ol className="list-decimal pl-5 space-y-4 text-sm">
                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Which of the following processes have been digitized? (Tax sensitization, Tax collection (POS systems), Tax accounting, tracking, and monitoring (Public financial management software))</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> More points are awarded if more processes have been digitized.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Digital systems improve uniformity, efficiency, and transparency.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Does the entire revenue department regularly use one integrated well-functioning digital system to administer all OSRs?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if there is one fully functioning digital system to administer OSRs.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Digital systems improve uniformity, efficiency, and transparency. One uniform digital system is simpler and more efficient than multiple systems that work in parallel.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Are there frequent changes in relation to the digital system? Is it often replaced or is it being improved?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if the system is new and the first of its kind or if the system has been around for a few years.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Frequent changes to the digital system imply poor procurement procedures and require frequent training for staff and adjustment of data collection processes. Transferring data between systems to observe trends may also be a challenge.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Is it possible to access all the taxpayer information in one digital system?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if it is possible to access all taxpayer information in one digital system. If some OSRs are administered manually or some systems are not integrated, fewer points are awarded.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> To create the most efficient and effective revenue system, all OSRs should be digitized, integrated, and allow for data sharing.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Are digital system change requests dealt with in a timely manner?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> More points are awarded if change requests are dealt with in a timely manner.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Quick adjustments will allow tax administration systems to function more efficiently.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Can data be cross-checked with data from other local and national government agencies? (e.g. in regard to business registration, etc.)</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if data can be cross-checked with other local and national government agencies.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Integrated digitized systems that allow for data sharing across agencies promote data accuracy and can assist both tax administration agencies and other government agencies with collecting more complete datasets to inform policy decisions.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Is the local government's OSR data accurate, and are there regular processes in place to clean and update data?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if OSR data is accurate and there are regular processes in place to clean and update data.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Accurate data will help tax administrators make informed decisions about revenue policy, allow tracking of data trends, and allow accurate budgeting.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Is there a log of changes in the accounting system to track who did what and when?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if the log exists and works well.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Tracking the origin of changes will encourage accurate bookkeeping and discourage corruption.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Has significant data been lost or corrupted in the past 5 years?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if arrear data has not been lost.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Missing arrear data makes the collection of arrears difficult, indicates flaws in the data management system, and may indicate corruption.
                      </p>
                    </li>
                  </ol>
                </div>

                {/* Tax Base Section */}
                <div className="space-y-4 mt-8">
                  <h5 className="font-medium">Tax Base (Exemptions & Registration)</h5>
                  <p className="text-sm">Revenue Administration Tax Base is scored based on the average scores of the below question responses:</p>
                  
                  <ol className="list-decimal pl-5 space-y-4 text-sm">
                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Are politically connected, wealthy individuals exempted from paying OSRs?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if politically connected, wealthy individuals are not exempt from paying OSRs and they are mostly compliant with their payments. A lower number of points are awarded if these individuals are not formally exempt, yet most do not actually pay taxes.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Wealthy individuals have the highest incomes and the most landholdings. Exempting them from OSRs will result in a large amount of missed revenue.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>For OSRs that require tax base valuation, are the valuation processes up to date?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if the valuation processes are up to date.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Up to date processes are important to ensure valuations reflects market conditions.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>For OSRs that require tax base valuation, are there objective and verifiable valuation processes? For example, are business license fees based on the revenue, number of employees, etc.?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if there are objective and verifiable valuation processes.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Objective and verifiable valuation processes will promote uniform and fair tax liabilities and will decrease the likelihood of corrupt valuation practices.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Is there a national audit that is regularly carried out, includes an OSR assessment, and provides publicly available results?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if there is a regular audit that includes an OSR assessment and provides publicly available results.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Audits are essential for local governments to catch errors and issues with OSR collection, provide incentives to municipal staff to adhere to regulations, and provide assurance to the public that funds are being collected according to the regulations.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Do the audit reports suggest compliance with existing government regulations?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Points are awarded if the audit reports suggest strong compliance.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Strong compliance suggests that the revenue administration is performing its job based on the law.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Are national audit reports usually followed by any actions?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Points are awarded if action is taken following an audit.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> To see benefits from an audit, action must be taken to rectify any observed issues.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Is there a log of changes in the accounting system to track who did what and when?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if the log exists and works well.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Tracking the origin of changes will encourage accurate bookkeeping and discourage corruption.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Has significant data been lost or corrupted in the past 5 years?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if arrear data has not been lost.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Missing arrear data makes the collection of arrears difficult, indicates flaws in the data management system, and may indicate corruption.
                      </p>
                    </li>
                  </ol>
                </div>

                {/* Tax Rates Section */}
                <div className="space-y-4 mt-8">
                  <h5 className="font-medium">Tax Rates</h5>
                  <p className="text-sm">Revenue Administration Tax Rates is scored based on the average scores of the below question responses:</p>
                  
                  <ol className="list-decimal pl-5 space-y-4 text-sm">
                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Have any rates been reduced in the past 3 years for any OSRs for political reasons?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if rates have not been reduced for political reasons.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Tax rates should be made based on local government revenue needs and an understanding of best practices. Political pressure should not impact tax rates.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Have property taxes generally kept up with increases in property values?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if rates have been adjusted upwards to match changes in overall price levels
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> As prices increase, tax rates should be adjusted accordingly to match. This will allow local governments to maintain service provision as costs increase.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Has the public been given the opportunity to co-determine tax/fee rates?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if there is a participatory process to determine tax/fee rates.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Engaging the public in a collaborative process to determine tax/fee rates will generate greater buy-in and willingness to pay taxes.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Is there subletting of public assets user fees? Are there middlemen/agents who capture a % of the full rate?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> Maximum points are awarded if there is no subletting of public assets.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> Subletting of public assets, such as markets, can lead to substantial losses of revenue and indicates that rates are below market value.
                      </p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>What percentage of the government rate is captured by middlemen?</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Scoring:</span> More points are awarded the lower the percentage captured by middlemen.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reasoning:</span> The higher percentage of rate captured by middlemen, the more government rates are below-market and the more potential profit is being lost.
                      </p>
                    </li>
                  </ol>
                </div>

                {/* Tax Collection Section */}
                <div className="space-y-4 mt-8">
                  <h5 className="font-medium">Tax Collection</h5>
                  <p className="text-sm">The Revenue Administration Tax Collection score is calculated based on an average the following three items:</p>
                  
                  <ol className="list-decimal pl-5 space-y-4 text-sm">
                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>The collection gap: The lower the collection gap, the higher the score. The collection gap is calculated by taking the average compliance rate for each of the top 10 OSRs, based on the data input in the 'Revenue Administration' section on the 'Problem' tab. The higher the average compliance rate, the lower the collection gap, and the more points are awarded.</p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>Collection gap of the Top 5 OSRs: If the collection gap for the Top 5 OSRs is lower than the tax collection gap for the Top 10 OSRs, points are awarded.</p>
                    </li>

                    <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                      <p>The average score of responses to the below questions:</p>
                      <ol className="list-roman pl-5 space-y-4">
                        <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                          <p>Do taxpayers have to declare their tax liabilities, or are bills distributed to all taxpayers for the main OSRs?</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Scoring:</span> Maximum points are awarded if all taxpayers are billed.
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Reasoning:</span> Distributing tax bills will remind taxpayers of their tax obligation and will result in a higher compliance rate and more uniform and accurate assessments than if taxpayers were required to self-declare their tax liabilities.
                          </p>
                        </li>

                        <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                          <p>Are most of the bills distributed electronically?</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Scoring:</span> Maximum points are awarded if most of the bills are distributed electronically.
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Reasoning:</span> Electronic distribution will allow quicker lower cost bill distribution, better tracking, and decreased opportunities for corruption.
                          </p>
                        </li>

                        <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                          <p>How many of the following payment options do taxpayers have? cash, mobile payment, bank transfer, credit card, other digital options.</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Scoring:</span> The more payment options available, the more points are awarded.
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Reasoning:</span> More payment options increase the convenience of payment and the likelihood taxpayers will comply.
                          </p>
                        </li>

                        <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                          <p>What percentage of tax payments are carried out electronically (not in cash)?</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Scoring:</span> The greater percentage of electronic payments, the more points.
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Reasoning:</span> Electronic payment decreases opportunity for corruption and increases accuracy and transparency of payment tracking.
                          </p>
                        </li>

                        <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                          <p>How is the performance of tax collectors assessed?</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Scoring:</span> Maximum points are awarded if performance is assessed based on Key Performance Indicators (KPIs) and revenue collected.
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Reasoning:</span> Assessing tax collector performance based on objective metrics, such as KPIs and revenue collection, will increase incentives to improve revenue collection performance.
                          </p>
                        </li>

                        <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                          <p>What happens in the event of persistent poor performance of tax collectors?</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Scoring:</span> Maximum points are awarded if tax collectors are fired for persistent poor performance. The second highest-scoring answer is relocating tax collectors to a different OSR or collection point.
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Reasoning:</span> Meaningful consequences for poor performance will incentivize performance and disincentivize corruption.
                          </p>
                        </li>

                        <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                          <p>Which of the below best describes the staff turnover of the revenue department?</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Scoring:</span> Maximum points are awarded if the tax system is high performing and there are no major issues with staff turnover. The second highest-scoring response is if turnover varies but does not really affect OSR performance.
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Reasoning:</span> Both high turnover and low turnover, coupled with low OSR performance, can negatively impact OSR performance. Both patterns indicate a staff management problem in the revenue administration. Low turnover coupled with poor performance indicates that there are insufficient performance assessments and penalties for poor staff performance. High turnover suggests challenges building a skilled and knowledgeable workforce.
                          </p>
                        </li>

                        <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                          <p>Are tough sanctions applied to non-compliant taxpayers?</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Scoring:</span> Maximum points are awarded if there are real consequences for non-compliance.
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Reasoning:</span> Without penalties for non-compliance, many taxpayers may choose not to pay.
                          </p>
                        </li>

                        <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                          <p>Does the revenue administration have an accurate sense of the potential of each OSR?</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Scoring:</span> Maximum points are awarded if accurate baselines are in place for all OSRs.
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Reasoning:</span> Baseline metrics are essential to project revenue goals and budget government expenditures.
                          </p>
                        </li>

                        <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                          <p>How does the revenue administration estimate the potential of its OSRs?</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Scoring:</span> Maximum points are awarded if the revenue administration estimates potential based on revenue mapping and/or door-to-door surveying.
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Reasoning:</span> Revenue mapping and door-to-door surveying will provide the most accurate revenue projections. Using prior year budget estimates and peer comparisons may result in inaccurate projections.
                          </p>
                        </li>

                        <li className="space-y-2 marker:text-primary-light dark:marker:text-primary-dark marker:font-medium">
                          <p>What is the overall % of arrears to total annual OSR?</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Scoring:</span> The lower percent of arrears, the more points are awarded.
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Reasoning:</span> A high amount of arrears indicates there is a collection and/or compliance issue.
                          </p>
                        </li>
                      </ol>
                    </li>
                  </ol>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <footer className="pt-8 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
                If there are further questions after reviewing this guide, please reach out to{' '}
                <a href="#" className="text-blue-500 hover:underline">Lennart Fleck</a>.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </>
  )
} 