import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import preserveDirectives from 'rollup-preserve-directives';

// https://vitejs.dev/config/
export default defineConfig(async () => {
    const packagesPath = path.resolve(__dirname, '../../packages');
    const aliases: Record<string, string> = {
        'data-generator-retail': path.resolve(
            __dirname,
            '../data-generator/src'
        ),
    };

    if (fs.existsSync(packagesPath)) {
        const packages = fs.readdirSync(packagesPath);
        for (const dirName of packages) {
            if (dirName === 'create-react-admin') continue;
            // eslint-disable-next-line prettier/prettier
            const packageJson = await import(
                path.resolve(packagesPath, dirName, 'package.json'),
                { with: { type: 'json' } }
            );
            aliases[packageJson.default.name] = path.resolve(
                packagesPath,
                `${packageJson.default.name}/src`
            );
        }
    }

    return {
        plugins: [
            react(),
            visualizer({
                // your visualizer options
            }),
            preserveDirectives(),
        ],
        resolve: {
            alias: aliases,
        },
    };
});