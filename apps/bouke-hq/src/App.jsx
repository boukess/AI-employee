import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Play, RefreshCw } from "lucide-react";

const { Milestone, MetricEntry, Job } = base44.entities;

const METRICS = [
  ["revenue_usd", "Revenue ($)"],
  ["clients", "Paying clients"],
  ["shorts_posted", "Shorts posted"],
  ["long_videos_posted", "Long videos posted"],
  ["outreach_sent", "Outreach sent"],
  ["replies", "Replies"],
  ["followers", "Followers"],
  ["portfolio_pieces", "Portfolio pieces"],
  ["products_live", "Products live"],
];
const COUNTERS = new Set(["revenue_usd", "shorts_posted", "long_videos_posted", "outreach_sent", "replies"]);

const JOBS = [
  ["edit_inbox_videos", "Edit inbox videos", "Cut clips in the Video Editor inbox into posting ready shorts"],
  ["make_thumbnails", "Make thumbnails", "Thumbnails for finished long form videos"],
  ["product_photos", "Product photos", "Studio shots from photos in the product inbox"],
  ["seo_check", "SEO check", "Site sweep of frbouke.com"],
  ["draft_outreach", "Draft outreach", "Shorts Starter emails saved as Gmail drafts, never sent"],
  ["daily_brief", "Daily brief", "Chief of Staff brief on what moved and what stopped"],
];

const STARTER_MILESTONES = [
  ["Submit frbouke.com/sitemap.xml to Google Search Console", "website"],
  ["Add 5 to 10 real pieces to the Work page", "photo"],
  ["Film shorts 1 and 2 from content week 1", "content"],
  ["Post first 3 shorts", "content"],
  ["Pick 5 creators and send the first outreach emails", "sales"],
  ["Add the Shopify Storefront token on Vercel and publish one product", "shop"],
  ["Land the first paying client", "sales"],
];

const today = () => new Date().toISOString().slice(0, 10);

