import sqlite3
from pathlib import Path
from datetime import datetime
p = Path(__file__).resolve().parent.parent / 'backend' / 'db.sqlite3'
conn = sqlite3.connect(str(p))
cur = conn.cursor()
now = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
agents = [
    ('Test Agent 1', 'A helpful assistant agent', 'idle', '', now, now),
    ('Test Agent 2', 'Another test assistant', 'idle', '', now, now),
]
cur.executemany(
    "INSERT INTO agents_agent (name, description, status, last_task, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
    agents
)
conn.commit()
print('Inserted', cur.rowcount, 'rows')
print('Now rows:', cur.execute("SELECT id,name,description FROM agents_agent").fetchall())
conn.close()
