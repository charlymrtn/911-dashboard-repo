"use client";

import { useMemo, useState } from "react";
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type EventItem = {
  event_id: string;
  sequence: number;
  timestamp_local: string;
  timestamp_utc: string;
  title: string;
  type: string;
  location_id: string;
  fatalities_estimated: number;
  summary: string;
  tags: string[];
};

type LocationItem = {
  location_id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
};

type MetricItem = {
  metric_key: string;
  label: string;
  value: number | string;
  unit: string;
  notes: string;
};

export default function Dashboard({
  events,
  locations,
  metrics
}: {
  events: EventItem[];
  locations: LocationItem[];
  metrics: MetricItem[];
}) {
  const [index, setIndex] = useState(0);
  const currentEvent = events[index];

  const locationMap = useMemo(
    () => Object.fromEntries(locations.map((loc) => [loc.location_id, loc])),
    [locations]
  );

  const chartData = useMemo(() => {
    const aggregate = events.reduce<Record<string, number>>((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(aggregate).map(([type, count]) => ({
      type,
      count
    }));
  }, [events]);

  const totalKnownFatalities = events.reduce(
    (acc, event) => acc + event.fatalities_estimated,
    0
  );

  return (
    <>
      <section className="hero">
        <span className="badge">MVP · Timeline interactivo · Next.js + Mongo</span>
        <h1>Dashboard 9/11</h1>
        <p className="small">
          Vista cronológica de eventos, métricas agregadas y dataset enriquecido
          listo para explotación en MongoDB.
        </p>
      </section>

      <section className="grid kpis">
        {metrics.map((metric) => (
          <article className="card" key={metric.metric_key}>
            <div className="kpi-label">{metric.label}</div>
            <div className="kpi-value">
              {metric.value}
              {metric.unit ? ` ${metric.unit}` : ""}
            </div>
            <div className="small">{metric.notes}</div>
          </article>
        ))}
        <article className="card">
          <div className="kpi-label">Eventos cargados</div>
          <div className="kpi-value">{events.length}</div>
          <div className="small">Total de hitos cronológicos en el dataset.</div>
        </article>
        <article className="card">
          <div className="kpi-label">Fatalidades estimadas del timeline</div>
          <div className="kpi-value">{totalKnownFatalities}</div>
          <div className="small">
            Suma de estimaciones a nivel evento dentro de este dataset.
          </div>
        </article>
      </section>

      <section className="two-columns" style={{ marginTop: 16 }}>
        <article className="card">
          <h2>Timeline interactivo</h2>
          <div className="timeline-controls">
            <div className="timeline-meta">
              <div>
                <strong>{currentEvent.timestamp_local}</strong>
                <div className="small">{currentEvent.timestamp_utc}</div>
              </div>
              <div className="small">
                Hito {index + 1} de {events.length}
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={events.length - 1}
              value={index}
              onChange={(e) => setIndex(Number(e.target.value))}
            />

            <div>
              <h3>{currentEvent.title}</h3>
              <p>{currentEvent.summary}</p>
              <div className="small">
                <strong>Tipo:</strong> {currentEvent.type}
              </div>
              <div className="small">
                <strong>Ubicación:</strong>{" "}
                {locationMap[currentEvent.location_id]?.name} ·{" "}
                {locationMap[currentEvent.location_id]?.city},{" "}
                {locationMap[currentEvent.location_id]?.state}
              </div>
              <div className="small">
                <strong>Coordenadas:</strong>{" "}
                {locationMap[currentEvent.location_id]?.lat},{" "}
                {locationMap[currentEvent.location_id]?.lng}
              </div>
              <div className="small">
                <strong>Fatalidades estimadas:</strong>{" "}
                {currentEvent.fatalities_estimated}
              </div>
              <div style={{ marginTop: 10 }}>
                {currentEvent.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article className="card">
          <h2>Eventos por tipo</h2>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <h2>Tabla de eventos</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Hora local</th>
                <th>Título</th>
                <th>Tipo</th>
                <th>Ubicación</th>
                <th>Fatalidades estimadas</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => {
                const location = locationMap[event.location_id];
                return (
                  <tr key={event.event_id}>
                    <td>{event.sequence}</td>
                    <td>{event.timestamp_local}</td>
                    <td>{event.title}</td>
                    <td>{event.type}</td>
                    <td>
                      {location?.name}
                      <br />
                      <span className="small">
                        {location?.city}, {location?.state}
                      </span>
                    </td>
                    <td>{event.fatalities_estimated}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
