import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://greatstack.dev/p/fittrack"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
response = urllib.request.urlopen(req, context=ctx)
html = response.read().decode('utf-8')

# GreatStack project pages usually contain a Google Drive link or direct download
links = re.findall(r'href="([^"]+)"', html)
for l in links:
    if 'drive.google.com' in l or 'github.com' in l or '.zip' in l:
        print("Found link:", l)

