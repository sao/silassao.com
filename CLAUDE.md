# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio/bio website built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4. Deployed as a static site on Vercel.

## Commands

- **Dev server**: `npm run dev` (runs `next dev --webpack`)
- **Build**: `npm run build` (runs `next build --webpack`)
- **Lint**: `npm run lint` (runs `eslint`)

## Architecture

- **Next.js App Router** with static export (`output: 'export'` in next.config.ts)
- **Styling**: Tailwind CSS 4 via PostCSS, dark theme (black background, white text), custom CSS variables in `app/globals.css`
- **Font**: Inter loaded via `next/font/google`
- **Path alias**: `@/*` maps to project root
- **TypeScript**: Strict mode enabled

## Key Configuration

- Static export with trailing slashes enabled and image optimization disabled (for static compatibility)
- Webpack explicitly used instead of Turbopack
- ESLint 9 flat config with Next.js core-web-vitals and TypeScript rules
