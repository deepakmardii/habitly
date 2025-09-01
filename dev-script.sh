
#!/bin/bash
# Script to merge dev branch into main and push to remote

set -e

# Checkout main branch
git checkout main

# Pull latest changes
git pull origin main

# Merge dev into main
git merge dev

# Push main to remote
git push origin main

echo "dev branch has been merged into main and pushed to origin."

# Switch back to dev branch
git checkout dev
echo "Switched back to dev branch."
