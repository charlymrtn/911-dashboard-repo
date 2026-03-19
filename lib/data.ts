import events from "@/data/mongo/events.json";
import locations from "@/data/mongo/locations.json";
import metrics from "@/data/mongo/metrics.json";

export function getEvents() {
  return events.sort((a, b) => a.sequence - b.sequence);
}

export function getLocations() {
  return locations;
}

export function getMetrics() {
  return metrics;
}
