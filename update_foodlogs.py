import re

with open('frontend/src/pages/FoodLogs.tsx', 'r') as f:
    content = f.read()

replacement = """
            let lastError = null;
            for (const m of modelsToTry) {
                try {
                    const model = genAI.getGenerativeModel({ model: m });
                    result = await model.generateContent([prompt, imagePart]);
                    if (result) break;
                } catch(err: any) {
                    console.log(`Failed model: ${m} - ${err.message}`);
                    lastError = err.message;
                }
            }

            if (!result) throw new Error("AI analysis failed. Last error: " + lastError);
"""

content = re.sub(
    r'for \(const m of modelsToTry\) \{.*if \(!result\) throw new Error\("AI analysis failed\."\);',
    replacement.strip(),
    content,
    flags=re.DOTALL
)

with open('frontend/src/pages/FoodLogs.tsx', 'w') as f:
    f.write(content)
