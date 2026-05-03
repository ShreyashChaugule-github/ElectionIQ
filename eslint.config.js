import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";

export default [
  {ignores: ["dist/**", "coverage/**"]},
  {files: ["**/*.{js,mjs,cjs,jsx}"]},
  {languageOptions: { 
    globals: {
      ...globals.browser, 
      ...globals.node,
      it: 'readonly',
      expect: 'readonly',
      vi: 'readonly',
      beforeEach: 'readonly',
      test: 'readonly'
    } 
  }},
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      "react-hooks": pluginReactHooks,
      "jsx-a11y": pluginJsxA11y
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-static-element-interactions": "warn"
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  }
];
