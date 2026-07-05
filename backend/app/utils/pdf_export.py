from __future__ import annotations

from datetime import datetime
from textwrap import wrap


def _escape_pdf_text(text: str) -> str:
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def _build_content_stream(lines: list[str]) -> bytes:
    escaped_lines = [f"({_escape_pdf_text(line)}) Tj" for line in lines]
    stream_lines = ["BT", "/F1 11 Tf", "1 0 0 1 48 760 Tm", "14 TL"]
    stream_lines.extend(escaped_lines)
    stream_lines.append("ET")
    return "\n".join(stream_lines).encode("latin-1")


def generate_pdf_report(title: str, sections: list[tuple[str, list[str]]]) -> bytes:
    lines: list[str] = [title, f"Generated {datetime.utcnow().isoformat()}Z", ""]
    for section_title, section_lines in sections:
        lines.append(section_title)
        for section_line in section_lines:
            wrapped = wrap(section_line, width=88) or [""]
            lines.extend(f"  {line}" for line in wrapped)
        lines.append("")

    content_stream = _build_content_stream(lines)
    objects: list[bytes] = []

    def add_object(body: str | bytes) -> None:
        if isinstance(body, str):
            objects.append(body.encode("latin-1"))
        else:
            objects.append(body)

    add_object("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj")
    add_object("2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj")
    add_object(
        "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj"
    )
    add_object("4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj")
    add_object(
        b"5 0 obj << /Length "
        + str(len(content_stream)).encode("latin-1")
        + b" >> stream\n"
        + content_stream
        + b"\nendstream endobj"
    )

    output = bytearray()
    output.extend(b"%PDF-1.4\n")
    offsets = [0]
    for body in objects:
        offsets.append(len(output))
        output.extend(body)
        output.extend(b"\n")

    xref_offset = len(output)
    output.extend(f"xref\n0 {len(offsets)}\n".encode("latin-1"))
    output.extend(b"0000000000 65535 f \n")
    for offset in offsets[1:]:
        output.extend(f"{offset:010d} 00000 n \n".encode("latin-1"))
    output.extend(b"trailer << /Size " + str(len(offsets)).encode("latin-1") + b" /Root 1 0 R >>\n")
    output.extend(f"startxref\n{xref_offset}\n%%EOF".encode("latin-1"))
    return bytes(output)