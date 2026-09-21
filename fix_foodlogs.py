import re

with open('frontend/src/pages/FoodLogs.tsx', 'r') as f:
    content = f.read()

# Remove GoogleGenerativeAI import if exists
content = re.sub(r"import\s+\{\s*GoogleGenerativeAI\s*\}\s+from\s+'@google/generative-ai';\n?", "", content)

replacement = """
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const startTime = Date.now();
        setAiLoading(true);
        try {
            console.log(`[Food AI] Starting image compression...`);
            const base64Data = await compressImage(file);
            console.log(`[Food AI] Image compression took ${Date.now() - startTime}ms`);

            console.log(`[Food AI] Calling backend...`);
            const aiStartTime = Date.now();
            const res = await api.post('/analyze-food', { imageBase64: base64Data }, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            console.log(`[Food AI] Backend processing took ${Date.now() - aiStartTime}ms`);

            const parsed = res.data.data;
            if (!parsed || !parsed.name || parsed.calories === undefined) {
                throw new Error("Invalid response format from backend.");
            }

            setFormData({
                name: parsed.name,
                calories: parsed.calories.toString(),
                mealType: 'snack'
            });
            console.log(`[Food AI] Total processing time: ${(Date.now() - startTime) / 1000} seconds`);

        } catch (error: any) {
            console.error("Food analysis error:", error);
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
