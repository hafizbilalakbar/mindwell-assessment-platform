# MindWell - Mental Health Assessment Platform

## 🌟 Overview

MindWell is a comprehensive mental health assessment and wellness platform designed to help individuals understand and improve their mental wellbeing. This platform provides professional mental health assessments, personalized insights, and relaxation tools to support users on their mental wellness journey.

🌐 **Live Website:** https://mindwell-assessment-platform.vercel.app/

### 🎯 Purpose

This platform was specifically created for individuals experiencing mental health challenges. MindWell helps users:
- Assess their current mental health status through professional questionnaires
- Receive personalized reports with actionable insights
- Access relaxation tools and games to improve their mental wellbeing
- Track their progress over time with repeated assessments

## ✨ Key Features

### 🧠 Professional Assessment
- Evidence-based mental health questionnaires
- 20-question assessment to evaluate mental state
- Comprehensive analysis of depression, anxiety, stress, and overall wellbeing

### 📊 Personalized Reports
- Detailed breakdown of mental health metrics
- Downloadable PDF reports
- Visual data representation through charts and graphs

### 🛡️ User Authentication
- Secure login and registration system
- Google authentication integration
- Profile management with customizable avatars

### 🌈 Relaxation Tools
- Interactive games for stress relief
- Mindfulness exercises
- Resources for improving mental wellbeing

### 🌐 Accessibility
- Multilingual support with Google Translate integration
- Dark/Light mode for comfortable viewing
- Responsive design for all devices (mobile, tablet, desktop)

### 🔒 Privacy & Security
- Confidential assessment process
- Secure data handling
- GDPR-compliant user data management

## 🎮 Relaxation Page Guide

### How to Use the Relaxation Games

The Relaxation Page offers interactive games designed to reduce stress and improve mental wellbeing. Here's how to use this feature:

#### On Desktop/Laptop:
1. **Browse Games**: Scroll through the collection of relaxation games
2. **Select a Game**: Click the "Play Now" button on any game card
3. **Game Controls**: 
   - Move your mouse to the edges of the game to show controls
   - Top-left: See game title and information
   - Top-right: Close button to exit the game
   - Bottom-right: Theater mode and fullscreen buttons

#### On Mobile Devices:
1. **Browse and Select**: Tap on any game to start playing
2. **Game Controls**:
   - Tap once anywhere on the screen to show/hide controls
   - Double-tap to toggle fullscreen mode
   - Use the buttons at the bottom-right to adjust the view

#### Tips for Best Experience:
- **Theater Mode**: Click the rectangle icon for a larger view while still seeing other page elements
- **Fullscreen Mode**: Click the expand icon for the most immersive experience
- **Exit Game**: Click the X button or press ESC key to return to the game selection
- **Mobile Orientation**: Rotate your device to landscape for the best gaming experience

The games are designed to help you relax and focus. Take a few minutes each day to play these games as part of your mental wellness routine.

## 🚶 User Journey

1. **Visit Website**: User lands on the homepage with options to login/signup
2. **Authentication**: User creates an account or logs in (can use Google authentication)
3. **Personal Information**: User provides basic information for personalized assessment
4. **Assessment**: User completes a 20-question mental health assessment
5. **Results**: User receives detailed analysis of their mental health status
6. **Next Steps**:
   - If showing signs of mental distress: Access to relaxation tools and games
   - If mentally stable: Access to profile management and optional reassessment
   - All users: Option to download PDF report or retake assessment

## 🛠️ Technology Stack

- **Framework**: Next.js 15.2.4, React 19
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Radix UI, Shadcn UI
- **Authentication**: Custom auth provider
- **Forms**: React Hook Form with Zod validation
- **Data Visualization**: Recharts
- **PDF Generation**: jsPDF, html2canvas
- **Animations**: GSAP, TSParticles
- **Internationalization**: Google Translate API

## 📋 Setup Instructions (For Non-Technical Users)

### Step 1: Install Required Software

