#!/usr/bin/env python3
"""Pixel-art sprite generator for the RPG quest video."""
from PIL import Image, ImageDraw
import os

OUT = os.path.expanduser("~/workspace/video/rialo-rpg/public/sprites")
os.makedirs(OUT, exist_ok=True)

PAL = {
    '.': None,
    'k': (26, 28, 44), 's': (255, 204, 170), 'h': (59, 91, 219),
    'H': (130, 160, 255), 'j': (57, 64, 110), 'J': (85, 95, 145),
    'p': (74, 78, 105), 'b': (34, 34, 59), 'e': (26, 28, 44),
    'w': (255, 255, 255), 'r': (230, 57, 70), 'g': (138, 201, 38),
    'G': (106, 153, 78), 'd': (198, 142, 94), 'D': (165, 115, 75),
    't': (56, 102, 65), 'T': (95, 140, 95), 'n': (127, 85, 57),
    'N': (165, 110, 70), 'm': (169, 221, 211), 'y': (255, 209, 102),
    'Y': (230, 170, 60), 'v': (120, 95, 170), 'V': (155, 125, 200),
    'o': (205, 205, 215), 'O': (150, 150, 165), 'u': (90, 200, 255),
    'a': (240, 240, 245),  # beard white
}

def spr(name, rows):
    w = max(len(r) for r in rows)
    rows = [r.ljust(w, '.') for r in rows]
    img = Image.new("RGBA", (w, len(rows)), (0, 0, 0, 0))
    px = img.load()
    for y, row in enumerate(rows):
        for x, ch in enumerate(row):
            c = PAL.get(ch)
            if c:
                px[x, y] = c + (255,)
    img.save(os.path.join(OUT, name + ".png"))
    print(f"{name}: {img.size}")

P_HEAD = [
    "................",
    ".....hhhhhh.....",
    "....hhhhhhhh....",
    "...hhhhhhhhhh...",
    "...hhHHHHHHhh...",
    "...hhsssssshh...",
    "...hsessesesh...",
    "...hssssssssh...",
    "....sssssss.....",
    "...jjjjjjjjjj...",
    "..jjJjjjjjJjj...",
    "..jjmmmmmmjj....",
    "..jsjmmmmjsj....",
    "...jjjjjjjjjj...",
    "...pppppppppp...",
]
P_LEGS_A = [
    "...ppp....ppp...",
    "...ppp....ppp...",
    "...bbb....bbb...",
    "..bbbb....bbbb..",
    "................",
]
P_LEGS_B = [
    "....ppp..ppp....",
    "....ppp..ppp....",
    "....bbb..bbb....",
    "...bbbb..bbbb...",
    "................",
]
spr("player_f_a", P_HEAD + P_LEGS_A)
spr("player_f_b", P_HEAD + P_LEGS_B)

P_BACK = [
    "................",
    ".....hhhhhh.....",
    "....hhhhhhhh....",
    "...hhhhhhhhhh...",
    "...hhhhhhhhhh...",
    "...hhhhhhhhhh...",
    "...hhhhhhhhhh...",
    "...hhhhhhhhhh...",
    "....hhhhhh......",
    "...jjjjjjjjjj...",
    "..jjJjjjjjJjj...",
    "..jjmmmmmmjj....",
    "..jsjmmmmjsj....",
    "...jjjjjjjjjj...",
    "...pppppppppp...",
]
spr("player_b_a", P_BACK + P_LEGS_A)

P_SIDE = [
    "................",
    ".....hhhhhh.....",
    "....hhhhhhhh....",
    "...hhhhhhhhh....",
    "...hhHHHHHhs....",
    "...hhssssss.....",
    "...hsseses......",
    "...hssssss......",
    "....sssss.......",
    "...jjjjjjj......",
    "..jjJjjjJj......",
    "..jjmmmmjj......",
    "..jsjmmmsj......",
    "...jjjjjj.......",
    "...pppppp.......",
]
P_SIDE_LEGS_A = [
    "...ppp.ppp......",
    "...ppp.ppp......",
    "...bbb.bbb......",
    "..bbbb.bbbb.....",
    "................",
]
P_SIDE_LEGS_B = [
    "....pppppp......",
    "....pppppp......",
    "....bbbbbb......",
    "...bbbbbbb......",
    "................",
]
spr("player_s_a", P_SIDE + P_SIDE_LEGS_A)
spr("player_s_b", P_SIDE + P_SIDE_LEGS_B)