function Card({ title, children, action }) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Metrics() {
  const [entries, setEntries] = useState([]);
  const [metric, setMetric] = useState("revenue_usd");
  const [value, setValue] = useState("");
  const load = async () => setEntries(await MetricEntry.list("-date", 500));
  useEffect(() => { load(); }, []);

  const latest = {};
  const total = {};
  for (const e of [...entries].reverse()) {
    latest[e.metric] = e.value;
    total[e.metric] = (total[e.metric] || 0) + Number(e.value || 0);
  }

  const add = async (ev) => {
    ev.preventDefault();
    const n = Number(value);
    if (value === "" || !isFinite(n)) return;
    await MetricEntry.create({ date: today(), metric, value: n });
    setValue("");
    load();
  };

  return (
    <Card title="Numbers">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        {METRICS.map(([k, label]) => (
          <div key={k} className="rounded-lg bg-slate-50 p-3">
            <div className="text-xs text-slate-500">{label}{COUNTERS.has(k) ? " (total)" : ""}</div>
            <div className="text-2xl font-semibold text-slate-900">
              {k in latest ? (COUNTERS.has(k) ? total[k] : latest[k]).toLocaleString() : "0"}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={add} className="flex flex-wrap gap-2">
        <select value={metric} onChange={(e) => setMetric(e.target.value)} className="h-10 rounded-md border border-slate-200 px-2 bg-white">
          {METRICS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <Input type="number" step="any" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value" className="w-28 h-10" />
        <Button type="submit" className="h-10"><Plus className="w-4 h-4 mr-1" />Log today</Button>
      </form>
      <p className="text-xs text-slate-500 mt-2">Totals add up every entry. Followers, clients, portfolio and products show the latest value.</p>
    </Card>
  );
}

function Milestones() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const load = async () => setItems(await Milestone.list("created_date", 200));
  useEffect(() => { load(); }, []);

  const seed = async () => {
    for (const [t, area] of STARTER_MILESTONES) await Milestone.create({ title: t, area, done: false });
    load();
  };
  const add = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await Milestone.create({ title: title.trim(), done: false });
    setTitle("");
    load();
  };
  const done = items.filter((i) => i.done).length;

  return (
    <Card title={items.length ? `Milestones (${done} of ${items.length})` : "Milestones"}>
      {items.length > 0 && (
        <div className="h-2 rounded bg-slate-100 mb-4 overflow-hidden">
          <div className="h-full bg-orange-500" style={{ width: `${(done / items.length) * 100}%` }} />
        </div>
      )}
      {items.length === 0 && (
        <Button variant="outline" onClick={seed} className="mb-4">Load the BOUKE launch checklist</Button>
      )}
      <ul className="space-y-2 mb-4">
        {items.map((m) => (
          <li key={m.id} className="group flex items-center gap-3">
            <Checkbox checked={m.done} onCheckedChange={async (c) => { await Milestone.update(m.id, { done: !!c }); load(); }} />
            <span className={`flex-1 ${m.done ? "line-through text-slate-400" : "text-slate-700"}`}>{m.title}</span>
            {m.area && <span className="text-xs rounded bg-slate-100 px-2 py-0.5 text-slate-500">{m.area}</span>}
            <button aria-label="Delete" onClick={async () => { await Milestone.delete(m.id); load(); }} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={add} className="flex gap-2">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a milestone" className="h-10" />
        <Button type="submit" className="h-10"><Plus className="w-4 h-4" /></Button>
      </form>
    </Card>
  );
}

const STATUS_STYLE = {
  queued: "bg-slate-100 text-slate-600",
  running: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  canceled: "bg-slate-100 text-slate-400",
};

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [notes, setNotes] = useState("");
  const load = async () => setJobs(await Job.list("-created_date", 30));
  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, []);

  const queue = async (kind) => {
    const data = { kind, status: "queued" };
    if (notes.trim()) data.notes = notes.trim();
    await Job.create(data);
    setNotes("");
    load();
  };
  const label = Object.fromEntries(JOBS.map(([k, l]) => [k, l]));

  return (
    <Card title="Run on my PC" action={<button onClick={load} aria-label="Refresh" className="text-slate-400 hover:text-slate-700"><RefreshCw className="w-4 h-4" /></button>}>
      <p className="text-sm text-slate-500 mb-3">Each button adds a job. The worker on IBP_Desktop picks it up within a few minutes. Nothing is sent, posted or paid for; drafts wait for you.</p>
      <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes for the next job" className="h-10 mb-3" />
      <div className="grid sm:grid-cols-2 gap-2 mb-5">
        {JOBS.map(([k, l, d]) => (
          <button key={k} onClick={() => queue(k)} className="text-left rounded-lg border border-slate-200 p-3 hover:border-orange-400 hover:bg-orange-50/40 transition">
            <div className="flex items-center gap-2 font-medium text-slate-900"><Play className="w-4 h-4 text-orange-500" />{l}</div>
            <div className="text-xs text-slate-500 mt-1">{d}</div>
          </button>
        ))}
      </div>
      <ul className="space-y-2">
        {jobs.length === 0 && <li className="text-sm text-slate-400">No jobs yet.</li>}
        {jobs.map((j) => (
          <li key={j.id} className="rounded-lg border border-slate-100 p-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-800 flex-1">{label[j.kind] || j.kind}</span>
              <span className={`text-xs rounded px-2 py-0.5 ${STATUS_STYLE[j.status] || ""}`}>{j.status}</span>
              {j.status === "queued" && (
                <button onClick={async () => { await Job.update(j.id, { status: "canceled" }); load(); }} className="text-xs text-slate-400 hover:text-red-500">cancel</button>
              )}
            </div>
            {j.notes && <div className="text-xs text-slate-500 mt-1">Notes: {j.notes}</div>}
            {j.result && <pre className="text-xs text-slate-600 mt-2 whitespace-pre-wrap max-h-40 overflow-auto">{j.result}</pre>}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function App() {
  const [user, setUser] = useState(undefined);
  useEffect(() => { base44.auth.me().then(setUser).catch(() => setUser(null)); }, []);

  if (user === undefined) return <div className="min-h-screen grid place-items-center text-slate-400">Loading</div>;
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen grid place-items-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold mb-2">BOUKE HQ</h1>
          <p className="text-slate-500 mb-4">This dashboard is private to the BOUKE owner.</p>
          {!user && <Button onClick={() => base44.auth.redirectToLogin(window.location.href)}>Sign in</Button>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">BOUKE HQ</h1>
          <p className="text-slate-500">Progress, milestones and jobs for your AI employees.</p>
        </header>
        <Metrics />
        <div className="grid md:grid-cols-2 gap-6">
          <Milestones />
          <Jobs />
        </div>
      </div>
    </div>
  );
}
