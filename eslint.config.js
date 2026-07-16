import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    globalIgnores(['dist', 'src/proto']),
    {
        languageOptions: {
            globals: {
                window: 'readonly',
                document: 'readonly',
            },
        },
        rules: {
            '@typescript-eslint/no-empty-object-type': [
                'error',
                {
                    allowInterfaces: 'with-single-extends',
                    allowObjectTypes: 'always',
                },
            ],
        },
    }
);
