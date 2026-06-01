with open('app/api/api_v1.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    # Detect the problematic mid-file import and move it above api_router
    if line.strip() == 'api_router = APIRouter()':
        # Check if next line is the routing import
        if i+1 < len(lines) and 'from app.api.v1.routing' in lines[i+1]:
            # Insert routing import before api_router
            new_lines.append(lines[i+1])  # routing import
            new_lines.append('\n')
            new_lines.append('\n')
            new_lines.append(line)  # api_router = APIRouter()
            # Skip the original routing import line
            i += 2
            continue
    new_lines.append(line)
    i += 1

with open('app/api/api_v1.py', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Done. Lines around api_router:")
for j, l in enumerate(new_lines[29:37], 30):
    print(f"{j}: {repr(l)}")
