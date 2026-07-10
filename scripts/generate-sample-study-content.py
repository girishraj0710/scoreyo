#!/usr/bin/env python3
"""
Generate sample study content for Study Guides testing
Inserts structured content with all block types into topic_study_content table
"""

import os
import json
from dotenv import load_dotenv
import psycopg2

load_dotenv(".env.local")

# Database connection
POSTGRES_URL = os.getenv("POSTGRES_URL")

def get_db_connection():
    if not POSTGRES_URL:
        raise ValueError("POSTGRES_URL not found in .env.local")
    # psycopg2 handles URL-encoded passwords automatically
    return psycopg2.connect(POSTGRES_URL)

# Sample content for different topics
SAMPLE_CONTENT = {
    # ─── UPSC: Indian Polity ───────────────────────────────────
    "upsc_federalism": {
        "exam_id": "upsc",
        "subject_id": "indian-polity",
        "topic_id": "federalism",
        "title": "Federalism in Indian Constitution",
        "content": {
            "sections": [
                {
                    "title": "What is Federalism?",
                    "content": [
                        {
                            "type": "paragraph",
                            "text": "Federalism is a system of government in which power is divided between a central authority and constituent political units (states). India follows a unique quasi-federal structure that combines both unitary and federal features."
                        },
                        {
                            "type": "example",
                            "examples": [
                                {
                                    "text": "India is described as a 'Union of States' (Article 1) rather than a 'Federation of States'.",
                                    "explanation": "This distinction emphasizes the indestructibility of the Union and the absence of the right to secession for states."
                                }
                            ]
                        },
                        {
                            "type": "note",
                            "text": "Unlike pure federations like the USA, India's Constitution gives more powers to the Centre, especially during emergencies.",
                            "variant": "info"
                        }
                    ]
                },
                {
                    "title": "Division of Powers",
                    "content": [
                        {
                            "type": "paragraph",
                            "text": "The Constitution divides legislative powers between the Union and the States through three lists:"
                        },
                        {
                            "type": "list",
                            "items": [
                                "Union List (97 subjects) - Defence, Foreign Affairs, Currency",
                                "State List (66 subjects) - Police, Public Health, Agriculture",
                                "Concurrent List (47 subjects) - Education, Forests, Marriage"
                            ],
                            "ordered": True
                        },
                        {
                            "type": "note",
                            "text": "In case of conflict between Union and State laws on Concurrent List subjects, Union law prevails (Article 254).",
                            "variant": "warning"
                        }
                    ]
                },
                {
                    "title": "Unitary Features",
                    "content": [
                        {
                            "type": "paragraph",
                            "text": "Despite being federal in structure, India has several unitary features:"
                        },
                        {
                            "type": "list",
                            "items": [
                                "Single Constitution for Union and States",
                                "Single citizenship",
                                "Integrated judiciary",
                                "All-India Services (IAS, IPS, IFS)",
                                "Emergency provisions (National, State, Financial)",
                                "Governor appointed by President"
                            ],
                            "ordered": False
                        }
                    ]
                },
                {
                    "title": "Common Mistakes",
                    "content": [
                        {
                            "type": "comparison",
                            "incorrect": "India is a pure federation like the USA with equal powers to Centre and States",
                            "correct": "India is a quasi-federal system with unitary bias, giving more powers to the Centre"
                        },
                        {
                            "type": "comparison",
                            "incorrect": "States have the right to secede from the Union",
                            "correct": "Indian states do NOT have the right to secede; the Union is indestructible (Article 1)"
                        }
                    ]
                },
                {
                    "title": "Practice Questions",
                    "content": [
                        {
                            "type": "practice",
                            "questions": [
                                {
                                    "question": "Which article of the Constitution defines India as a 'Union of States'?",
                                    "answer": "Article 1",
                                    "explanation": "Article 1(1) states: 'India, that is Bharat, shall be a Union of States.' This emphasizes the indestructible nature of the Union."
                                },
                                {
                                    "question": "How many subjects are there in the Union List?",
                                    "answer": "97 subjects",
                                    "explanation": "Originally 97 subjects (now 98 after GST entry). These are matters of national importance like defence, foreign affairs, and currency."
                                },
                                {
                                    "question": "Who described the Indian Constitution as 'federal in form but unitary in spirit'?",
                                    "answer": "K.C. Wheare",
                                    "explanation": "Constitutional expert K.C. Wheare highlighted the unitary bias in India's federal structure due to strong central powers."
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },

    # ─── JEE: Physics - Thermodynamics ───────────────────────────────────
    "jee_thermodynamics": {
        "exam_id": "jee-main",
        "subject_id": "jee-physics",
        "topic_id": "thermodynamics",
        "title": "Thermodynamics",
        "content": {
            "sections": [
                {
                    "title": "First Law of Thermodynamics",
                    "content": [
                        {
                            "type": "paragraph",
                            "text": "The First Law of Thermodynamics is the law of conservation of energy. It states that energy can neither be created nor destroyed, only converted from one form to another."
                        },
                        {
                            "type": "formula",
                            "formula": "ΔQ = ΔU + ΔW",
                            "description": "Heat supplied = Change in internal energy + Work done by system"
                        },
                        {
                            "type": "note",
                            "text": "Sign convention: ΔQ is positive when heat is supplied TO the system. ΔW is positive when work is done BY the system.",
                            "variant": "warning"
                        }
                    ]
                },
                {
                    "title": "Thermodynamic Processes",
                    "content": [
                        {
                            "type": "table",
                            "headers": ["Process", "Condition", "Equation", "Work Done"],
                            "rows": [
                                ["Isothermal", "T = constant", "PV = constant", "W = nRT ln(V₂/V₁)"],
                                ["Adiabatic", "Q = 0", "PVᵞ = constant", "W = (P₁V₁ - P₂V₂)/(γ-1)"],
                                ["Isobaric", "P = constant", "V/T = constant", "W = P(V₂ - V₁)"],
                                ["Isochoric", "V = constant", "P/T = constant", "W = 0"]
                            ],
                            "caption": "Summary of Thermodynamic Processes"
                        }
                    ]
                },
                {
                    "title": "Examples",
                    "content": [
                        {
                            "type": "example",
                            "examples": [
                                {
                                    "text": "In an isothermal expansion, temperature remains constant, so ΔU = 0. Therefore, ΔQ = ΔW.",
                                    "explanation": "All the heat supplied to the system is converted into work done by the system."
                                },
                                {
                                    "text": "In an adiabatic process, no heat exchange occurs (ΔQ = 0). Therefore, ΔU = -ΔW.",
                                    "explanation": "Work is done at the expense of internal energy. Temperature decreases during expansion."
                                }
                            ]
                        }
                    ]
                },
                {
                    "title": "Common Mistakes",
                    "content": [
                        {
                            "type": "comparison",
                            "incorrect": "In isothermal process, ΔU = 0 because Q = 0",
                            "correct": "In isothermal process, ΔU = 0 because T is constant (not because Q = 0)"
                        },
                        {
                            "type": "comparison",
                            "incorrect": "Adiabatic process means temperature is constant",
                            "correct": "Adiabatic process means no heat exchange (Q = 0); temperature changes"
                        }
                    ]
                },
                {
                    "title": "Practice Problems",
                    "content": [
                        {
                            "type": "practice",
                            "questions": [
                                {
                                    "question": "In which process is the work done maximum for the same initial and final volumes?",
                                    "answer": "Isobaric process",
                                    "explanation": "For the same ΔV, W = PΔV is maximum when pressure is constant (isobaric). In adiabatic/isothermal, pressure decreases during expansion."
                                },
                                {
                                    "question": "What is the efficiency of a Carnot engine operating between 400K and 300K?",
                                    "answer": "25% or 0.25",
                                    "explanation": "η = 1 - (T₂/T₁) = 1 - (300/400) = 1 - 0.75 = 0.25 = 25%"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },

    # ─── NEET: Biology - Cell Biology ───────────────────────────────────
    "neet_cell_biology": {
        "exam_id": "neet-ug",
        "subject_id": "neet-biology",
        "topic_id": "cell-structure",
        "title": "Cell Structure and Functions",
        "content": {
            "sections": [
                {
                    "title": "Cell Theory",
                    "content": [
                        {
                            "type": "paragraph",
                            "text": "The Cell Theory, proposed by Schleiden and Schwann, states that all living organisms are composed of cells, which are the basic structural and functional units of life."
                        },
                        {
                            "type": "list",
                            "items": [
                                "All living organisms are composed of one or more cells",
                                "The cell is the basic unit of structure and organization",
                                "All cells arise from pre-existing cells (Virchow)"
                            ],
                            "ordered": True
                        },
                        {
                            "type": "note",
                            "text": "Viruses are an exception to cell theory as they are acellular and can only reproduce inside a host cell.",
                            "variant": "info"
                        }
                    ]
                },
                {
                    "title": "Prokaryotic vs Eukaryotic Cells",
                    "content": [
                        {
                            "type": "table",
                            "headers": ["Feature", "Prokaryotic", "Eukaryotic"],
                            "rows": [
                                ["Nucleus", "Absent (nucleoid)", "Present (membrane-bound)"],
                                ["Size", "1-10 μm", "10-100 μm"],
                                ["DNA", "Circular, no histones", "Linear, with histones"],
                                ["Organelles", "70S ribosomes only", "Membrane-bound organelles"],
                                ["Cell division", "Binary fission", "Mitosis/Meiosis"],
                                ["Examples", "Bacteria, Archaea", "Plants, Animals, Fungi"]
                            ],
                            "caption": "Key differences between Prokaryotic and Eukaryotic cells"
                        }
                    ]
                },
                {
                    "title": "Cell Organelles",
                    "content": [
                        {
                            "type": "paragraph",
                            "text": "Eukaryotic cells contain specialized membrane-bound organelles with specific functions:"
                        },
                        {
                            "type": "example",
                            "examples": [
                                {
                                    "text": "Mitochondria - 'Powerhouse of the cell'",
                                    "explanation": "Generates ATP through cellular respiration. Contains its own DNA (circular) and ribosomes (70S)."
                                },
                                {
                                    "text": "Ribosomes - 'Protein factories'",
                                    "explanation": "80S in eukaryotes (cytoplasm), 70S in prokaryotes and organelles (mitochondria, chloroplasts)."
                                },
                                {
                                    "text": "Endoplasmic Reticulum - 'Protein and lipid synthesis'",
                                    "explanation": "Rough ER (with ribosomes) - protein synthesis. Smooth ER (no ribosomes) - lipid synthesis."
                                }
                            ]
                        }
                    ]
                },
                {
                    "title": "Common Mistakes",
                    "content": [
                        {
                            "type": "comparison",
                            "incorrect": "Prokaryotic cells have no ribosomes",
                            "correct": "Prokaryotic cells have 70S ribosomes (smaller than eukaryotic 80S)"
                        },
                        {
                            "type": "comparison",
                            "incorrect": "All eukaryotic cells have chloroplasts",
                            "correct": "Only plant cells and some protists have chloroplasts (not animal cells)"
                        }
                    ]
                },
                {
                    "title": "MCQ Practice",
                    "content": [
                        {
                            "type": "practice",
                            "questions": [
                                {
                                    "question": "Which organelle is called the 'suicide bag' of the cell?",
                                    "answer": "Lysosome",
                                    "explanation": "Lysosomes contain hydrolytic enzymes that digest cellular waste. When the cell is damaged, they rupture and digest the cell itself (autolysis)."
                                },
                                {
                                    "question": "What is the powerhouse of the cell?",
                                    "answer": "Mitochondria",
                                    "explanation": "Mitochondria generate ATP through aerobic respiration (Krebs cycle and electron transport chain)."
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
}

def insert_content(conn, content_data):
    """Insert content into topic_study_content table"""
    cursor = conn.cursor()

    # Use existing schema (subject_id, path_id, topic_id, title, content)
    # For exam-specific content, use subject_id as the exam-subject combo
    # e.g., 'indian-polity' for UPSC, 'jee-physics' for JEE

    try:
        # First, try to delete existing record
        cursor.execute("""
            DELETE FROM topic_study_content
            WHERE subject_id = %s AND topic_id = %s AND path_id IS NULL
        """, (content_data["subject_id"], content_data["topic_id"]))

        # Generate overview from first paragraph
        overview = "Comprehensive study material covering key concepts, examples, and practice questions."
        if content_data["content"]["sections"]:
            first_section = content_data["content"]["sections"][0]
            if first_section["content"]:
                for block in first_section["content"]:
                    if block.get("type") == "paragraph":
                        overview = block.get("text", overview)[:200]
                        break

        # Insert new content with all required fields
        query = """
            INSERT INTO topic_study_content
            (subject_id, topic_id, title, overview, content, difficulty_level, estimated_time_minutes, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
        """
        cursor.execute(query, (
            content_data["subject_id"],
            content_data["topic_id"],
            content_data["title"],
            overview,
            json.dumps(content_data["content"]),
            "intermediate",  # difficulty_level: beginner, intermediate, advanced
            30  # estimated_time_minutes
        ))

        conn.commit()
        print(f"✅ Inserted: {content_data['title']} ({content_data['exam_id']} - {content_data['subject_id']})")

    except Exception as e:
        conn.rollback()
        print(f"❌ Error inserting {content_data['title']}: {e}")

    finally:
        cursor.close()

def main():
    print("🚀 Generating sample study content for Study Guides...")
    print()

    conn = get_db_connection()

    for key, content in SAMPLE_CONTENT.items():
        insert_content(conn, content)

    conn.close()

    print()
    print("✅ Sample content generation complete!")
    print()
    print("📋 Content inserted:")
    print("   1. UPSC → Indian Polity → Federalism")
    print("   2. JEE Main → Physics → Thermodynamics")
    print("   3. NEET → Biology → Cell Structure")
    print()
    print("🧪 Test in browser:")
    print("   1. Navigate to http://localhost:3000/study-guides")
    print("   2. Click exam filters (UPSC, JEE, NEET)")
    print("   3. Expand subjects and click topics")
    print("   4. Verify all content block types render correctly")

if __name__ == "__main__":
    main()
