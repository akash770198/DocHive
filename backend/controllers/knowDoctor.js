import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const categories = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist'
]

const getDoctorCategory = async (req, res) => {
    const { symptoms } = req.body

    const prompt = `
You are a helpful medical assistant. Based on the following symptoms, suggest the most appropriate doctor category from this list only:
${categories.join(", ")}

If the input is not a list of symptoms or is unrelated, reply with:
"I will only help you knowing your doctor category."

Symptoms: "${symptoms}"
Only return either a single category or the above message.`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const category = response.text().trim();
        res.json({
            success: true,
            category
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: "Something went wrong."
        });
    }
}

export { getDoctorCategory }