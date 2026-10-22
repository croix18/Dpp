# Rezips "DPP Google Forms 2026-27" the way stepD.py --finish does (same order and timestamps),
# after files in the folder were changed by hand or reverted to the committed versions.
import os, zipfile, time
ROOT = '/home/claude/dpp/'
OUT = ROOT + 'DPP Google Forms 2026-27/'
zp = ROOT + 'DPP Google Forms 2026-27.zip'
files = [os.path.join(dp, f) for dp, dn, fn in os.walk(OUT) for f in fn]
files.sort(key=lambda p: [x.replace('Build sheet.pdf', '0 Build sheet.pdf') for x in os.path.relpath(p, OUT).split(os.sep)])
t0 = time.mktime((2026, 10, 11, 8, 0, 0, 0, 0, -1))
with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as z:
    for i, f in enumerate(files):
        zi = zipfile.ZipInfo(os.path.relpath(f, ROOT), date_time=time.localtime(t0 + i * 2)[:6])
        zi.compress_type = zipfile.ZIP_DEFLATED
        z.writestr(zi, open(f, 'rb').read())
print('zip', round(os.path.getsize(zp) / 1e6, 1), 'MB,', len(files), 'files')
