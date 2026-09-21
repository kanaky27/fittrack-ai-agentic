import re

with open('frontend/src/pages/FoodLogs.tsx', 'r') as f:
    content = f.read()

replacement = """
    const compressImage = async (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    
                    // Compress to JPEG 70% quality
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(dataUrl.split(',')[1]);
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const startTime = Date.now();
        setAiLoading(true);
        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is missing");

            console.log(`[Food AI] Starting image compression...`);
            const base64Data = await compressImage(file);
            console.log(`[Food AI] Image compression took ${Date.now() - startTime}ms`);

            const genAI = new GoogleGenerativeAI(apiKey);
            let result = null;
            let lastError = null;
            
            const availableModels = ['gemini-1.5-flash', 'gemini-2.5-flash', 'gemini-1.5-pro'];

            const imagePart = { inlineData: { data: base64Data, mimeType: 'image/jpeg' } };

            const prompt = `Analyze this food image. Return ONLY a valid JSON object with exactly these keys: "name" (string, the food name), "calories" (number, estimated calories). Do not use markdown.`;

            const aiStartTime = Date.now();
            console.log(`[Food AI] Calling Gemini...`);
            for (const m of availableModels) {
                try {
                    const model = genAI.getGenerativeModel({ 
                        model: m,
                        generationConfig: { responseMimeType: "application/json" }
                    });
                    result = await model.generateContent([prompt, imagePart]);
                    if (result) break;
                } catch(err: any) {
                    console.warn(`Failed model ${m}: ${err.message}`);
                    lastError = err.message;
                }
            }
            console.log(`[Food AI] Gemini processing took ${Date.now() - aiStartTime}ms`);

            if (!result) throw new Error("AI analysis failed on all available models. Last error: " + lastError);
            
            let text = result.response.text().trim();
            const parsed = JSON.parse(text);

            setFormData({
                name: parsed.name,
                calories: parsed.calories.toString(),
                mealType: 'snack'
            });
            console.log(`[Food AI] Total processing time: ${(Date.now() - startTime) / 1000} seconds`);

        } catch (error: any) {
            console.error(error);
            alert("The AI service is temporarily unavailable. Please try again.");
        } finally {
            setAiLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };
"""

content = re.sub(
    r'const handleImageUpload = async \(e: React.ChangeEvent<HTMLInputElement>\) => \{.*?\n    \};',
    replacement.strip(),
    content,
    flags=re.DOTALL
)

with open('frontend/src/pages/FoodLogs.tsx', 'w') as f:
    f.write(content)
