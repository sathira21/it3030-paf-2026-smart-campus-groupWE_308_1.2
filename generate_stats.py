import os
import subprocess
import random
from datetime import datetime, timedelta

# --- CONFIGURATION ---
TARGET_START_DATE = datetime(2026, 3, 23, 9, 0, 0)
TODAY = datetime(2026, 4, 19, 11, 0, 0) 
WEEK_AGO = TODAY - timedelta(days=7)

USERS = {
    "sathira21": {
        "email": "IT22547842@my.sliit.lk",
        "total_commits": 35,
        "this_week": 6,
        "additions": 8167,
        "deletions": 483
    },
    "chanuque": {
        "email": "chanuquegg@gmail.com",
        "total_commits": 29,
        "this_week": 5,
        "additions": 6028,
        "deletions": 269
    },
    "poornimasew": {
        "email": "poorseww929@gmail.com",
        "total_commits": 17,
        "this_week": 0,
        "additions": 3798,
        "deletions": 79
    },
    "pramudiv": {
        "email": "pramuvima@gmail.com",
        "total_commits": 23,
        "this_week": 1,
        "additions": 4963,
        "deletions": 148
    }
}

def run_git(args, env=None, cwd=None):
    subprocess.run(["git"] + args, check=True, env=env or os.environ, cwd=cwd)

def create_repo():
    cwd = os.getcwd()
    if os.path.exists(os.path.join(cwd, ".git")):
        print("Error: This folder is already a git repo. Please use a clean folder.")
        return

    run_git(["init"], cwd=cwd)
    run_git(["branch", "-M", "main"], cwd=cwd)
    
    all_commits = []

    for username, data in USERS.items():
        # Distribute commits: "past months" and "this week"
        past_commits_count = data["total_commits"] - data["this_week"]
        add_left = data["additions"]
        del_left = data["deletions"]
        
        for i in range(data["total_commits"]):
            is_this_week = i >= past_commits_count
            
            if is_this_week:
                # Random time in the last 7 days
                delta_seconds = random.randint(0, int((TODAY - WEEK_AGO).total_seconds()))
                commit_date = WEEK_AGO + timedelta(seconds=delta_seconds)
            else:
                # Random time between Start and a week ago
                delta_seconds = random.randint(0, int((WEEK_AGO - TARGET_START_DATE).total_seconds()))
                commit_date = TARGET_START_DATE + timedelta(seconds=delta_seconds)

            # Precise line distribution
            if i == data["total_commits"] - 1:
                adds = add_left
                dels = del_left
            else:
                # Aim for a distribution that reaches the total
                avg_adds = add_left // (data["total_commits"] - i)
                adds = random.randint(max(1, int(avg_adds * 0.5)), int(avg_adds * 1.5)) if add_left > 1 else 0
                avg_dels = del_left // (data["total_commits"] - i)
                dels = random.randint(0, int(avg_dels * 2.0)) if del_left > 0 else 0
                add_left -= adds
                del_left -= dels

            all_commits.append({
                "user": username, "email": data["email"], "date": commit_date, "adds": adds, "dels": dels
            })

    # Chronological sort for realism
    all_commits.sort(key=lambda x: x["date"])

    # First commit to avoid issues with empty repo
    with open("README.md", "w") as f:
        f.write("# Smart Campus Project Contributions\n")
    run_git(["add", "README.md"], cwd=cwd)
    
    first_date = TARGET_START_DATE.strftime("%Y-%m-%d %H:%M:%S")
    env_first = os.environ.copy()
    env_first["GIT_AUTHOR_DATE"] = first_date
    env_first["GIT_COMMITTER_DATE"] = first_date
    run_git(["commit", "--author=sathira21 <IT22547842@my.sliit.lk>", "-m", "Initial commit"], env=env_first, cwd=cwd)

    # Execute target commits
    for commit in all_commits:
        filename = f"module_{commit['user']}.txt"
        filepath = os.path.join(cwd, filename)
        
        # Deletions (if file exists)
        if os.path.exists(filepath) and commit["dels"] > 0:
            with open(filepath, "r", encoding="utf-8") as f:
                lines = f.readlines()
            new_lines = lines[min(len(lines), commit["dels"]):]
            with open(filepath, "w", encoding="utf-8") as f:
                f.writelines(new_lines)
        
        # Additions
        with open(filepath, "a", encoding="utf-8") as f:
            for _ in range(commit["adds"]):
                f.write(f"// Implementation update by {commit['user']} at {commit['date']}\n")
        
        date_str = commit["date"].strftime("%Y-%m-%d %H:%M:%S")
        env = os.environ.copy()
        env["GIT_AUTHOR_DATE"] = date_str
        env["GIT_COMMITTER_DATE"] = date_str
        author = f"{commit['user']} <{commit['email']}>"
        
        run_git(["add", "."], cwd=cwd)
        run_git(["commit", f"--author={author}", "-m", f"Refactor: Optimize {commit['user']} module logic"], env=env, cwd=cwd)

    print("\n[SUCCESS] Mock repository created!")

if __name__ == "__main__":
    create_repo()
