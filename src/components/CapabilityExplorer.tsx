import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Search, X } from "lucide-react";
import {
  capabilities,
  capabilityCategories,
  categoryAliases,
} from "../data/capabilities";
import type { Capability } from "../types/capability";
export function CapabilityExplorer() {
  const [filter, setFilter] =
    useState<(typeof capabilityCategories)[number]>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Capability | null>(null);
  const visible = useMemo(
    () =>
      capabilities.filter(
        (c) =>
          categoryAliases[filter].includes(c.category) &&
          `${c.name} ${c.category} ${c.summary}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [filter, query],
  );
  return (
    <section id="capabilities" className="section capability-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">04 / Capabilities</p>
          <h2>Evidence, not percentages.</h2>
        </div>
        <p>
          Not just technologies I know — things I have actually worked with,
          connected to visible evidence.
        </p>
      </div>
      <CapabilityMap />
      <div className="capability-toolbar">
        <label className="search">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search capabilities"
            aria-label="Search capabilities"
          />
        </label>
        <div className="filter-tabs" aria-label="Filter capabilities">
          {capabilityCategories.map((c) => (
            <button
              key={c}
              className={filter === c ? "active" : ""}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="capability-grid">
        {visible.map((c) => (
          <button
            className="capability-card"
            key={c.id}
            onClick={() => setSelected(c)}
          >
            <span className={`level ${c.status}`}>{c.level}</span>
            <small>{c.category}</small>
            <h3>{c.name}</h3>
            <p>{c.summary}</p>
            <span className="text-link">
              View evidence <ArrowRight size={15} />
            </span>
          </button>
        ))}
      </div>
      {!visible.length && (
        <div className="empty-state">
          <Search />
          <h3>No matching capability</h3>
          <button
            onClick={() => {
              setFilter("All");
              setQuery("");
            }}
          >
            Reset filters
          </button>
        </div>
      )}
      {selected && (
        <CapabilityDetail item={selected} close={() => setSelected(null)} />
      )}
    </section>
  );
}
function CapabilityMap() {
  const groups = [
    { title: "Development", items: ["React", "TypeScript", "Vite"] },
    { title: "Backend", items: ["Node.js", "Express", "Zod", "SQLite"] },
    { title: "Infrastructure", items: ["Server fundamentals"] },
    {
      title: "IT Support",
      items: ["Computer", "Network", "Software", "Users"],
    },
  ];
  return (
    <div className="capability-map" aria-label="Capability relationship map">
      {groups.map((g, i) => (
        <div className="map-branch" key={g.title}>
          <div className="map-node">
            <span>{String(i + 1).padStart(2, "0")}</span>
            <b>{g.title}</b>
          </div>
          <div className="map-children">
            {g.items.map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
function CapabilityDetail({
  item,
  close,
}: {
  item: Capability;
  close: () => void;
}) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        className="modal capability-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="capability-title"
      >
        <button
          className="icon-button close"
          onClick={close}
          aria-label="Close capability"
        >
          <X />
        </button>
        <div className="modal-content">
          <p className="eyebrow">{item.category}</p>
          <h2 id="capability-title">{item.name}</h2>
          <span className={`level ${item.status}`}>{item.level}</span>
          <p className="lead">{item.summary}</p>
          <h3>Evidence</h3>
          <ul className="evidence-list">
            {item.evidence.map((x) => (
              <li key={x}>
                <CheckCircle2 size={17} />
                <span>{x}</span>
              </li>
            ))}
          </ul>
          {item.relatedExperience.length > 0 && (
            <>
              <h3>Related experience</h3>
              {item.relatedExperience.map((x) => (
                <p className="evidence-source" key={x}>
                  {x}
                </p>
              ))}
            </>
          )}
          {item.relatedProjects.length > 0 && (
            <>
              <h3>Used in</h3>
              {item.relatedProjects.map((x) => (
                <p className="evidence-source" key={x}>
                  {x}
                </p>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
