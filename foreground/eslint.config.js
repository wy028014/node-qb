/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-08-11 08:47:14
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 09:42:10
 * @FilePath: /node-qb/foreground/eslint.config.js
 * @Description: eslint 配置
 */
import vueParser from 'vue-eslint-parser'
import pluginVue from 'eslint-plugin-vue'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import globals from 'globals' // 引入全局变量定义
import prettierConfig from 'eslint-config-prettier'

export default [
  // 全局配置
  {
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      globals: {
        ...globals.browser, // 浏览器环境全局变量（如 window）
        ...globals.node, // Node.js 环境全局变量（如 require）
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
      },
    },
  },
  // Vue 文件配置
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser, // TS 解析器处理 <script>
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: { vue: pluginVue },
    // 使用兼容写法替代 extends
    rules: {
      ...pluginVue.configs['vue3-recommended'].rules, // 直接展开规则集
      'vue/multi-word-component-names': 'off', // 允许单单词组件名
    },
  },
  // TypeScript 文件配置
  {
    files: ['**/*.ts'],
    plugins: { '@typescript-eslint': tsPlugin },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  prettierConfig,
]
