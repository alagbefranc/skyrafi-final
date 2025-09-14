import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Globe, CreditCard, Shield, TrendingUp, PieChart } from 'lucide-react'

export function Features() {
  return (
    <section className="relative py-16 md:py-28">
      {/* Subtle background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-blue-200/30 blur-3xl dark:bg-sky-blue-100/10" />
        <div className="absolute -bottom-16 right-10 h-72 w-72 rounded-full bg-sky-blue-300/30 blur-3xl dark:bg-sky-blue-100/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section heading */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-display">
            YOUR JOURNEY TO <span className="text-sky-blue-600">FINANCIAL FREEDOM</span>
          </h2>
          <p className="mt-3 text-base text-gray-600 sm:text-lg">
            Powerful features that transform your financial future — built for clarity, speed, and real results.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-5">
          {/* Primary feature - left large card */}
          <Card className="group overflow-hidden border-gray-200/60 bg-white/70 backdrop-blur-sm shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5 sm:col-span-3 sm:rounded-none sm:rounded-tl-xl">
            <CardHeader>
              <div className="md:p-6">
                <p className="font-medium">AI-powered debt payoff</p>
                <p className="text-muted-foreground mt-3 max-w-sm text-sm">
                  Our engine optimizes avalanche vs snowball to save you the most interest and time — aligned with your cash flow.
                </p>
              </div>
            </CardHeader>
            <div className="relative h-fit pl-6 md:pl-12">
              <div className="absolute -inset-6 [background:radial-gradient(75%_95%_at_50%_0%,transparent,hsl(var(--background))_100%)]" />

              {/* Mock App Panel: Optimized payment schedule */}
              <div className="rounded-tl-lg border-l border-t bg-white/80 p-4 backdrop-blur-sm dark:bg-zinc-950/60">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-sky-blue-600" />
                    <span className="text-sm font-medium">Monthly schedule</span>
                  </div>
                  <span className="text-xs text-sky-blue-700 font-semibold">Avalanche • Save $4,120</span>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Chase Sapphire', apr: '19.9%', due: '5th', amt: 220 },
                    { name: 'Amex Cash', apr: '23.4%', due: '12th', amt: 340 },
                    { name: 'Citi Double', apr: '18.1%', due: '25th', amt: 180 },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-5 items-center gap-3 rounded-lg border p-3 transition hover:bg-sky-blue-50/40 dark:hover:bg-white/5">
                      <div className="col-span-2 text-sm font-medium">{row.name}</div>
                      <div className="text-xs text-muted-foreground">APR {row.apr}</div>
                      <div className="text-xs text-muted-foreground">Due {row.due}</div>
                      <div className="text-right text-sm font-semibold">${row.amt}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Interest saved</span>
                    <span>72%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800">
                    <div className="h-full w-7/12 bg-sky-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Top-right card */}
          <Card className="group overflow-hidden border-gray-200/60 bg-white/70 backdrop-blur-sm shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5 sm:col-span-2 sm:rounded-none sm:rounded-tr-xl">
            <p className="mx-auto my-6 max-w-md text-balance px-6 text-center text-lg font-semibold sm:text-2xl md:p-6">
              Real-time spending insights
            </p>

            <CardContent className="mt-auto h-fit">
              <div className="relative mb-6 sm:mb-0">
                <div className="absolute -inset-6 [background:radial-gradient(50%_75%_at_75%_50%,transparent,hsl(var(--background))_100%)]" />
                {/* Mock Insights: bars and badges */}
                <div className="rounded-r-lg border p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-sky-blue-600" />
                    <span className="text-sm font-medium">Today’s safe-to-spend</span>
                    <span className="ml-auto rounded-full bg-sky-blue-50 px-2 py-0.5 text-xs font-semibold text-sky-blue-700">$42</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Groceries', used: '64%', w: 'w-2/3' },
                      { label: 'Dining', used: '38%', w: 'w-2/5' },
                      { label: 'Transport', used: '22%', w: 'w-1/5' },
                    ].map((b, i) => (
                      <div key={i}>
                        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{b.label}</span>
                          <span>{b.used}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800">
                          <div className={`h-full ${b.w} bg-sky-blue-600`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom-left small features */}
          <Card className="group p-6 shadow-black/5 sm:col-span-2 sm:rounded-none sm:rounded-bl-xl md:p-12">
            <p className="mx-auto mb-12 max-w-md text-balance text-center text-lg font-semibold sm:text-2xl">
              Wealth bridge to savings
            </p>

            <div className="flex justify-center gap-6">
              <div className="relative flex aspect-square size-16 items-center rounded-[7px] border p-3 shadow-lg ring bg-sky-blue-50/60 dark:ring-black dark:bg-sky-blue-100/10">
                <span className="absolute right-2 top-1 block text-sm">fn</span>
                <Globe className="mt-auto size-4 text-sky-blue-600" />
              </div>
              <div className="flex aspect-square size-16 items-center justify-center rounded-[7px] border p-3 shadow-lg ring bg-muted/35 dark:ring-black">
                <span className="font-semibold text-sky-blue-700">AI</span>
              </div>
            </div>
          </Card>

          {/* Bottom-right integrations grid */}
          <Card className="group relative shadow-black/5 sm:col-span-3 sm:rounded-none sm:rounded-br-xl">
            <CardHeader className="p-6 md:p-12">
              <p className="font-medium">Bank-level security</p>
              <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                Read-only connections, encrypted in transit and at rest.
              </p>
            </CardHeader>
            <CardContent className="relative h-fit px-6 pb-6 md:px-12 md:pb-12">
              {/* Icon grid instead of vendor images */}
              <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
                <div className="aspect-square rounded-(--radius) border border-dashed" />
                <div className="aspect-square rounded-(--radius) border bg-muted/50 p-4 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-sky-blue-600" />
                </div>
                <div className="aspect-square rounded-(--radius) border border-dashed" />
                <div className="aspect-square rounded-(--radius) border bg-muted/50 p-4 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-sky-blue-600" />
                </div>
                <div className="aspect-square rounded-(--radius) border border-dashed" />
                <div className="aspect-square rounded-(--radius) border bg-muted/50 p-4 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-sky-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
