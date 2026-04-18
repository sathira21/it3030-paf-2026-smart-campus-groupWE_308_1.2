import os
import sys

def resolve_conflict(filepath, strategy):
    # strategy: 'head', 'incoming', 'both'
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    resolved_lines = []
    in_conflict = False
    current_part = None # 'head' or 'incoming'
    
    for line in lines:
        if line.startswith('<<<<<<<'):
            in_conflict = True
            current_part = 'head'
            continue
        elif line.startswith('======='):
            current_part = 'incoming'
            continue
        elif line.startswith('>>>>>>>'):
            in_conflict = False
            current_part = None
            continue
            
        if in_conflict:
            if current_part == 'head':
                if strategy in ['head', 'both']:
                    resolved_lines.append(line)
            elif current_part == 'incoming':
                if strategy in ['incoming', 'both']:
                    resolved_lines.append(line)
        else:
            resolved_lines.append(line)
            
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(resolved_lines)
    print(f"Resolved {filepath} using strategy: {strategy}")

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python resolve_git.py <filepath> <strategy>")
        sys.exit(1)
    
    file = sys.argv[1]
    strategy = sys.argv[2]
    
    if os.path.exists(file):
        resolve_conflict(file, strategy)
    else:
        print(f"File not found: {file}")
