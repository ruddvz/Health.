#!/usr/bin/env python3
"""Write minimal solid-colour PNGs (stdlib only) for PWA icons."""
import struct, zlib

def chunk(tag, data):
    return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

def write_png(path, w, h, rgb):
    r, g, b = rgb
    raw = b"".join([b"\x00" + bytes([r, g, b]) * w for _ in range(h)])
    comp = zlib.compress(raw, 9)
    ihdr = struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)
    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", comp) + chunk(b"IEND", b"")
    with open(path, "wb") as f:
        f.write(png)

import os
os.makedirs("/workspace/assets/icons", exist_ok=True)
# Lime app icons
write_png("/workspace/assets/icons/icon-192.png", 192, 192, (0xD4, 0xF5, 0x3C))
write_png("/workspace/assets/icons/icon-512.png", 512, 512, (0xD4, 0xF5, 0x3C))
