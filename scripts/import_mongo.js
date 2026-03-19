const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const uri = process.env.MONGODB_URI || "mongodb://mongo:27017";
const dbName = process.env.MONGODB_DB || "nine_eleven";

async function loadJson(relativePath) {
  const filePath = path.join(__dirname, "..", relativePath);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    const datasets = [
      { collection: "events", file: "data/mongo/events.json" },
      { collection: "locations", file: "data/mongo/locations.json" },
      { collection: "metrics", file: "data/mongo/metrics.json" }
    ];

    for (const dataset of datasets) {
      const docs = await loadJson(dataset.file);
      const col = db.collection(dataset.collection);

      await col.deleteMany({});
      if (docs.length > 0) {
        await col.insertMany(docs);
      }

      console.log(`Colección ${dataset.collection}: ${docs.length} documentos importados.`);
    }

    await db.collection("events").createIndex({ sequence: 1 }, { unique: true });
    await db.collection("events").createIndex({ type: 1 });
    await db.collection("events").createIndex({ location_id: 1 });
    await db.collection("locations").createIndex({ location_id: 1 }, { unique: true });
    await db.collection("metrics").createIndex({ metric_key: 1 }, { unique: true });

    console.log("Importación completada.");
  } catch (error) {
    console.error("Error importando dataset:", error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
