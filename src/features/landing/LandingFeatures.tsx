const FEATURES = [
  {
    feature: 'Sheet',
    detail:
      'Sortable grid with search, status filters and shareable filtered views',
  },
  {
    feature: 'Board',
    detail: 'Drag applications between stages',
  },
  {
    feature: 'Overview',
    detail:
      'Funnel, response rate, weekly activity and a list of applications that have gone quiet',
  },
  {
    feature: 'Import and export',
    detail: 'Bring in a spreadsheet as CSV, export any time',
  },
  {
    feature: 'Private',
    detail: 'Each account can only read its own applications',
  },
] as const

export function LandingFeatures() {
  return (
    <section
      aria-labelledby="landing-features-heading"
      className="flex flex-col gap-4"
    >
      <h2 id="landing-features-heading">What it does</h2>
      <table className="w-full border-separate border-spacing-0 text-sm leading-5">
        <thead className="bg-fill">
          <tr>
            <th
              scope="col"
              className="border-r border-r-rule border-b border-b-ink px-2 py-2 text-left text-xs font-medium"
            >
              Feature
            </th>
            <th
              scope="col"
              className="border-b border-b-ink px-2 py-2 text-left text-xs font-medium"
            >
              Detail
            </th>
          </tr>
        </thead>
        <tbody>
          {FEATURES.map((row, index) => {
            const isLast = index === FEATURES.length - 1
            return (
              <tr key={row.feature}>
                <td
                  className={
                    isLast
                      ? 'align-top border-r border-r-rule px-2 py-2 font-medium'
                      : 'align-top border-r border-r-rule border-b border-b-rule px-2 py-2 font-medium'
                  }
                >
                  {row.feature}
                </td>
                <td
                  className={
                    isLast
                      ? 'px-2 py-2 text-ink-2'
                      : 'border-b border-b-rule px-2 py-2 text-ink-2'
                  }
                >
                  {row.detail}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