1. **Install Node.js**:
   - Go to [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
   - Download the "LTS" (Long Term Support) version for your operating system (Windows, Mac, or Linux)
   - Run the installer and follow the prompts (accept all default settings)
   - To verify installation, open Command Prompt (Windows) or Terminal (Mac/Linux) and type:
     ```
     node --version
     ```
   - You should see a version number (e.g., v18.17.0)

### Step 2: Get the Project Files

1. **Extract the ZIP file**:
   - Locate the MindWell.zip file you received
   - Right-click on the file and select "Extract All..." (Windows) or double-click (Mac)
   - Choose a location where you want to extract the files (e.g., Desktop)
   - Click "Extract"

### Step 3: Install Project Dependencies

1. **Open Command Prompt or Terminal**:
   - **Windows**: Press Win+R, type `cmd`, and press Enter
   - **Mac**: Open Applications > Utilities > Terminal
   - **Linux**: Open Terminal application

2. **Navigate to the project folder**:
   - Type `cd` followed by the path to where you extracted the project
   - Example:
     ```
     cd C:\Users\YourName\Desktop\MindWell
     ```
     or on Mac/Linux:
     ```
     cd /Users/YourName/Desktop/MindWell
     ```

3. **Install dependencies**:
   - Type the following command and press Enter:
     ```
     npm install
     ```
   - This will install all necessary packages (this may take 5-10 minutes)
   - You will see progress bars and text scrolling in the terminal

### Step 4: Run the Project

1. **Start the development server**:
   - In the same Command Prompt or Terminal window, type:
     ```
     npm run dev
     ```
   - Wait until you see a message like "ready started server on 0.0.0.0:3000, url: http://localhost:3000"

2. **View the website**:
   - Open your web browser (Chrome, Firefox, Edge, or Safari)
   - Type `http://localhost:3000` in the address bar and press Enter
   - The MindWell platform should now be visible and functional

### Step 5: Using the Platform

1. The homepage will display information about MindWell and its features
2. Click "Start Free Assessment" to begin the mental health assessment
3. Follow the prompts to create an account or log in
4. Complete the questionnaire to receive your personalized mental health report
5. Explore relaxation tools and games if recommended

## 🔍 Troubleshooting Common Issues

### "npm is not recognized as an internal or external command"
- **Solution**: Node.js was not installed correctly. Try reinstalling Node.js and ensure you check the box to add it to your PATH during installation.

### "Port 3000 is already in use"
- **Solution**: Another application is using port 3000. Close other applications or change the port by running:
  ```
  npm run dev -- -p 3001
  ```
  Then access the site at http://localhost:3001

### "Cannot find module..."
- **Solution**: Dependencies were not installed correctly. Try running:
  ```
  npm install
  ```
  again to ensure all packages are installed.

### Blank/white screen in browser
- **Solution**: Try clearing your browser cache or opening the site in an incognito/private window.

### Slow performance
- **Solution**: Ensure your computer meets the minimum requirements (4GB RAM, modern processor). Close other resource-intensive applications.

## 📁 Project Structure

```
MindWell/
├── app/                            # Next.js app directory (pages and routes)
│   ├── about/                      # About page and company information
│   ├── assessment/                 # Mental health assessment system
│   │   ├── chat/                  # Interactive assessment chat
│   │   ├── info/                  # Assessment information
│   │   ├── report/               # Assessment results and reports
│   │   └── welcome/              # Assessment welcome page
│   ├── auth/                      # Authentication pages
│   │   ├── login/                # Login page
│   │   ├── logout/               # Logout functionality
│   │   └── signup/               # Registration page
│   ├── contact/                   # Contact page
│   ├── cookies/                   # Cookie policy
│   ├── help/                      # Help and support
│   ├── privacy/                   # Privacy policy
│   ├── profile/                   # User profile management
│   ├── relaxation/                # Relaxation tools and games
│   ├── report/                    # Detailed reports section
│   ├── settings/                  # User settings
│   └── terms/                     # Terms of service
├── components/                     # Reusable UI components
│   ├── ui/                       # Base UI components
│   ├── relaxation/               # Relaxation-specific components
│   ├── about/                    # About page components
│   ├── AnimatedStat.tsx         # Animated statistics component
│   ├── assessment-footer.tsx    # Assessment page footer
│   ├── assessment-loader.tsx    # Assessment loading states
│   ├── auth-provider.tsx        # Authentication context provider
│   ├── breathing-exercise.tsx   # Breathing exercise component
│   ├── cosmic-background.tsx    # Animated background
│   ├── footer.tsx              # Main footer component
│   ├── google-translate-selector.tsx # Language selector
│   ├── hero-section.tsx        # Landing page hero section
│   ├── navbar.tsx              # Main navigation bar
│   ├── user-avatar.tsx         # User profile avatar
│   └── user-profile-form.tsx   # Profile edit form
├── data/                          # Static data and configurations
├── hooks/                         # Custom React hooks
├── lib/                           # Utility functions and providers
│   ├── providers/               # Context providers
│   ├── context/                # React contexts
│   ├── fonts.tsx               # Font configurations
│   ├── google-translate.ts     # Translation utilities
│   ├── questions.ts           # Assessment questions data
│   └── utils.ts               # General utilities
├── public/                        # Static files and assets
│   ├── images/                  # Image assets
│   └── locales/                # Translation files
├── styles/                        # Global styles and themes
├── next.config.js                 # Next.js configuration
├── package.json                   # Project dependencies
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🌟 Features

- **Fully Responsive Design**: Optimized for all devices (mobile, tablet, desktop)
- **Professional UI/UX**: Modern and intuitive interface using Tailwind CSS and Shadcn UI
- **Secure Authentication**: Email/password and Google authentication options
- **Comprehensive Assessment System**: Evidence-based mental health questionnaires
- **Interactive Relaxation Tools**: Games and exercises for stress relief
- **Multilingual Support**: Integrated with Google Translate API
- **Dark/Light Mode**: Customizable theme options
- **Detailed Reporting**: Visual representation of assessment results
- **Profile Management**: Customizable user profiles with avatars
- **Progress Tracking**: Historical data and improvement monitoring
- **PDF Report Generation**: Downloadable assessment reports
- **Privacy-Focused**: GDPR-compliant data handling
- **Accessibility**: WCAG 2.1 compliant design
- **Performance Optimized**: Fast loading and smooth animations
- **Error Handling**: Robust error boundaries and fallbacks
- **SEO Optimized**: Meta tags and structured data
- **Analytics Ready**: Prepared for integration with analytics tools

## 📞 Support

If you encounter any issues or have questions about using the MindWell platform, please contact our support team:

- **Email**: support@mindwell.example.com
- **Phone**: +1-800-MINDWELL
- **Hours**: Monday-Friday, 9am-5pm EST

## 📜 License

This project is proprietary and confidential. Unauthorized copying, transferring, or reproduction of the contents of this project in any medium is strictly prohibited.

---

© 2023 MindWell. All Rights Reserved. 
