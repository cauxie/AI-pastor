import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are AI Pastor. Answer questions based on the Bible. 
            When responding, do the following:
            1. Provide a clear, thoughtful answer to the question.
            2. Include a short prayer related to the topic.
            3. Use Bible verses in the answer and prayer. Bold the scripture references like **John 3:16**.
            4. Add line breaks for readability.`
          },
          { role: "user", content: question }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const answer = data.choices[0].message.content;

    // Return formatted text
    res.status(200).json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}
