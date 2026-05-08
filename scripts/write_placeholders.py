#!/usr/bin/env python3
"""Write solid-colour PNGs for PWA icons and screenshots (stdlib only). Plan0 palette accent #3DDB7A."""
import os
import struct
import zlib


def chunk(tag, data):
    return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)


def write_png(path, w, h, rgb, rows=None):
    """rows: optional list of bytes per row (with filter byte), length h. If None, solid rgb."""
    r, g, b = rgb
    if rows is None:
        raw = b"".join([b"\x00" + bytes([r, g, b]) * w for _ in range(h)])
    else:
        raw = b"".join(rows)
    comp = zlib.compress(raw, 9)
    ihdr = struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)
    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", comp) + chunk(b"IEND", b"")
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "wb") as f:
        f.write(png)


# Plan0 accent green
ACCENT = (0x3D, 0xDB, 0x7A)
DEEP_BG = (0x0A, 0x0F, 0x0D)

# Icon sizes for manifest
ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

os.makedirs("/workspace/icons", exist_ok=True)
os.makedirs("/workspace/screenshots", exist_ok=True)
os.makedirs("/workspace/assets/icons", exist_ok=True)

for sz in ICON_SIZES:
    write_png(f"/workspace/icons/icon-{sz}.png", sz, sz, ACCENT)
    if sz in (192, 512):
        write_png(f"/workspace/assets/icons/icon-{sz}.png", sz, sz, ACCENT)

# Maskable: same solid (safe zone would need padding; solid passes stores)
write_png("/workspace/icons/maskable-512.png", 512, 512, ACCENT)

# Screenshots (minimal branded placeholders)
write_png("/workspace/screenshots/mobile-home.png", 390, 844, DEEP_BG)
write_png("/workspace/screenshots/desktop-home.png", 1280, 720, DEEP_BG)

print("Wrote icons/, screenshots/, assets/icons/")
