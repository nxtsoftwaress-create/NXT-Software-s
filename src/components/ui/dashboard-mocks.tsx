import { motion } from "framer-motion"
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Bot,
  Check,
  Clock,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Shield,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

const ease = [0.22, 1, 0.36, 1] as const

function Panel({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  )
}

function Sidebar({
  items,
  activeIndex = 0,
}: {
  items: { icon: React.ElementType; label: string }[]
  activeIndex?: number
}) {
  return (
    <div className="hidden w-[132px] shrink-0 flex-col gap-1 border-r border-white/[0.06] bg-white/[0.015] p-3 sm:flex">
      <div className="mb-3 flex items-center gap-2 px-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-white/25 to-white/5 font-display text-[10px] font-bold text-white">
          N
        </span>
        <span className="font-display text-[11px] font-semibold tracking-wider text-white/80">
          Console
        </span>
      </div>
      {items.map((it, i) => (
        <div
          key={it.label}
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[11px]",
            i === activeIndex
              ? "bg-white/[0.07] text-white"
              : "text-white/35",
          )}
        >
          <it.icon size={13} strokeWidth={1.5} />
          {it.label}
          {i === activeIndex && (
            <motion.span
              layoutId="nav-dot"
              className="ml-auto h-1 w-1 rounded-full bg-white/70"
            />
          )}
        </div>
      ))}
      <div className="mt-auto flex items-center gap-2 rounded-md border border-white/[0.06] p-2">
        <span className="h-5 w-5 rounded-full bg-gradient-to-br from-white/30 to-white/10" />
        <div className="flex-1 space-y-1">
          <div className="h-1 w-12 rounded-full bg-white/20" />
          <div className="h-1 w-8 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  )
}

function Topbar({ title, tag }: { title: string; tag: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-2.5">
      <span className="font-mono text-[10px] tracking-widest text-white/40">
        {title}
      </span>
      <span className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-medium text-emerald-300">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        {tag}
      </span>
      <Bell size={12} className="text-white/30" />
      <Settings size={12} className="text-white/30" />
    </div>
  )
}

