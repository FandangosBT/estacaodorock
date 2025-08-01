import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Nova paleta brutalista para festival de rock
				background: "#0f0f0f",
				blood: "#ff2a2a",
				burnt: "#ffbd00",
				dirtywhite: "#f0f0f0",
				metalgray: "#7a7a7a",
				parchment: "#f5e9d3",
				// Cores do sistema shadcn/ui
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					glow: 'hsl(var(--secondary-glow))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					glow: 'hsl(var(--accent-glow))'
				},
				electric: {
					DEFAULT: 'hsl(var(--electric))',
					foreground: 'hsl(var(--electric-foreground))',
					glow: 'hsl(var(--electric-glow))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontFamily: {
				heading: ['"Bebas Neue"', "sans-serif"],
				body: ['"Roboto Condensed"', "sans-serif"],
			},
			boxShadow: {
				neonRed: "0 0 15px #ff2a2a",
				neonYellow: "0 0 15px #ffbd00",
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				heartbeat: {
					'0%, 20%, 40%, 60%, 80%, 100%': { transform: 'scale(1)' },
					'5%': { transform: 'scale(1.15)' },
					'10%': { transform: 'scale(0.97)' },
					'15%': { transform: 'scale(1.08)' },
					'65%': { transform: 'scale(1.12)' },
					'70%': { transform: 'scale(0.95)' },
					'75%': { transform: 'scale(1.05)' },
				},
				fadeSlide: {
					'0%': { opacity: '0', transform: 'translateY(40px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'tv-glitch': {
					'0%, 100%': { transform: 'translate(0)' },
					'10%': { transform: 'translate(-2px, 1px)' },
					'20%': { transform: 'translate(2px, -1px)' },
					'30%': { transform: 'translate(-1px, 2px)' },
					'40%': { transform: 'translate(1px, -2px)' },
					'50%': { transform: 'translate(-2px, -1px)' },
					'60%': { transform: 'translate(2px, 1px)' },
					'70%': { transform: 'translate(-1px, -2px)' },
					'80%': { transform: 'translate(1px, 2px)' },
					'90%': { transform: 'translate(-2px, 1px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				heartbeat: 'heartbeat 2.2s ease-in-out infinite',
				'fade-slide': 'fadeSlide 1.2s ease-out',
				'tv-glitch': 'tv-glitch 3s infinite ease-in-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
