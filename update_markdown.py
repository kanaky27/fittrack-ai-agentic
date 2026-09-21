import re

with open('frontend/src/pages/AICoach.tsx', 'r') as f:
    content = f.read()

replacement = """
    const formatMessage = (text: string) => {
        const lines = text.split('\\n');
        return lines.map((line, i) => {
            let formattedLine = line.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
            
            if (formattedLine.startsWith('# ')) {
                return <h1 key={i} className="text-xl font-bold mb-2 mt-4" dangerouslySetInnerHTML={{ __html: formattedLine.substring(2) }} />;
            } else if (formattedLine.startsWith('## ')) {
                return <h2 key={i} className="text-lg font-bold mb-2 mt-3" dangerouslySetInnerHTML={{ __html: formattedLine.substring(3) }} />;
            } else if (formattedLine.startsWith('### ')) {
                return <h3 key={i} className="font-bold mb-1 mt-2" dangerouslySetInnerHTML={{ __html: formattedLine.substring(4) }} />;
            } else if (formattedLine.startsWith('* ') || formattedLine.startsWith('- ')) {
                return <li key={i} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: formattedLine.substring(2) }} />;
            } else if (formattedLine.trim() === '') {
                return <div key={i} className="h-2" />;
            } else {
                return <p key={i} className="mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
            }
        });
    };
"""

content = re.sub(
    r'const formatMessage = \(text: string\) => \{.*?return lines\.map.*?\}\);\n    \};',
    replacement.strip(),
    content,
    flags=re.DOTALL
)

with open('frontend/src/pages/AICoach.tsx', 'w') as f:
    f.write(content)
