const {
    GoogleGenerativeAI,
  } = require("@google/generative-ai");
  





export async function runGemini(data: any, apiKey: string) {
    
    console.log("API Key: ", apiKey);
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
    });

    const generationConfig = {
        "temperature": 0,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 819200,
        "response_mime_type": "text/plain",
    }


    const chatSession = model.startChat({
        generationConfig,
        history: [
            {
                role: "user",
                parts: [
                    {text: "The task is to update each object in the array of data by adding new key 'classify'. The value of this key should be one of the following: 'important', 'less important', 'promotion', 'spam', or 'not spam'. This classification should be based on the email sender's ID and the content of the subject. IMPORTANT: JUST GIVE ME THE ARRAY AND NO EXPLANATION/MARKDOWN."},
                ],
            },
            {
                role: "model",
                parts: [
                    {text: "Ok, I will update the Emailresponses and provide you with the updated data object. Please provide the data."},
                ],
            },
        ],
    });

    const result = await chatSession.sendMessage(JSON.stringify(data));
    // console.log(JSON.parse(result.response.text()));
    return JSON.parse(result.response.text());
}

