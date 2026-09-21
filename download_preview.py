import urllib.request
import re
import os
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://fitness-gs.vercel.app"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
response = urllib.request.urlopen(req, context=ctx)
html = response.read().decode('utf-8')

with open('preview_index.html', 'w') as f:
    f.write(html)

# find JS and CSS
js_files = re.findall(r'src="([^"]+\.js)"', html)
css_files = re.findall(r'href="([^"]+\.css)"', html)

os.makedirs('preview_assets', exist_ok=True)

for js in js_files:
    js_url = url + js if js.startswith('/') else url + '/' + js
    print("Downloading", js_url)
    res = urllib.request.urlopen(urllib.request.Request(js_url, headers={'User-Agent': 'Mozilla/5.0'}), context=ctx)
    with open('preview_assets/app.js', 'wb') as f:
        f.write(res.read())

for css in css_files:
    css_url = url + css if css.startswith('/') else url + '/' + css
    print("Downloading", css_url)
    res = urllib.request.urlopen(urllib.request.Request(css_url, headers={'User-Agent': 'Mozilla/5.0'}), context=ctx)
    with open('preview_assets/app.css', 'wb') as f:
        f.write(res.read())

print("Downloaded.")