function Sparkline({
  points,
  className,
  stroke = "currentColor",
  delay = 0,
  reduce,
}: {
  points: number[]
  className?: string
  stroke?: string
  delay?: number
  reduce: boolean | null
}) {
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1
  const step = 100 / (points.length - 1)
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${28 - ((p - min) / range) * 24 - 2}`)
    .join(" ")

  return (
    <svg
      viewBox="0 0 100 28"
      preserveAspectRatio="none"
      className={cn("h-8 w-full", className)}
    >
      <motion.path
        d={d}
        fill="none"
        style={{ stroke }}
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={reduce ? undefined : { pathLength: 0 }}
        animate={reduce ? undefined : { pathLength: 1 }}
        transition={{ duration: 1.2, delay, ease: "easeOut" }}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function Bars({
  values,
  reduce,
  delay = 0,
  className,
}: {
  values: number[]
  reduce: boolean | null
  delay?: number
  className?: string
}) {
  const max = Math.max(...values)
  return (
    <div className={cn("flex h-16 items-end gap-1.5", className)}>
      {values.map((v, i) => (
        <motion.div
          key={i}
          className={cn(
            "flex-1 rounded-sm",
            i === values.length - 1
              ? "bg-white/70"
              : "bg-white/[0.14]",
          )}
          initial={reduce ? { height: `${(v / max) * 100}%` } : { height: 0 }}
          animate={{ height: `${(v / max) * 100}%` }}
          transition={{ duration: 0.7, delay: delay + i * 0.05, ease }}
        />
      ))}
    </div>
  )
}

function Delta({ up, value }: { up: boolean; value: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[10px] font-medium",
        up ? "text-emerald-400" : "text-rose-400",
      )}
    >
      {up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
      {value}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* 01 — MERIDIAN · Fintech platform                                    */
/* ------------------------------------------------------------------ */

export function FintechMock({ reduce }: { reduce: boolean | null }) {
  const revenue = [42, 55, 48, 61, 58, 72, 66, 78, 74, 88, 84, 96]

  return (
    <div className="flex h-full">
      <Sidebar
        items={[
          { icon: LayoutDashboard, label: "Overview" },
          { icon: CreditCard, label: "Payments" },
          { icon: Wallet, label: "Settlements" },
          { icon: Shield, label: "Fraud signals" },
          { icon: Users, label: "Merchants" },
        ]}
        activeIndex={1}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title="PAYMENTS / LIVE" tag="3.2k txn/min" />

        <div className="grid flex-1 grid-cols-2 gap-2.5 overflow-hidden p-3">
          {/* KPI row */}
          <Panel className="col-span-2 grid grid-cols-3 divide-x divide-white/[0.06]">
            {[
              { label: "Volume today", value: "$1.24M", up: true, delta: "12.4%" },
              { label: "Success rate", value: "99.2%", up: true, delta: "0.3%" },
              { label: "Flagged", value: "17", up: false, delta: "4.1%" },
            ].map((k) => (
              <div key={k.label} className="px-3.5 py-3">
                <p className="text-[9px] uppercase tracking-wider text-white/35">
                  {k.label}
                </p>
                <p className="mt-1 font-display text-lg font-bold text-white">
                  {k.value}
                </p>
                <Delta up={k.up} value={k.delta} />
              </div>
            ))}
          </Panel>

          {/* Revenue chart */}
          <Panel className="col-span-2 flex flex-col p-3.5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-white/60">
                Transaction volume — 12h
              </p>
              <div className="flex gap-1">
                {["1D", "7D", "30D"].map((t, i) => (
                  <span
                    key={t}
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[8px]",
                      i === 0
                        ? "bg-white/10 text-white"
                        : "text-white/30",
                    )}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative mt-2 flex-1">
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-px w-full bg-white/[0.05]" />
                ))}
              </div>
              <Sparkline
                points={revenue}
                reduce={reduce}
                stroke="rgb(var(--mock-ink) / 0.85)"
                className="absolute inset-0 h-full"
                delay={0.4}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[8px] text-white/25">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
            </div>
          </Panel>

          {/* Fraud panel + methods */}
          <Panel className="flex flex-col gap-2 p-3.5">
            <p className="text-[10px] font-medium text-white/60">Fraud signals</p>
            {[
              { label: "Velocity rule", score: 22 },
              { label: "Geo mismatch", score: 48 },
              { label: "Device trust", score: 81 },
            ].map((f, i) => (
              <div key={f.label}>
                <div className="flex justify-between text-[9px] text-white/40">
                  <span>{f.label}</span>
                  <span
                    className={cn(
                      f.score > 70
                        ? "text-amber-400"
                        : "text-white/50",
                    )}
                  >
                    {f.score}
                  </span>
                </div>
                <div className="mt-1 h-1 rounded-full bg-white/[0.07]">
                  <motion.div
                    className={cn(
                      "h-full rounded-full",
                      f.score > 70 ? "bg-amber-400/80" : "bg-white/40",
                    )}
                    initial={reduce ? { width: `${f.score}%` } : { width: 0 }}
                    animate={{ width: `${f.score}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.15, ease }}
                  />
                </div>
              </div>
            ))}
          </Panel>

          <Panel className="flex flex-col p-3.5">
            <p className="text-[10px] font-medium text-white/60">
              Payment methods
            </p>
            <Bars
              reduce={reduce}
              delay={0.6}
              values={[82, 45, 64, 30, 52, 88, 40]}
              className="mt-2 flex-1"
            />
            <div className="mt-1.5 flex justify-between text-[8px] text-white/25">
              <span>Card</span>
              <span>UPI</span>
              <span>Wallet</span>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 02 — ATLAS COMMERCE · Retail system                                 */
/* ------------------------------------------------------------------ */

