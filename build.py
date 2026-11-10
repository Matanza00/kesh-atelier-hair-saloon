# Builds index.html for Vercel from the artifact source page (which has no <html>/<head> of its own).
import sys, re
src, out = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
cut = s.index('</style>') + len('</style>')
head, body = s[:cut], s[cut:]
head = head.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '')
og = ('<meta property="og:title" content="Kesh Atelier · Hair & Beauty Salon in Kalispell, MT">\n'
      '<meta property="og:description" content="Precision cuts, hand-mixed color, styling and treatments. Book online or talk to Ava, our virtual receptionist.">\n'
      '<meta property="og:image" content="/hero/f080.webp">\n<meta name="theme-color" content="#171412">\n'
      '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Ccircle cx=%2232%22 cy=%2232%22 r=%2230%22 fill=%22%23171412%22/%3E%3Ctext x=%2232%22 y=%2242%22 font-size=%2230%22 text-anchor=%22middle%22 fill=%22%23c6a165%22 font-family=%22Georgia%22%3EK%3C/text%3E%3C/svg%3E">\n')
doc = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
       '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
       + head.replace('<title>Kesh Atelier</title>', '<title>Kesh Atelier · Hair & Beauty Salon, Kalispell MT</title>') + '\n' + og +
       '</head>\n<body>\n' + body.strip() + '\n</body>\n</html>\n')
open(out, 'w', encoding='utf-8').write(doc)
print('built', out, len(doc))
