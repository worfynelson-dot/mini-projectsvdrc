export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`
    );

    if (!response.ok) {
      return res.status(404).json({ error: "Article not found" });
    }

    const data = await response.json();

    return res.status(200).json({
      result: {
        language: "English",
        title: data.title,
        summary: data.extract,
        url: data.content_urls?.desktop?.page
      }
    });

  } catch {
    return res.status(500).json({ error: "Failed to fetch data" });
  }
}
