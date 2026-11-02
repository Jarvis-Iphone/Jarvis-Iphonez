export default {
  async fetch(request, env) {
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "https://jarvis-iphone.github.io",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Cache-Control": "no-store"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== "POST") {
      return Response.json({ error: "POST required" }, { status: 405, headers });
    }

    const token = request.headers.get("Authorization");
    if (!env.JARVIS_ACCESS_TOKEN || token !== "Bearer " + env.JARVIS_ACCESS_TOKEN) {
      return Response.json({ error: "Unauthorized" }, { status: 401, headers });
    }

    if (!env.OPENAI_API_KEY) {
      return Response.json({ error: "OpenAI key missing" }, { status: 500, headers });
    }

    try {
      const body = await request.json();
      const message = String(body.message || "").trim().slice(0, 2000);
      if (!message) {
        return Response.json({ error: "Message missing" }, { status: 400, headers });
      }

      const result = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + env.OPENAI_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          instructions: "Du bist JARVIS, ein freundlicher, hilfreicher deutschsprachiger KI-Assistent auf einem iPhone. Antworte klar und kompakt.",
          input: message,
          max_output_tokens: 400
        })
      });

      const data = await result.json();
      if (!result.ok) {
        return Response.json({ error: "KI-Anfrage fehlgeschlagen", status: result.status }, { status: 502, headers });
      }

      const answer = (data.output || [])
        .flatMap(item => item.content || [])
        .filter(item => item.type === "output_text")
        .map(item => item.text)
        .join("\n");

      return Response.json({ reply: answer || "Keine Antwort erhalten." }, { headers });
    } catch (error) {
      return Response.json({ error: "Verarbeitung fehlgeschlagen" }, { status: 500, headers });
    }
  }
};
