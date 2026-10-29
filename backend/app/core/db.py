"""
SQLite Database Connection & Schema Manager for KOMANDO Platform
Mengelola koneksi SQLite lokal, inisialisasi tabel, dan akun default.
"""

import os
import sqlite3
import hashlib
import secrets
from datetime import datetime, timezone

DB_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
DB_PATH = os.path.join(DB_DIR, "komando.db")

def get_db_connection() -> sqlite3.Connection:
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn

def hash_password(password: str, salt: str = None) -> tuple[str, str]:
    if not salt:
        salt = secrets.token_hex(16)
    pw_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        iterations=100000
    ).hex()
    return pw_hash, salt

def verify_password(password: str, expected_hash: str, salt: str) -> bool:
    computed_hash, _ = hash_password(password, salt)
    return secrets.compare_digest(computed_hash, expected_hash)

def init_db():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()

        # 1. Tabel Users
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                salt TEXT NOT NULL,
                full_name TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'user',
                is_active INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL,
                last_login TEXT
            );
        """)

        # 2. Tabel Sesi / Bearer Token
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_sessions (
                token TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                expires_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        """)

        # 3. Seed akun bawaan: komando1 / Komando2026! / Operator Komando 1
        cursor.execute("SELECT id FROM users WHERE username = ?", ("komando1",))
        existing_user = cursor.fetchone()

        if not existing_user:
            default_pw = "Komando2026!"
            pw_hash, salt = hash_password(default_pw)
            now_iso = datetime.now(timezone.utc).isoformat()
            cursor.execute("""
                INSERT INTO users (username, password_hash, salt, full_name, role, is_active, created_at)
                VALUES (?, ?, ?, ?, ?, 1, ?)
            """, ("komando1", pw_hash, salt, "Operator Komando 1", "user", now_iso))
            conn.commit()
            print(" [DB] Akun awal 'komando1' berhasil didaftarkan ke SQLite.")
        else:
            conn.commit()

    finally:
        conn.close()

# Inisialisasi schema saat modul pertama kali di-import
init_db()
