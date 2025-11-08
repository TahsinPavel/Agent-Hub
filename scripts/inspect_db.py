import sqlite3
from pathlib import Path
p = Path(__file__).resolve().parent.parent / 'backend' / 'db.sqlite3'
print('db path:', p)
conn = sqlite3.connect(str(p))
cur = conn.cursor()
print('tables:', cur.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall())
try:
    print('agents schema:', cur.execute("PRAGMA table_info('agents_agent')").fetchall())
    print('agents rows:', cur.execute("SELECT id, name, description FROM agents_agent").fetchall())
except Exception as e:
    print('error reading agents table:', e)
conn.close()
