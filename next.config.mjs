// Import the MDX plugin
// import * as NextMDX from '@next/mdx';
import createMDX from '@next/mdx';

const withMDX = createMDX({
  options: {
    extension: /\.mdx?$/,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets CI/build verification use a separate cache from a running dev server.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // Configure pageExtensions to support MDX
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  transpilePackages: ['three'],
};

// Use the MDX plugin
export default withMDX(nextConfig);
