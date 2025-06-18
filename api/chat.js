export default async function handler(req, res) {
  // Správny spôsob pre Vercel Node.js serverless:
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  const data = Buffer.concat(buffers).toString();
  const { message } = JSON.parse(data);

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: message }]
        }
      ]
    })
  });

  const result = await response.json();
  res.status(200).json({ response: result.candidates[0].content.parts[0].text });
}