# sage: purple robe, white beard, staff
SAGE = [
    "................",
    ".....vvvvvv.....",
    "....vvvvvvvv....",
    "...vvvssssvv....",
    "...vvssssssv....",
    "...vsesessv.....",
    "...vssssssv.....",
    "....aaaaaa......",
    "...aaaaaaaa.....",
    "...aaVaaVaa.....",
    "..vVaaaaaaVv....",
    "..vVvVVVVvVv....",
    "..vVvVVVVvVv....",
    "..vVvVVVVvVv....",
    "..vVvVVVVvVv..n.",
    "...vVVVVVv...n..",
    "...vVVVVVv...n..",
    "...bbbbbb....n..",
    "..bbbbbb.....n..",
    "................",
]
spr("sage", SAGE)

# robot agent: silver, glowing eyes, antenna
BOT = [
    "................",
    ".......u........",
    ".......n........",
    ".....oooooo.....",
    "....oooooooo....",
    "...oouuooouuo...",
    "...oouuooouuo...",
    "...oooooooooo...",
    "....oooooooo....",
    "...ooOOOOOOoo...",
    "..ooOommmOo o...".replace(" ", "."),
    "..osOommmOoso...",
    "..ooOOOOOOoo....",
    "...ooOOOOoo.....",
    "...pppppppp.....",
    "...opo....opo...",
    "...opo....opo...",
    "...bbb....bbb...",
    "..bbbb....bbbb..",
    "................",
]
BOT = [r.replace(" ", ".") for r in BOT]
spr("bot", BOT)

# judge: black robe, gold trim, white wig
JUDGE = [
    "................",
    "....aaaaaaaa....",
    "...aaaaaaaaaa...",
    "...aassssssaa...",
    "...aasesesaa....",
    "...aasssssaa....",
    "...aaasssaaa....",
    "....kkkkkk......",
    "...kyyyyyyk.....",
    "..kkkyyykkk.....",
    "..kkykkkyyk.....",
    "..kkykkkyyk.....",
    "..kkykkkyyk.....",
    "..kkykkkyyk.....",
    "...kyyyyk.......",
    "...kkkkkk.......",
    "...bbbbbb.......",
    "..bbbbbbb.......",
    "................",
    "................",
]
spr("judge", JUDGE)

# tiles 16x16
spr("grass_a", [
    "gggggggggggggggg",
    "ggGggggggGgggggg",
    "gggggggggggggggg",
    "gggggGggggggggGg",
    "gggggggggggggggg",
    "gGggggggggggGggg",
    "gggggggggggggggg",
    "gggggggGgggggggg",
    "gggggggggggggggg",
    "ggggGgggggggGggg",
    "gggggggggggggggg",
    "gGgggggGgggggggg",
    "gggggggggggggggg",
    "ggggggggggGggggg",
    "ggggGggggggggggg",
    "gggggggggggggggg",
])
spr("grass_b", [
    "gggggggggggggggg",
    "ggggggGgggggGggg",
    "gggggggggggggggg",
    "gGgggggggggggggg",
    "ggggggggGggggggg",
    "gggggggggggggggg",
    "gggggGggggggGggg",
    "gggggggggggggggg",
    "ggGggggggggggggg",
    "ggggggggggggGggg",
    "gggggggggggggggg",
    "gggggGgggggggggg",
    "gggggggggGgggggg",
    "gggggggggggggggg",
    "gGgggggggggGgggg",
    "gggggggggggggggg",
])
spr("path", [
    "dddddddddddddddd",
    "ddDddddddDdddddd",
    "dddddddddddddddd",
    "ddddddDddddddDdd",
    "dddddddddddddddd",
    "dDddddddddddDddd",
    "dddddddddddddddd",
    "dddddddDdddddddd",
    "dddddddddddddddd",
    "ddddDdddddddDddd",
    "dddddddddddddddd",
    "dDddddddDddddddd",
    "dddddddddddddddd",
    "dddddddddddDdddd",
    "ddddDddddddddddd",
    "dddddddddddddddd",
])
spr("flower", [
    "gggggggggggggggg",
    "ggGggggggGgggggg",
    "ggggrrgggggggggg",
    "gggrwwrgggggGggg",
    "ggggrrgggggggggg",
    "ggggggggggwwgggg",
    "gGggggggggwwgggg",
    "gggggggggggggggg",
    "gggggggyyggggggg",
    "ggggggywyygggggg",
    "gggggggyygggGggg",
    "gggggggggggggggg",
    "ggGggggggGgggggg",
    "gggggggggggggggg",
    "gggggggggggggggg",
    "gggggggggggggggg",
])

