import re

with open('frontend/src/pages/FoodLogs.tsx', 'r') as f:
    content = f.read()

replacement = """
            let result = null;
            let lastError = null;
            
            // Dynamically fetch available models to guarantee we don't get 404 for deprecated models
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            const modelsData = await res.json();
            
            if (!modelsData.models) {
                throw new Error("Failed to fetch available Gemini models from API.");
            }
            
            // Filter for supported flash/pro models that support generateContent
            let availableModels = modelsData.models
                .filter((m: any) => m.name.includes("flash") || m.name.includes("pro"))
                .filter((m: any) => m.supportedGenerationMethods.includes("generateContent"))
                .map((m: any) => m.name.replace('models/', ''));
            
            if (availableModels.length === 0) {
                 availableModels = ['gemini-1.5-flash']; // Fallback
            }
            
            // Sort to prefer flash models for speed
            availableModels.sort((a: string, b: string) => {
                if (a.includes('flash') && !b.includes('flash')) return -1;
                if (!a.includes('flash') && b.includes('flash')) return 1;
                return 0;
            });

            console.log("Dynamically found models:", availableModels);
            
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve) => {
                reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                reader.readAsDataURL(file);
            });
            const base64Data = await base64Promise;
            const imagePart = { inlineData: { data: base64Data, mimeType: file.type } };

            const prompt = `Analyze this food image. Return ONLY a valid JSON object with EXACTLY these keys: "name" (string, the food name), "calories" (number, estimated calories).`;

            for (const m of availableModels) {
                try {
                    const model = genAI.getGenerativeModel({ model: m });
                    result = await model.generateContent([prompt, imagePart]);
                    if (result) break;
                } catch(err: any) {
                    console.warn(`Failed model ${m}: ${err.message}`);
                    lastError = err.message;
                }
            }

            if (!result) throw new Error("AI analysis failed on all available models. Last error: " + lastError);
"""

# Replace everything from `let result = null;` up to `if (!result) throw new Error`
content = re.sub(
    r'let result = null;.*if \(!result\) throw new Error\([^)]+\);',
    replacement.strip(),
    content,
    flags=re.DOTALL
)

with open('frontend/src/pages/FoodLogs.tsx', 'w') as f:
    f.write(content)
