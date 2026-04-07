import re
import sys

path = r'c:\dev\WQDSS\repo_git\backend\app\routers\observatory.py'

with open(path, 'r', encoding='utf8') as f:
    content = f.read()

# Replace :param::type with CAST(:param AS type)
# We also handle things like :date_end::date + interval ... 
# Regex matches :name::type
new_content = re.sub(r':([a-zA-Z_]+)::([a-zA-Z_]+)', r'CAST(:\1 AS \2)', content)

# Also check for double colons followed by a space? No, usually ::type.
# Let's check for any other variations like :param:: timestamp or something.
# For now, [a-zA-Z_]+ covers date, timestamp, interval etc.

if new_content != content:
    with open(path, 'w', encoding='utf8') as f:
        f.write(new_content)
    print(f"Successfully updated casts in {path}")
else:
    print(f"No casts found to update in {path}")
