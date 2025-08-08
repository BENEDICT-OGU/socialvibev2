import { useState } from "react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
  try {
    const res = await fetch("https://socialvibebackend-5.onrender.com/api/image/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Server error response:", text);
      throw new Error("Failed to generate image");
    }

    const data = await res.json();
    setImageUrl(data.imageUrl);
  } catch (err) {
    console.error("Image generation failed:", err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-lg mx-auto mt-8 p-4">
      <h2 className="text-xl font-bold mb-2">AI Image Generator</h2>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full border p-2 mb-4"
        placeholder="e.g. A futuristic city with flying cars"
      />
      <button
        onClick={generateImage}
        className="bg-pink-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {imageUrl && (
        <div className="mt-6">
          <img src={imageUrl} alt="Generated" className="rounded shadow-lg w-full" />
        </div>
      )}
    </div>
  );
}
