/**
 * apiBridge.js
 * Communicates with backend object detection + LLaMA API via Hugging Face Inference Router
 * Location: OBRD/static/js/apiBridge.js
 */

const HF_API_TOKEN = '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'; // Replace with your token
const DETECTION_MODEL_ID = 'facebook/detr-resnet-50';   // Change if needed
const LLM_MODEL_ID = 'meta-llama/Llama-2-70b-chat-hf'; // Example LLaMA 4 model; change accordingly

// Detection API call
export async function detectObjectsFromServer(frameBlob) {
  try {
    const arrayBuffer = await frameBlob.arrayBuffer();

    const response = await fetch(`https://router.huggingface.co/hf-inference/${DETECTION_MODEL_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/octet-stream',
        'Accept': 'application/json'
      },
      body: arrayBuffer
    });

    if (!response.ok) throw new Error(`HuggingFace Detection API error: ${response.status}`);
    const predictions = await response.json();
    return predictions;
  } catch (error) {
    console.error('Detection error:', error);
    return [];
  }
}

// LLaMA description generation API call
export async function generateDescription(detectedObjects) {
  /*
  detectedObjects: Array of strings or labels detected.
  Example: ["book", "ladybird", "leaf"]
  */

  const prompt = `Describe the following objects in one sentence: ${detectedObjects.join(', ')}`;

  try {
    const response = await fetch(`https://router.huggingface.co/hf-inference/${LLM_MODEL_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    });

    if (!response.ok) throw new Error(`HuggingFace LLM API error: ${response.status}`);
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      return data[0].generated_text;
    } else if (data.generated_text) {
      return data.generated_text;
    }
    return "No description generated.";
  } catch (error) {
    console.error('LLM generation error:', error);
    return "Description unavailable.";
  }
}

// Optional: Basic health/status check for API availability
export async function getServerStatus() {
  try {
    const response = await fetch(`https://router.huggingface.co/hf-inference/${DETECTION_MODEL_ID}`, {
      method: 'HEAD',
      headers: { 'Authorization': `Bearer ${HF_API_TOKEN}` }
    });
    return { online: response.ok };
  } catch {
    return { online: false };
  }
}
