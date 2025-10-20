/** @type {import('tailwindcss').Config} */

/**
 * leaving these here and sticking with this tailwind version for now because tailwind 4 doesn't
 * support complex breakpoint logic in its css theming functionality - would be nice to upgrade
 * eventually but that would mean either tailwind adding support or rolling some custom logic in
 * the appropriate stylesheet (probably a way to do this with tailwind vars but this will work for
 * the time being)
 *
 * until then refer to this: https://v3.tailwindcss.com/docs/theme#configuration-reference
 * plus further reading: https://bordermedia.org/blog/tailwind-css-4-breakpoint-override
 */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    screens: {
      // variable-ize these?
      'xt-aspect': { raw: '(max-aspect-ratio: .75)' },
      't-aspect': { raw: '(max-aspect-ratio: 1.25) and (min-aspect-ratio: .75)' },
      'w-aspect': { raw: '(max-aspect-ratio: 1.75) and (min-aspect-ratio: 1.25)' },
      'xw-aspect': { raw: '(min-aspect-ratio: 1.75)' },
    },
  },
  plugins: [],
};
