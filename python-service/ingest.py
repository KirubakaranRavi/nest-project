# import os
# import psycopg2
# import sys
# import json

# def ingest_data(filename, path):
#     base_upload_path = r"D:\JK-tech\nest-project\node-service\uploads"  # ✅ Define absolute path
#     full_path = os.path.join(base_upload_path, os.path.basename(path))  # ✅ Ensure correct file path

#     print(f"Ingestion process started for: {filename}")

#     if not os.path.exists(full_path):  # ✅ Check if file exists
#         print(f"❌ Error: File not found at {full_path}")
#         return

#     try:
#         with open(full_path, "r", encoding="utf-8") as file:
#             content = file.read()
#     except Exception as e:
#         print(f"❌ Error reading file: {e}")
#         return

#     # ✅ Connect to PostgreSQL
#     try:
#         conn = psycopg2.connect(
#             host=os.environ.get("DATABASE_HOST"),
#             dbname=os.environ.get("DATABASE_NAME"),
#             user=os.environ.get("DATABASE_USER"),
#             password=os.environ.get("DATABASE_PASSWORD")
#         )
#         cursor = conn.cursor()

#         # ✅ Insert into ingestion table
#         cursor.execute(
#             "INSERT INTO ingested_documents (filename, file_path, content) VALUES (%s, %s, %s)",
#             (filename, full_path, content)
#         )

#         conn.commit()
#         cursor.close()
#         conn.close()

#         print(f"✅ Ingestion completed for: {filename}")

#     except Exception as e:
#         print(f"❌ Database error: {e}")

# # ✅ Read filename & path from CLI args
# if __name__ == "__main__":
#     try:
#         if len(sys.argv) > 1 and sys.argv[1]:  # Ensure argument exists
#             data = json.loads(sys.argv[1])  # Parse JSON input safely
#             ingest_data(data["filename"], data["path"])
#         else:
#             print("❌ No JSON input provided. Expected filename & path.")
#     except json.JSONDecodeError as e:
#         print(f"❌ Error parsing input: {e}")  # Better error handling

import os
import psycopg2
import sys
import json


def ingest_data(filename, path):
    base_upload_path = r"D:\JK-tech\nest-project\node-service\uploads"
    full_path = os.path.join(base_upload_path, os.path.basename(path))

    if not os.path.exists(full_path):
        return

    try:
        # ✅ Read file as binary (always)
        with open(full_path, "rb") as file:
            content = file.read()  # Read the entire file (modify if needed)
    except Exception as e:
        print(f"❌ Error reading file: {e}")
        return

    # ✅ Connect to PostgreSQL
    try:
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            dbname="nestjsdb",
            user="postgres",
            password="12345"
        )

        cursor = conn.cursor()

        # ✅ Check if file already exists
        cursor.execute("SELECT id FROM ingested_documents WHERE filename = %s", (filename,))
        existing_record = cursor.fetchone()

        if existing_record:
            # ✅ Update existing record
            cursor.execute(
                "UPDATE ingested_documents SET content = %s WHERE filename = %s",
                (psycopg2.Binary(content), filename)
            )
        else:
            # ✅ Insert new record
            cursor.execute(
                "INSERT INTO ingested_documents (filename, file_path, content) VALUES (%s, %s, %s)",
                (filename, full_path, psycopg2.Binary(content))
            )

        conn.commit()
        cursor.close()
        conn.close()

    except Exception as e:
        print(f"❌ Database error: {e}")

# ✅ Read filename & path from CLI args
if __name__ == "__main__":
    try:
        if len(sys.argv) > 1 and sys.argv[1].strip():  # ✅ Ensure it's not empty
            try:
                data = json.loads(sys.argv[1])
                ingest_data(data["filename"], data["path"])
            except json.JSONDecodeError as e:
                print(f"❌ Error parsing input JSON: {e}")
        else:
            print("❌ No valid JSON input provided.")
    except json.JSONDecodeError as e:
        print(f"❌ Error parsing input: {e}")  # Better error handling
