/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
const tailwindConfig = {
  content: ['./**/*.{js,jsx,ts,tsx}', '../**/*.{js,jsx,ts,tsx}'],
  presets: [require('@dao-dao/config/tailwind/config')],
}

module.exports = tailwindConfig
