import Dashboard from "@/components/Dashboard";
import { getEvents, getLocations, getMetrics } from "@/lib/data";

export default function Page() {
  const events = getEvents();
  const locations = getLocations();
  const metrics = getMetrics();

  return (
    <main>
      <div className="container">
        <Dashboard events={events} locations={locations} metrics={metrics} />
      </div>
    </main>
  );
}
