#!/usr/bin/env python3
"""Compare all original source files in uploaded FEW Quest archive to combined checkout."""
import sys,zipfile,hashlib,pathlib
archive=pathlib.Path(sys.argv[1]); root=pathlib.Path(sys.argv[2])
with zipfile.ZipFile(archive) as z:
    entries=[x for x in z.infolist() if not x.is_dir()]
    failed=[]
    for x in entries:
        parts=pathlib.PurePosixPath(x.filename).parts
        if len(parts)<2: continue
        path=root.joinpath(*parts[1:])
        if not path.is_file() or hashlib.sha256(z.read(x)).digest()!=hashlib.sha256(path.read_bytes()).digest(): failed.append('/'.join(parts[1:]))
print(f"Checked {len(entries)} original files; changed/missing: {len(failed)}")
for f in failed:print('FAIL',f)
sys.exit(bool(failed))