export function RetailMock({ reduce }: { reduce: boolean | null }) {
  const orders = [
    { id: "#48291", item: "Aurora Jacket", qty: 2, status: "Packed", ok: true },
    { id: "#48290", item: "Nimbus Runner", qty: 1, status: "In transit", ok: true },
    { id: "#48289", item: "Field Pack", qty: 4, status: "Picking", ok: false },
    { id: "#48288", item: "Halo Beanie", qty: 12, status: "Packed", ok: true },
  ]

  return (
    <div className="flex h-full">
      <Sidebar
        items={[
          { icon: LayoutDashboard, label: "Dashboard" },
          { icon: Wallet, label: "Inventory" },
          { icon: CreditCard, label: "Orders" },
          { icon: TrendingUp, label: "Forecast" },
          { icon: Users, label: "Stores" },
        ]}
        activeIndex={2}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title="FULFILLMENT / 40 STORES" tag="sync 12s ago" />

        <div className="grid flex-1 grid-cols-2 gap-2.5 overflow-hidden p-3">
          <Panel className="col-span-2 grid grid-cols-3 divide-x divide-white/[0.06]">
            {[
              { label: "Orders today", value: "3,847", up: true, delta: "8.2%" },
              { label: "Fill rate", value: "97.6%", up: true, delta: "1.1%" },
              { label: "Low stock SKUs", value: "23", up: false, delta: "6.5%" },
            ].map((k) => (
              <div key={k.label} className="px-3.5 py-3">
                <p className="text-[9px] uppercase tracking-wider text-white/35">
                  {k.label}
                </p>
                <p className="mt-1 font-display text-lg font-bold text-white">
                  {k.value}
                </p>
                <Delta up={k.up} value={k.delta} />
              </div>
            ))}
          </Panel>

          {/* Live order table */}
          <Panel className="col-span-2 overflow-hidden">
            <div className="flex items-center justify-between px-3.5 pb-1.5 pt-3">
              <p className="text-[10px] font-medium text-white/60">
                Live order stream
              </p>
              <span className="text-[8px] text-white/25">AUTO-REFRESH</span>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {orders.map((o, i) => (
                <motion.div
                  key={o.id}
                  initial={reduce ? undefined : { opacity: 0, x: -10 }}
                  animate={reduce ? undefined : { opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.12, duration: 0.5, ease }}
                  className="flex items-center gap-3 px-3.5 py-2 text-[10px]"
                >
                  <span className="font-mono text-white/40">{o.id}</span>
                  <span className="flex-1 truncate text-white/75">{o.item}</span>
                  <span className="text-white/30">×{o.qty}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[8px] font-medium",
                      o.ok
                        ? "bg-emerald-400/10 text-emerald-300"
                        : "bg-sky-400/10 text-sky-300",
                    )}
                  >
                    {o.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </Panel>

          {/* Demand forecast */}
          <Panel className="flex flex-col p-3.5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-white/60">
                Demand forecast
              </p>
              <Delta up value="+14%" />
            </div>
            <Bars
              reduce={reduce}
              delay={0.5}
              values={[38, 52, 44, 60, 55, 72, 68, 84]}
              className="mt-2 flex-1"
            />
          </Panel>

          {/* Stock health */}
          <Panel className="flex flex-col gap-2.5 p-3.5">
            <p className="text-[10px] font-medium text-white/60">
              Stock health
            </p>
            {[
              { label: "In stock", pct: 86, tone: "bg-emerald-400/80" },
              { label: "Reorder soon", pct: 11, tone: "bg-amber-400/80" },
              { label: "Backorder", pct: 3, tone: "bg-rose-400/80" },
            ].map((s, i) => (
              <div key={s.label}>
                <div className="flex justify-between text-[9px] text-white/40">
                  <span>{s.label}</span>
                  <span>{s.pct}%</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-white/[0.07]">
                  <motion.div
                    className={cn("h-full rounded-full", s.tone)}
                    initial={reduce ? { width: `${s.pct}%` } : { width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.12, ease }}
                  />
                </div>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 03 — VERA HEALTH · Healthcare AI                                    */
/* ------------------------------------------------------------------ */

export function HealthMock({ reduce }: { reduce: boolean | null }) {
  const queue = [
    { name: "Patient A", risk: "Low", pct: 18, tone: "text-emerald-300 bg-emerald-400/10" },
    { name: "Patient B", risk: "Moderate", pct: 47, tone: "text-amber-300 bg-amber-400/10" },
    { name: "Patient C", risk: "High", pct: 84, tone: "text-rose-300 bg-rose-400/10" },
    { name: "Patient D", risk: "Low", pct: 24, tone: "text-emerald-300 bg-emerald-400/10" },
  ]

  return (
    <div className="flex h-full">
      <Sidebar
        items={[
          { icon: LayoutDashboard, label: "Command" },
          { icon: Users, label: "Patients" },
          { icon: TrendingUp, label: "Triage AI" },
          { icon: Shield, label: "Compliance" },
          { icon: Settings, label: "Wards" },
        ]}
        activeIndex={2}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title="TRIAGE / ASSIST" tag="model v4.2 live" />

        <div className="grid flex-1 grid-cols-2 gap-2.5 overflow-hidden p-3">
          <Panel className="col-span-2 grid grid-cols-3 divide-x divide-white/[0.06]">
            {[
              { label: "Queue time", value: "6m 12s", up: true, delta: "38%" },
              { label: "Cases triaged", value: "1,206", up: true, delta: "9.7%" },
              { label: "Escalations", value: "8", up: false, delta: "2 today" },
            ].map((k) => (
              <div key={k.label} className="px-3.5 py-3">
                <p className="text-[9px] uppercase tracking-wider text-white/35">
                  {k.label}
                </p>
                <p className="mt-1 font-display text-lg font-bold text-white">
                  {k.value}
                </p>
                <Delta up={k.up} value={k.delta} />
              </div>
            ))}
          </Panel>

          {/* Triage queue */}
          <Panel className="col-span-2 p-3.5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-white/60">
                AI triage queue
              </p>
              <span className="flex items-center gap-1 text-[8px] text-white/25">
                <Shield size={9} /> HIPAA MODE
              </span>
            </div>
            <div className="mt-2.5 space-y-2.5">
              {queue.map((q, i) => (
                <div key={q.name}>
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-white/55">{q.name}</span>
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[8px] font-medium",
                        q.tone,
                      )}
                    >
                      {q.risk}
                    </span>
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-white/[0.07]">
                    <motion.div
                      className="h-full rounded-full bg-white/45"
                      initial={reduce ? { width: `${q.pct}%` } : { width: 0 }}
                      animate={{ width: `${q.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.45 + i * 0.12, ease }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Vitals trend */}
          <Panel className="flex flex-col p-3.5">
            <p className="text-[10px] font-medium text-white/60">
              Ward vitals trend
            </p>
            <div className="relative mt-2 flex-1">
              <Sparkline
                points={[30, 44, 38, 52, 47, 60, 55, 68, 62, 74]}
                reduce={reduce}
                stroke="rgb(var(--mock-pos) / 0.9)"
                className="absolute inset-0 h-full"
                delay={0.5}
              />
            </div>
          </Panel>

          {/* Copilot */}
          <Panel className="flex flex-col gap-1.5 p-3.5">
            <p className="text-[10px] font-medium text-white/60">
              Copilot suggestion
            </p>
            <div className="rounded-md border border-white/[0.07] bg-white/[0.04] p-2 text-[9px] leading-relaxed text-white/60">
              Reallocate 2 nurses to Ward B — queue is trending 22% above
              capacity for the next hour.
            </div>
            <div className="flex gap-1.5">
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[8px] text-white/70">
                Apply
              </span>
              <span className="rounded border border-white/10 px-1.5 py-0.5 text-[8px] text-white/35">
                Dismiss
              </span>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 04 — MERIDIAN AI · Copilot OS                                       */
/* ------------------------------------------------------------------ */

const copilotQueue = [
  { subject: "Order #48291 — address change", channel: "WHATSAPP", sla: "2m", hot: true },
  { subject: "Refund status — Aurora Jacket", channel: "EMAIL", sla: "14m", hot: false },
  { subject: "Size exchange — Nimbus Runner", channel: "WEB", sla: "31m", hot: false },
  { subject: "Invoice copy — September", channel: "EMAIL", sla: "1h", hot: false },
] as const

const copilotSteps = [
  { label: "Parse intent", detail: "order.update_address · 0.12s" },
  { label: "Retrieve order #48291", detail: "orders.v2 · 3 fields" },
  { label: "Verify identity", detail: "OTP matched" },
  { label: "Draft reply", detail: "EN · tone: concise" },
] as const

const routing = [
  ["AI agent", 64],
  ["Rules", 28],
  ["Human", 8],
] as const

export function AICopilotMock({ reduce }: { reduce: boolean | null }) {
  return (
    <div className="flex h-full">
      <Sidebar
        items={[
          { icon: MessageSquare, label: "Conversations" },
          { icon: BookOpen, label: "Knowledge" },
          { icon: Zap, label: "Automations" },
          { icon: Users, label: "Escalations" },
        ]}
        activeIndex={0}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title="COPILOT / OMNICHANNEL" tag="14 live" />

        <div className="grid flex-1 grid-cols-3 gap-2.5 overflow-hidden p-3">
          {/* Conversation queue */}
          <Panel className="flex flex-col p-3">
            <p className="text-[10px] font-medium text-white/60">Queue</p>
            <div className="mt-2 flex flex-col gap-1.5">
              {copilotQueue.map((q, i) => (
                <motion.div
                  key={q.subject}
                  initial={reduce ? undefined : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.12, ease }}
                  className={cn(
                    "rounded-md border px-2.5 py-2",
                    i === 0
                      ? "border-white/[0.14] bg-white/[0.06]"
                      : "border-white/[0.05] bg-white/[0.02]",
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-[9.5px] text-white/85">
                      {q.subject}
                    </span>
                    {q.hot && (
                      <Clock size={9} className="ml-auto shrink-0 text-amber-400" />
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="rounded border border-white/[0.08] px-1 py-px font-mono text-[7px] tracking-wider text-white/40">
                      {q.channel}
                    </span>
                    <span
                      className={cn(
                        "ml-auto text-[8px]",
                        q.hot ? "text-amber-400/90" : "text-white/25",
                      )}
                    >
                      SLA {q.sla}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="mt-auto pt-2 text-[8px] text-white/25">
              Human handoff · 1 pending
            </p>
          </Panel>

          {/* Copilot workspace */}
          <Panel className="flex flex-col p-3">
            <div className="flex items-center gap-2">
              <Bot size={12} className="text-white/70" />
              <p className="text-[10px] font-medium text-white/70">
                Copilot workspace
              </p>
              <span className="ml-auto rounded-full border border-white/[0.08] px-1.5 py-px font-mono text-[7px] text-white/40">
                nxt-router
              </span>
            </div>

            <div className="mt-2.5 flex flex-col gap-1">
              {copilotSteps.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={reduce ? undefined : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.5 + i * 0.35, ease }}
                  className="flex items-center gap-2 rounded-md border border-white/[0.05] bg-white/[0.02] px-2.5 py-1.5"
                >
                  <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Check size={8} className="text-white/80" />
                  </span>
                  <span className="truncate text-[9.5px] text-white/80">
                    {s.label}
                  </span>
                  <span className="ml-auto shrink-0 font-mono text-[8px] text-white/30">
                    {s.detail}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={reduce ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.9 }}
              className="mt-2.5 rounded-md border border-white/[0.07] bg-black/40 p-2 font-mono text-[8.5px] leading-relaxed text-white/55"
            >
              <span className="text-emerald-300/80">→</span> order.update_address{" "}
              {"{"}
              <br />
              {"  "}order: <span className="text-white/85">"#48291"</span>,
              <br />
              {"  "}field: <span className="text-white/85">"shipping"</span>,
              <br />
              {"  "}value: <span className="text-white/85">"12 MG Road, Bengaluru"</span>,
              <br />
              {"  "}confirmed: <span className="text-white/85">true</span>
              <br />
              {"}"}
            </motion.div>

            <div className="mt-auto flex items-center gap-2 pt-2.5">
              <span className="text-[9px] text-emerald-300/90">96% confidence</span>
              <span className="text-[8px] text-white/30">grounded · 3 sources</span>
              <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[8px] text-white/75">
                Send
              </span>
              <span className="rounded border border-white/10 px-1.5 py-0.5 text-[8px] text-white/35">
                Edit
              </span>
            </div>
          </Panel>

          {/* Automation metrics */}
          <div className="flex min-w-0 flex-col gap-2.5">
            <Panel className="flex flex-1 flex-col justify-between p-3">
              {[
                { label: "Resolved today", value: "1,284", up: true, delta: "12.4%" },
                { label: "Avg handle time", value: "38s", up: true, delta: "41%" },
                { label: "Self-serve deflection", value: "72%", up: true, delta: "3.1%" },
              ].map((k) => (
                <div key={k.label}>
                  <p className="text-[9px] uppercase tracking-wider text-white/35">
                    {k.label}
                  </p>
                  <div className="mt-0.5 flex items-baseline justify-between">
                    <p className="font-display text-base font-bold text-white">
                      {k.value}
                    </p>
                    <Delta up={k.up} value={k.delta} />
                  </div>
                </div>
              ))}
            </Panel>

            <Panel className="flex flex-col gap-2 p-3">
              <p className="text-[10px] font-medium text-white/60">Routing mix</p>
              {routing.map(([label, pct], i) => (
                <div key={label}>
                  <div className="flex justify-between text-[8px] text-white/40">
                    <span>{label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-white/[0.07]">
                    <motion.div
                      className="h-full rounded-full bg-white/45"
                      initial={reduce ? { width: `${pct}%` } : { width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.6 + i * 0.15, ease }}
                    />
                  </div>
                </div>
              ))}
            </Panel>
          </div>
        </div>

        {/* Compliance strip */}
        <div className="flex items-center gap-2 border-t border-white/[0.06] px-4 py-2">
          <Shield size={11} className="text-white/35" />
          <span className="font-mono text-[9px] tracking-wider text-white/35">
            SOC 2 · PII redaction on · audit log streaming
          </span>
          <span className="ml-auto font-mono text-[9px] text-white/25">v2.4.1</span>
        </div>
      </div>
    </div>
  )
}
