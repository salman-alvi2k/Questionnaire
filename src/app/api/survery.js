import { MongoClient } from "mongodb";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const connectToDatabase = async () => {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client;
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const client = await connectToDatabase();
      const db = client.db(process.env.MONGODB_DB);

      await db.collection("survey_responses").insertOne({
        ...req.body,
        createdAt: new Date(),
      });

      await supabase
        .from("survey_progress")
        .update({ status: "completed" })
        .eq("email", req.body.email);

      await client.close();
      res.status(200).json({ message: "Survey completed successfully" });
    } catch {
      res.status(500).json({ error: "Error processing survey" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
