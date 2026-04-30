from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
import os

OUT_DIR = "data/sample-documents"
IMAGE_DIR = "data/sample-images"

FIELD_IMAGE = os.path.join(IMAGE_DIR, "field-site-risk.jpg")
WAREHOUSE_IMAGE = os.path.join(IMAGE_DIR, "warehouse-safety-risk.jpg")
EQUIPMENT_IMAGE = os.path.join(IMAGE_DIR, "equipment-condition-risk.jpg")

os.makedirs(OUT_DIR, exist_ok=True)

styles = getSampleStyleSheet()


def require_image(path):
    if not os.path.exists(path):
        raise FileNotFoundError(f"Missing required image: {path}")


def build_field_site_report():
    require_image(FIELD_IMAGE)

    path = os.path.join(OUT_DIR, "field-site-readiness-report.pdf")
    doc = SimpleDocTemplate(path, pagesize=letter)
    story = []

    story.append(Paragraph("Field Site Readiness Report", styles["Title"]))
    story.append(Spacer(1, 12))

    story.append(
        Paragraph(
            "Purpose: This report documents whether the inspected site is ready for continued operation.",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            "Instruction: Review the attached field photograph and determine whether the site condition indicates operational risk.",
            styles["Normal"],
        )
    )

    story.append(Spacer(1, 16))
    story.append(Paragraph("Field Photograph", styles["Heading2"]))
    story.append(Spacer(1, 8))
    story.append(Image(FIELD_IMAGE, width=420, height=315))
    story.append(Spacer(1, 16))

    story.append(
        Paragraph(
            "Standard action policy: If the field evidence indicates operational risk, normal work in the affected area must be stopped. The team must inspect the area, document the issue, complete remediation, and validate the site before work continues.",
            styles["Normal"],
        )
    )

    doc.build(story)


def build_warehouse_safety_report():
    require_image(WAREHOUSE_IMAGE)

    path = os.path.join(OUT_DIR, "warehouse-safety-report.pdf")
    doc = SimpleDocTemplate(path, pagesize=letter)
    story = []

    story.append(Paragraph("Warehouse Safety Report", styles["Title"]))
    story.append(Spacer(1, 12))

    story.append(
        Paragraph(
            "Purpose: This report supports safety review for warehouse operations.",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            "Instruction: Review the attached warehouse photograph and determine whether the condition requires immediate safety intervention.",
            styles["Normal"],
        )
    )

    story.append(Spacer(1, 16))
    story.append(Paragraph("Warehouse Photograph", styles["Heading2"]))
    story.append(Spacer(1, 8))
    story.append(Image(WAREHOUSE_IMAGE, width=420, height=315))
    story.append(Spacer(1, 16))

    story.append(
        Paragraph(
            "Standard action policy: If the visual evidence indicates a safety risk, the area must be secured, the risk must be removed, the incident must be documented, and the zone must be validated as safe before activity resumes.",
            styles["Normal"],
        )
    )

    doc.build(story)


def build_equipment_condition_report():
    require_image(EQUIPMENT_IMAGE)

    path = os.path.join(OUT_DIR, "equipment-condition-report.pdf")
    doc = SimpleDocTemplate(path, pagesize=letter)
    story = []

    story.append(Paragraph("Equipment Condition Report", styles["Title"]))
    story.append(Spacer(1, 12))

    story.append(
        Paragraph(
            "Purpose: This report supports maintenance review for critical operational equipment.",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            "Instruction: Review the attached equipment photograph and determine whether the equipment condition could affect service continuity.",
            styles["Normal"],
        )
    )

    story.append(Spacer(1, 16))
    story.append(Paragraph("Equipment Photograph", styles["Heading2"]))
    story.append(Spacer(1, 8))
    story.append(Image(EQUIPMENT_IMAGE, width=420, height=315))
    story.append(Spacer(1, 16))

    story.append(
        Paragraph(
            "Business impact policy: If the visual evidence indicates equipment condition risk, the issue may lead to service interruption, maintenance escalation, and additional operational cost. A maintenance incident should be opened and corrective action should be completed.",
            styles["Normal"],
        )
    )

    doc.build(story)


def build_operations_report():
    path = os.path.join(OUT_DIR, "operations-performance-report.pdf")
    doc = SimpleDocTemplate(path, pagesize=letter)
    story = []

    story.append(Paragraph("Operations Performance Report", styles["Title"]))
    story.append(Spacer(1, 12))

    story.append(
        Paragraph(
            "Purpose: This report summarizes quarterly operational performance and renewal rate trends.",
            styles["Normal"],
        )
    )

    story.append(Spacer(1, 12))

    table_data = [
        ["Quarter", "Performance Score", "Renewal Rate"],
        ["Q1", "92", "86%"],
        ["Q2", "88", "82%"],
        ["Q3", "79", "74%"],
        ["Q4", "64", "61%"],
    ]

    table = Table(table_data)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
                ("GRID", (0, 0), (-1, -1), 1, colors.black),
                ("PADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )

    story.append(table)
    story.append(Spacer(1, 16))

    story.append(
        Paragraph(
            "Management note: A sustained decline in operational performance requires root-cause analysis, incident review, and corrective planning.",
            styles["Normal"],
        )
    )

    doc.build(story)


def main():
    build_field_site_report()
    build_warehouse_safety_report()
    build_equipment_condition_report()
    build_operations_report()
    print("Created updated demo PDF files in data/sample-documents")


if __name__ == "__main__":
    main()