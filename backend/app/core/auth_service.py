"""
Authentication Service for KOMANDO Platform
Menangani login, validasi sesi token, dan profil pengguna berbasis SQLite.
"""

import secrets
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any

from app.core.db import get_db_connection, verify_password

SESSION_EXPIRY_HOURS = 24

class AuthService:
    def authenticate(self, username: str, password: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT id, username, password_hash, salt, full_name, role, is_active FROM users WHERE username = ?",
                (username.strip(),)
            )
            row = cursor.fetchone()
            if not row:
                return None

            user = dict(row)
            if not user.get("is_active"):
                return None

            if not verify_password(password, user["password_hash"], user["salt"]):
                return None

            # Update last_login
            now_iso = datetime.now(timezone.utc).isoformat()
            cursor.execute("UPDATE users SET last_login = ? WHERE id = ?", (now_iso, user["id"]))
            conn.commit()

            return {
                "id": user["id"],
                "username": user["username"],
                "full_name": user["full_name"],
                "role": user["role"],
                "last_login": now_iso
            }
        finally:
            conn.close()

    def create_session(self, user_id: int) -> str:
        token = "kmd_" + secrets.token_urlsafe(32)
        now = datetime.now(timezone.utc)
        expires_at = now + timedelta(hours=SESSION_EXPIRY_HOURS)

        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO user_sessions (token, user_id, created_at, expires_at)
                VALUES (?, ?, ?, ?)
            """, (token, user_id, now.isoformat(), expires_at.isoformat()))
            conn.commit()
            return token
        finally:
            conn.close()

    def get_user_by_token(self, token: str) -> Optional[Dict[str, Any]]:
        if not token:
            return None

        # Hilangkan prefix 'Bearer ' jika ada
        if token.startswith("Bearer "):
            token = token[7:].strip()

        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT s.token, s.expires_at, u.id, u.username, u.full_name, u.role, u.is_active, u.last_login
                FROM user_sessions s
                JOIN users u ON s.user_id = u.id
                WHERE s.token = ?
            """, (token,))
            row = cursor.fetchone()
            if not row:
                return None

            session_data = dict(row)
            if not session_data.get("is_active"):
                return None

            expires_at = datetime.fromisoformat(session_data["expires_at"])
            if datetime.now(timezone.utc) > expires_at:
                # Sesi sudah kedaluwarsa, hapus dari database
                cursor.execute("DELETE FROM user_sessions WHERE token = ?", (token,))
                conn.commit()
                return None

            return {
                "id": session_data["id"],
                "username": session_data["username"],
                "full_name": session_data["full_name"],
                "role": session_data["role"],
                "last_login": session_data["last_login"]
            }
        finally:
            conn.close()

    def logout(self, token: str) -> bool:
        if token.startswith("Bearer "):
            token = token[7:].strip()

        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM user_sessions WHERE token = ?", (token,))
            conn.commit()
            return True
        finally:
            conn.close()

auth_service = AuthService()