# tree 24x32
TREE = []
for y in range(32):
    row = ""
    for x in range(24):
        ch = "."
        dx, dy = x - 12, y - 10
        if dx*dx + dy*dy < 95:
            ch = "t" if (x + y) % 3 else "T"
        if 10 <= x <= 13 and 18 <= y < 30:
            ch = "n" if x < 12 else "N"
        if 9 <= x <= 14 and 28 <= y < 30:
            ch = "D"
        row += ch
    TREE.append(row)
spr("tree", TREE)

# fence 16x16
spr("fence", [
    "................",
    "..n..n..n..n....",
    "..n..n..n..n....",
    "nNnNnNnNnNnNnNn.",
    "NNNNNNNNNNNNNNNN",
    "nNnNnNnNnNnNnNn.",
    "..n..n..n..n....",
    "..n..n..n..n....",
    "..n..n..n..n....",
    "nNnNnNnNnNnNnNn.",
    "NNNNNNNNNNNNNNNN",
    "nNnNnNnNnNnNnNn.",
    "..n..n..n..n....",
    "..n..n..n..n....",
    "..n..n..n..n....",
    "................",
])

# signpost 16x32
SIGN = []
for y in range(32):
    row = ""
    for x in range(16):
        ch = "."
        if 7 <= x <= 8 and y >= 10:
            ch = "n"
        if y < 6 and 1 <= x <= 12:
            ch = "N" if y in (0, 5) or x in (1, 12) else "y"
        if 6 <= y < 10 and 3 <= x <= 14:
            ch = "N" if y in (6, 9) or x in (3, 14) else "d"
        row += ch
    SIGN.append(row)
spr("sign", SIGN)

# portraits 32x32 (faces)
def portrait(hair_c, extra=None):
    rows = []
    for y in range(32):
        row = ""
        for x in range(32):
            ch = "."
            dx, dy = x - 16, y - 15
            if dx*dx + dy*dy < 130:
                ch = "s"
            if y < 12 and dx*dx + (dy+6)*(dy+6) < 120:
                ch = hair_c
            if y == 14 and abs(x - 11) < 2:
                ch = "e"
            if y == 14 and abs(x - 21) < 2:
                ch = "e"
            if y == 21 and abs(x - 16) < 4:
                ch = "k"
            row += ch
        rows.append(row)
    return rows

spr("face_player", portrait("h"))
spr("face_sage", portrait("v"))
spr("face_bot", portrait("o"))
spr("face_judge", portrait("a"))

# coin 16x16
COIN = []
for y in range(16):
    row = ""
    for x in range(16):
        dx, dy = x - 7.5, y - 7.5
        d2 = dx*dx + dy*dy
        ch = "."
        if d2 < 56:
            ch = "y"
        if d2 < 56 and d2 > 44:
            ch = "Y"
        if 20 < d2 < 30 and dy < 0:
            ch = "w"
        row += ch
    COIN.append(row)
spr("coin", COIN)

# badge 20x20 (mint medal)
BADGE = []
for y in range(20):
    row = ""
    for x in range(20):
        dx, dy = x - 9.5, y - 9.5
        d2 = dx*dx + dy*dy
        ch = "."
        if d2 < 64:
            ch = "m"
        if d2 < 64 and d2 > 50:
            ch = "k"
        if abs(dx) < 3 and abs(dy) < 5:
            ch = "w"
        row += ch
    BADGE.append(row)
spr("badge", BADGE)

# buildings via PIL rects
def building(name, w, h, wall, roof, sign_text):
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # wall
    d.rectangle([4, 20, w-5, h-4], fill=wall, outline=(26,28,44), width=2)
    # roof
    d.polygon([(0, 22), (w//2, 2), (w-1, 22)], fill=roof, outline=(26,28,44))
    # door
    d.rectangle([w//2-9, h-24, w//2+9, h-4], fill=(127,85,57), outline=(26,28,44), width=2)
    # windows
    for wx in (14, w-30):
        d.rectangle([wx, 34, wx+16, 50], fill=(169,221,211), outline=(26,28,44), width=2)
    # sign board
    d.rectangle([w//2-30, 24, w//2+30, 36], fill=(26,28,44))
    d.text((w//2, 30), sign_text, fill=(169,221,211), anchor="mm",
           font=ImageFont.load_default() if False else None) if False else None
    # simple sign pixels: mint bar
    d.rectangle([w//2-24, 27, w//2+24, 33], fill=(169,221,211))
    img.save(os.path.join(OUT, name + ".png"))
    print(f"{name}: {img.size}")

building("registry", 120, 84, (200, 200, 210), (59, 91, 219), "REG")
building("workshop", 120, 84, (180, 160, 140), (230, 57, 70), "WS")
building("tower", 90, 110, (150, 150, 165), (57, 64, 110), "JDG")

print("done")
