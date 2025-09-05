# Photo Album
<img width="480" height="320" alt="스크린샷 2025-08-29 오후 3 11 44" src="https://github.com/user-attachments/assets/83e6e407-c372-48ed-9c98-0643864db403" />
<img width="480" height="320" alt="스크린샷 2025-08-29 오후 3 10 42" src="https://github.com/user-attachments/assets/3d01cdd6-a5b0-4fbb-ae11-b9d30d12d506" />
<img width="480" height="320" alt="스크린샷 2025-08-29 오후 3 10 32" src="https://github.com/user-attachments/assets/dd4ff4b2-7724-41a3-8034-334e9094452d" />


## 📖 Overview
This project was developed to provide Photo sharing.  


## 🛠 Tech Stack
- **Framework / Library**: Next.js, React, Firebase  
- **Language**: TypeScript, HTML5, CSS3  
- **Database**: Firebase

## ✨ Features
- ✅ Feature 1 Explore Photography
- ✅ Feature 2 Favorites based on user's like.
- ✅ Feature 3  Like / Unlike with realtime update

## 🛣️ Routes
- `/` — Explore feed. Redirects to **/SignIn** if not logged in.
- `/account` — Account settings (e.g., update avatar image, change username).
- `/account/dashboard` — User dashboard showing uploaded photos.
- `/account/favorite` — User's favorite posts (based on likes).

## Work In Progress
- Delete Account.

## 🔮 Future Plans
- Add a search function to explore photos by tags or keywords.
- Introduce zod for validating.
- Introduce Prisma + PostgreSQL for scalable data management.
- 


## 🚀 Getting Started
```bash
# Clone repository
git clone <GitHub-Repo-URL>

# Change directory
cd <Project-Name>

# Install dependencies
npm install

# Run development server
npm run dev

# Setting up Firebase
<img width="546" height="169" alt="스크린샷 2025-08-29 오후 3 19 48" src="https://github.com/user-attachments/assets/deb3dab1-91e8-4622-a90e-801cdaab2936" />
1. create .env in root directory.
2. create variables

```


### CHANGE LOG
25/09/05
- Fix real-time update on Post modal
- Fix UI
25/09/04
- Change Pagination to infinite scroll.
- Future : Upload & Sort will be fixed.

25/09/02
- Introduce Pagination

25/09/01
- Fix display [username] on Navigation.
- Fix [username] is not updated correctly when sign up.