# Guloona - Custom Pakistani Fashion Platform

A beautiful Next.js application for custom Pakistani dress ordering with user profiles, measurements management, and personalized styling preferences.

## Features

### 🎨 Beautiful UI/UX
- **Custom Guloona Theme**: Soft pastels with floral accents
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Mobile-first approach
- **Glass Morphism Effects**: Modern UI with backdrop blur effects

### 👤 User Management
- **Supabase Authentication**: Secure sign-in/sign-up
- **User Profiles**: Complete profile management with measurements
- **Personal Preferences**: Style, color, and fabric preferences
- **Settings**: Theme, notifications, and account preferences

### 📏 Measurements & Styling
- **Body Measurements**: Bust, waist, hips, shoulder width
- **Style Preferences**: Colors, fabrics, and design styles
- **Size Preferences**: Dress length and general size preferences
- **Budget Range**: Preferred spending range

### 🛍️ Custom Orders
- **Intelligent Auto-fill**: Profile data auto-populates order forms
- **Comprehensive Order Form**: Dress type, measurements, preferences
- **Email Integration**: Orders sent via EmailJS
- **Multiple Dress Types**: Shalwar kameez, lehenga, anarkali, etc.

### 🔧 Technical Features
- **Next.js 15**: App Router with TypeScript
- **MongoDB Integration**: User profiles and order management
- **Supabase Auth**: Secure authentication system
- **shadcn/ui Components**: Modern, accessible UI components
- **EmailJS**: Order submission via email
- **Responsive Navigation**: Desktop and mobile-friendly

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: Supabase
- **Database**: MongoDB (user profiles)
- **Email**: EmailJS
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Supabase project
- EmailJS account

### Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# EmailJS
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd guloona-nextjs
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.example` to `.env.local` and fill in your values

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── custom-orders/       # Custom order form
│   ├── profile/             # User profile pages
│   │   └── edit/           # Profile editing
│   ├── settings/           # User settings
│   └── api/                # API routes
│       └── profile/        # Profile CRUD operations
├── components/             # Reusable components
│   ├── ui/                 # shadcn/ui components
│   └── Navigation.tsx      # Main navigation
├── contexts/               # React contexts
│   ├── AuthContext.tsx     # Supabase authentication
│   ├── ThemeContext.tsx    # Dark/light theme
│   └── UserProfileContext.tsx  # User profile management
└── lib/                    # Utilities
    ├── mongodb.ts          # MongoDB connection & services
    ├── supabase.ts         # Supabase client
    └── utils.ts            # General utilities
```

## Key Features

### 1. User Profile Management
- Complete profile with personal information
- Body measurements for custom tailoring
- Style preferences (colors, fabrics, patterns)
- Budget range selection

### 2. Custom Order System
- Auto-populates customer data from profile
- Comprehensive dress selection (12+ types)
- Fabric and color preferences
- Special requirements and urgent order options
- Email delivery to business

### 3. Modern UI/UX
- Guloona-branded theme with soft pastels
- Dark/light mode with smooth transitions
- Glass morphism effects
- Responsive design for all devices
- Toast notifications for user feedback

### 4. Security & Performance
- Supabase authentication with JWT tokens
- MongoDB for scalable data storage
- Next.js optimization and TypeScript safety
- Environment variable protection

## Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@guloona.com or create an issue in the repository.

---

**Guloona** - *Crafting beauty, one dress at a time* 🌸
