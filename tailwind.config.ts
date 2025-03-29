import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

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
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
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
					foreground: 'hsl(var(--accent-foreground))'
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
				},
				// Hindu-themed colors
				"hindu-orange": {
					DEFAULT: "#FF7F00", // Vibrant saffron orange
					'50': '#FFF9ED',
					'100': '#FFF1D6',
					'200': '#FFE2AC',
					'300': '#FFD382',
					'400': '#FFC359',
					'500': '#FFAF2F',
					'600': '#FF9E05',
					'700': '#DB8500',
					'800': '#B26D00',
					'900': '#895400',
					'950': '#613C00',
				},
				"hindu-red": {
					DEFAULT: "#B22222", // Deep kumkum red
					'50': '#FCE7E7',
					'100': '#F9CFCF',
					'200': '#F39E9E',
					'300': '#EB6E6E',
					'400': '#E33D3D',
					'500': '#D01C1C',
					'600': '#B22222',
					'700': '#8D1B1B',
					'800': '#691414',
					'900': '#450D0D',
					'950': '#300909',
				},
				"hindu-yellow": {
					DEFAULT: "#FFD700", // Auspicious gold
					'50': '#FFFAE5',
					'100': '#FFF6CC',
					'200': '#FFED99',
					'300': '#FFE466',
					'400': '#FFDA33',
					'500': '#FFD700',
					'600': '#CCB100',
					'700': '#998500',
					'800': '#665800',
					'900': '#332C00',
					'950': '#1A1600',
				},
				"hindu-green": {
					DEFAULT: "#006400", // Sacred tulsi green
					'50': '#E0FFED',
					'100': '#C2FFDA',
					'200': '#85FFB5',
					'300': '#47FF8F',
					'400': '#0AFF6A',
					'500': '#00CC4D',
					'600': '#009F3D',
					'700': '#00732C',
					'800': '#00461C',
					'900': '#003014',
					'950': '#001D0C',
				},
				"hindu-purple": {
					DEFAULT: "#800080", // Divine purple
					'50': '#FCE5FC',
					'100': '#F9CCF9',
					'200': '#F399F3',
					'300': '#EC66EC',
					'400': '#E433E4',
					'500': '#D10CD1',
					'600': '#A209A2',
					'700': '#800080',
					'800': '#590059',
					'900': '#330033',
					'950': '#1F001F',
				},
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
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'pulse-gentle': {
					'0%, 100%': {
						opacity: '1',
					},
					'50%': {
						opacity: '0.8',
					},
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'pulse-gentle': 'pulse-gentle 3s infinite',
			},
			fontFamily: {
				'sanskrit': ['Poppins', 'sans-serif'],
				'mantra': ['Noto Sans Devanagari', 'sans-serif'],
				sans: ["var(--font-sans)", ...fontFamily.sans],
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
