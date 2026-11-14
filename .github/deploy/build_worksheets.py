"""สร้างหน้าใบงานบนเว็บ (site/worksheets/wsN.html) จากไฟล์ worksheets/worksheet-NN.md

ใช้ไฟล์ .md เป็นต้นฉบับของเนื้อหาใบงาน: แก้ .md แล้ว push ไป main เว็บจะอัปเดตเอง
สคริปต์จะแทนที่เฉพาะหัวเรื่อง (h1) และเนื้อหาใบงาน ส่วนอื่นของหน้า (เมนู ปุ่มก่อนหน้า/ถัดไป กล่องการส่งงาน) คงเดิม

รูปแบบ .md ที่รองรับ:  # หัวเรื่อง   ## หัวข้อย่อย   - รายการ   **ตัวหนา**   `โค้ด`   ย่อหน้าคั่นด้วยบรรทัดว่าง
ใช้งาน:  python .github/deploy/build_worksheets.py   (รันที่โฟลเดอร์ราก repo)
"""
import html, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
START = '<article class="prose">\n'
END = '<div class="callout">'


def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"`(.+?)`", r"<code>\1</code>", t)
    return t


def md_to_html(md):
    out, items, para = [], [], []

    def flush():
        nonlocal items, para
        if para:
            out.append("<p>" + inline(" ".join(para)) + "</p>")
            para = []
        if items:
            out.append("<ul>\n" + "\n".join(f"<li>{inline(x)}</li>" for x in items) + "\n</ul>")
            items = []

    title = None
    for raw in md.splitlines():
        line = raw.rstrip()
        if not line.strip():
            flush()
        elif line.startswith("# "):
            flush()
            title = line[2:].strip()
        elif line.startswith("## "):
            flush()
            out.append(f"<h2>{inline(line[3:].strip())}</h2>")
        elif line.startswith("- "):
            if para:
                flush()
            items.append(line[2:].strip())
        else:
            if items:
                flush()
            para.append(line.strip())
    flush()
    return title, "\n".join(out)


def main():
    changed = 0
    for md_path in sorted((ROOT / "worksheets").glob("worksheet-*.md")):
        n = int(re.search(r"worksheet-(\d+)", md_path.name).group(1))
        page = ROOT / "site" / "worksheets" / f"ws{n}.html"
        if not page.exists():
            sys.exit(f"ไม่พบหน้า {page} สำหรับ {md_path.name}")
        title, body = md_to_html(md_path.read_text(encoding="utf-8"))
        if not title:
            sys.exit(f"{md_path.name}: ไม่พบหัวเรื่อง (บรรทัดที่ขึ้นต้นด้วย # )")
        short = re.sub(r"^ใบงานปฏิบัติการที่\s*\d+\s*[:：]\s*", "", title)
        s = page.read_text(encoding="utf-8")
        i = s.find(START)
        j = s.find(END, i)
        if i < 0 or j < 0:
            sys.exit(f"{page.name}: ไม่พบตำแหน่งแทนเนื้อหา")
        new = s[: i + len(START)] + body + "\n" + s[j:]
        new, k = re.subn(r"(<h1>)[^<]*(</h1>)", lambda m: m.group(1) + html.escape(short, quote=False) + m.group(2), new, count=1)
        if k != 1:
            sys.exit(f"{page.name}: ไม่พบ <h1>")
        if new != s:
            page.write_text(new, encoding="utf-8")
            changed += 1
            print("อัปเดต", page.relative_to(ROOT))
    print(f"เสร็จ: แก้ {changed} หน้า")


if __name__ == "__main__":
    main()
