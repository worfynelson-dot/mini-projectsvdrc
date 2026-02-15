async function fetchWiki(lang, topic) {
  const res = await fetch(
    `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    let data = await fetchWiki("en", topic);
    let languageUsed = "English";

    if (!data) {
      data = await fetchWiki("id", topic);
      languageUsed = "Indonesia (fallback)";
    }

    if (!data) {
      return res.status(404).json({ error: "Article not found in both languages" });
    }

    return res.status(200).json({
      result: {
        language: languageUsed,
        title: data.title,
        summary: data.extract,
        image: data.thumbnail?.source || null,
        url: data.content_urls?.desktop?.page
      }
    });

  } catch {
    return res.status(500).json({ error: "Failed to fetch data" });
  }
    }
