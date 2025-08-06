# Guloona Next.js Project - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js TypeScript e-commerce application for Guloona, a Pakistani women's fashion brand. The app features custom dress orders, user profiles, and a beautiful floral-themed design.

## Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Guloona theme (soft pastels, floral inspiration)
- **UI Components**: shadcn/ui with custom variants
- **Authentication**: Supabase Auth
- **Database**: MongoDB for user profiles and orders
- **Email**: EmailJS for order submissions

## Key Features
1. **Authentication System** - Supabase integration with sign-up/sign-in
2. **User Profiles** - MongoDB-based profile management with measurements and preferences
3. **Custom Orders** - Form for custom dress orders with auto-population from profile
4. **Theme System** - Dark/light mode with elegant transitions
5. **Responsive Design** - Mobile-first approach with beautiful animations

## Design Guidelines
- Use soft pastel colors (blush pink, sage green, soft lavender)
- Implement elegant button variants: `elegant` and `floral`
- Follow the established color palette from the theme
- Maintain accessibility and responsive design
- Use smooth transitions and hover effects

## Code Patterns
- Use Next.js App Router patterns
- Implement API routes for secure database operations
- Use TypeScript for type safety
- Follow React best practices with hooks and context
- Use Tailwind classes for styling with theme variables

## File Structure
- `/src/app` - Next.js app router pages and layouts
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions and configurations
- `/src/contexts` - React context providers
- `/src/types` - TypeScript type definitions
