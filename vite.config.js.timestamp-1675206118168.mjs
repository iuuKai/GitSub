// vite.config.js
import { defineConfig } from "file:///H:/gitsub/node_modules/_vite@3.2.5@vite/dist/node/index.js";
import vue from "file:///H:/gitsub/node_modules/_@vitejs_plugin-vue@3.2.0@@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///H:/gitsub/node_modules/_@vitejs_plugin-vue-jsx@2.1.1@@vitejs/plugin-vue-jsx/dist/index.mjs";
import { prismjsPlugin } from "file:///H:/gitsub/node_modules/_vite-plugin-prismjs@0.0.8@vite-plugin-prismjs/dist/index.js";
import WindiCSS from "file:///H:/gitsub/node_modules/_vite-plugin-windicss@1.8.10@vite-plugin-windicss/dist/index.mjs";
import { visualizer } from "file:///H:/gitsub/node_modules/_rollup-plugin-visualizer@5.9.0@rollup-plugin-visualizer/dist/plugin/index.js";
import { Plugin as importToCDN } from "file:///H:/gitsub/node_modules/_vite-plugin-cdn-import@0.3.5@vite-plugin-cdn-import/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "H:\\gitsub";
var vite_config_default = defineConfig({
  server: {
    open: true,
    port: 3e3,
    host: "0.0.0.0"
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `
					@import "@/styles/variables.less";
					@import '@/styles/global.less';
				`
      }
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === "lottie-player"
        }
      }
    }),
    vueJsx({
      isCustomElement: (tag) => tag === "lottie-player"
    }),
    prismjsPlugin({
      languages: "all",
      plugins: ["line-numbers"],
      css: true
    }),
    WindiCSS(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    }),
    importToCDN({
      modules: [
        {
          name: "vue",
          var: "Vue",
          path: "https://cdn.jsdelivr.net/npm/vue@3.2.41/dist/vue.global.prod.min.js"
        },
        {
          name: "vue-router",
          var: "VueRouter",
          path: "https://cdn.jsdelivr.net/npm/vue-router@4.1.5/dist/vue-router.global.min.js"
        },
        {
          name: "@vueuse/shared",
          path: "https://cdn.jsdelivr.net/npm/@vueuse/shared@9.4.0/index.iife.min.js"
        },
        {
          name: "@vueuse/core",
          var: "VueUse",
          path: "https://cdn.jsdelivr.net/npm/@vueuse/core@9.3.1/index.iife.min.js"
        },
        {
          name: "pinia",
          var: "Pinia",
          path: "https://cdn.jsdelivr.net/npm/pinia@2.0.23/dist/pinia.iife.min.js"
        },
        {
          name: "vue-i18n",
          var: "VueI18n",
          path: "https://cdn.jsdelivr.net/npm/vue-i18n@9.2.2/dist/vue-i18n.global.prod.min.js"
        },
        {
          name: "dayjs",
          var: "dayjs",
          path: "https://cdn.jsdelivr.net/npm/dayjs@1.11.5/dayjs.min.js"
        },
        {
          name: "dayjs_plugin_advancedFormat",
          var: "dayjs_plugin_advancedFormat",
          path: "https://cdn.jsdelivr.net/npm/dayjs@1.11.5/plugin/advancedFormat.js"
        },
        {
          name: "dayjs_plugin_customParseFormat",
          var: "dayjs_plugin_customParseFormat",
          path: "https://cdn.jsdelivr.net/npm/dayjs@1.11.5/plugin/customParseFormat.js"
        },
        {
          name: "dayjs_plugin_localeData",
          var: "dayjs_plugin_localeData",
          path: "https://cdn.jsdelivr.net/npm/dayjs@1.11.5/plugin/localeData.js"
        },
        {
          name: "dayjs_plugin_weekOfYear",
          var: "dayjs_plugin_weekOfYear",
          path: "https://cdn.jsdelivr.net/npm/dayjs@1.11.5/plugin/weekOfYear.js"
        },
        {
          name: "dayjs_plugin_weekYear",
          var: "dayjs_plugin_weekYear",
          path: "https://cdn.jsdelivr.net/npm/dayjs@1.11.5/plugin/weekYear.js"
        },
        {
          name: "dayjs_plugin_weekday",
          var: "dayjs_plugin_weekday",
          path: "https://cdn.jsdelivr.net/npm/dayjs@1.11.5/plugin/weekday.js"
        },
        {
          name: "ant-design-vue",
          var: "antd",
          path: "https://cdn.jsdelivr.net/npm/ant-design-vue@3.2.13/dist/antd.min.js",
          css: "https://cdn.jsdelivr.net/npm/ant-design-vue@3.2.13/dist/antd.min.css"
        },
        {
          name: "axios",
          var: "axios",
          path: "https://cdn.jsdelivr.net/npm/axios@1.1.3/dist/axios.min.js"
        },
        {
          name: "nprogress",
          var: "NProgress",
          path: "https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.js",
          css: "https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.css"
        },
        {
          name: "lottie-web",
          var: "lottie",
          path: "https://cdn.jsdelivr.net/npm/lottie-web@5.9.6/build/player/lottie.min.js"
        },
        {
          name: "@lottiefiles/lottie-player",
          var: "LottiePlayer",
          path: "https://cdn.jsdelivr.net/npm/@lottiefiles/lottie-player@1.5.7/dist/lottie-player.min.js"
        },
        {
          name: "Prism",
          var: "Prism",
          path: "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js",
          css: "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css"
        },
        {
          name: "lodash-es",
          var: "_",
          path: "https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"
        }
      ]
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJIOlxcXFxnaXRzdWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkg6XFxcXGdpdHN1YlxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vSDovZ2l0c3ViL3ZpdGUuY29uZmlnLmpzXCI7LypcbiAqIEBBdXRob3I6IGl1dWthaVxuICogQERhdGU6IDIwMjItMTAtMjEgMDA6NDQ6NDFcbiAqIEBMYXN0RWRpdG9yczogaXV1a2FpXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIzLTAyLTAxIDA3OjAxOjEyXG4gKiBARmlsZVBhdGg6IFxcZ2l0c3ViXFx2aXRlLmNvbmZpZy5qc1xuICogQERlc2NyaXB0aW9uOlxuICogQFFRL1x1NUZBRVx1NEZFMTogNzkwMzMxMjg2XG4gKi9cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcbmltcG9ydCB7IHByaXNtanNQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1wcmlzbWpzJ1xuaW1wb3J0IFdpbmRpQ1NTIGZyb20gJ3ZpdGUtcGx1Z2luLXdpbmRpY3NzJ1xuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcidcbmltcG9ydCB7IFBsdWdpbiBhcyBpbXBvcnRUb0NETiB9IGZyb20gJ3ZpdGUtcGx1Z2luLWNkbi1pbXBvcnQnXG4vLyBcdTYzMDlcdTk3MDBcdTUyQTBcdThGN0RhbnRkXG4vLyBpbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuLy8gaW1wb3J0IHsgQW50RGVzaWduVnVlUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcblx0c2VydmVyOiB7XG5cdFx0Ly8gdml0ZSBcdTU0MkZcdTUyQThcdTY1RjZcdTYyNTNcdTVGMDBcdTk4NzlcdTc2RUVcblx0XHRvcGVuOiB0cnVlLFxuXHRcdHBvcnQ6IDMwMDAsXG5cdFx0aG9zdDogJzAuMC4wLjAnXG5cdH0sXG5cdHJlc29sdmU6IHtcblx0XHQvLyBcdTkxNERcdTdGNkVcdThERUZcdTVGODRcdTUyMkJcdTU0MERcblx0XHRhbGlhczoge1xuXHRcdFx0J0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKVxuXHRcdH1cblx0fSxcblx0Ly8gYWxpYXM6IHt9LFxuXHRjc3M6IHtcblx0XHRwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG5cdFx0XHRsZXNzOiB7XG5cdFx0XHRcdGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxuXHRcdFx0XHRhZGRpdGlvbmFsRGF0YTogYFxuXHRcdFx0XHRcdEBpbXBvcnQgXCJAL3N0eWxlcy92YXJpYWJsZXMubGVzc1wiO1xuXHRcdFx0XHRcdEBpbXBvcnQgJ0Avc3R5bGVzL2dsb2JhbC5sZXNzJztcblx0XHRcdFx0YFxuXHRcdFx0XHQvLyBtb2RpZnlWYXJzOiB7XG5cdFx0XHRcdC8vIFx0aGFjazogYDtAaW1wb3J0IChyZWZlcmVuY2UpIFwiQC9zdHlsZXMvdmFyaWFibGVzLmxlc3NcIjtgXG5cdFx0XHRcdC8vIH0sXG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRwbHVnaW5zOiBbXG5cdFx0dnVlKHtcblx0XHRcdHRlbXBsYXRlOiB7XG5cdFx0XHRcdGNvbXBpbGVyT3B0aW9uczoge1xuXHRcdFx0XHRcdGlzQ3VzdG9tRWxlbWVudDogdGFnID0+IHRhZyA9PT0gJ2xvdHRpZS1wbGF5ZXInXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KSxcblx0XHR2dWVKc3goe1xuXHRcdFx0aXNDdXN0b21FbGVtZW50OiB0YWcgPT4gdGFnID09PSAnbG90dGllLXBsYXllcidcblx0XHR9KSxcblx0XHRwcmlzbWpzUGx1Z2luKHtcblx0XHRcdGxhbmd1YWdlczogJ2FsbCcsXG5cdFx0XHQvLyBcdTkxNERcdTdGNkVcdTg4NENcdTUzRjdcdTYzRDJcdTRFRjZcblx0XHRcdHBsdWdpbnM6IFsnbGluZS1udW1iZXJzJ10sXG5cdFx0XHQvLyBcdTRFM0JcdTk4OThcdTU0MERcblx0XHRcdC8vIHRoZW1lOiAnY295Jyxcblx0XHRcdGNzczogdHJ1ZVxuXHRcdH0pLFxuXHRcdFdpbmRpQ1NTKCksXG5cdFx0Ly8gXHU1RjE1XHU1MTY1IGNkbiBcdTVDMzFcdTRFMERcdTk3MDBcdTg5ODFcdTYzMDlcdTk3MDBcdTRFODZcblx0XHQvLyBDb21wb25lbnRzKHtcblx0XHQvLyBcdHJlc29sdmVyczogW0FudERlc2lnblZ1ZVJlc29sdmVyKCldXG5cdFx0Ly8gfSksXG5cdFx0dmlzdWFsaXplcih7XG5cdFx0XHQvL1x1NkNFOFx1NjEwRlx1OEZEOVx1OTFDQ1x1ODk4MVx1OEJCRVx1N0Y2RVx1NEUzQXRydWVcdUZGMENcdTU0MjZcdTUyMTlcdTY1RTBcdTY1NDhcblx0XHRcdG9wZW46IHRydWUsXG5cdFx0XHQvLyBcdTU0MkZcdTc1MjggZ3ppcCBcdTUzOEJcdTdGMjlcdTU5MjdcdTVDMEZcdTYyQTVcdTU0NEFcblx0XHRcdGd6aXBTaXplOiB0cnVlLFxuXHRcdFx0Ly8gXHU1NDJGXHU3NTI4IGJyb3RsaSBcdTUzOEJcdTdGMjlcdTU5MjdcdTVDMEZcdTYyQTVcdTU0NEFcblx0XHRcdGJyb3RsaVNpemU6IHRydWVcblx0XHR9KSxcblx0XHRpbXBvcnRUb0NETih7XG5cdFx0XHRtb2R1bGVzOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRuYW1lOiAndnVlJyxcblx0XHRcdFx0XHR2YXI6ICdWdWUnLFxuXHRcdFx0XHRcdHBhdGg6ICdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL3Z1ZUAzLjIuNDEvZGlzdC92dWUuZ2xvYmFsLnByb2QubWluLmpzJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bmFtZTogJ3Z1ZS1yb3V0ZXInLFxuXHRcdFx0XHRcdHZhcjogJ1Z1ZVJvdXRlcicsXG5cdFx0XHRcdFx0cGF0aDogJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vdnVlLXJvdXRlckA0LjEuNS9kaXN0L3Z1ZS1yb3V0ZXIuZ2xvYmFsLm1pbi5qcydcblx0XHRcdFx0fSxcblx0XHRcdFx0Ly8ge1xuXHRcdFx0XHQvLyBcdG5hbWU6ICd2dWUtZGVtaScsXG5cdFx0XHRcdC8vIFx0dmFyOiAnVnVlRGVtaScsXG5cdFx0XHRcdC8vIFx0cGF0aDogJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vdnVlLWRlbWlAMC4xMy4xMS9saWIvaW5kZXguaWlmZS5taW4uanMnXG5cdFx0XHRcdC8vIH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRuYW1lOiAnQHZ1ZXVzZS9zaGFyZWQnLFxuXHRcdFx0XHRcdC8vIHZhcjogJycsXG5cdFx0XHRcdFx0cGF0aDogJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vQHZ1ZXVzZS9zaGFyZWRAOS40LjAvaW5kZXguaWlmZS5taW4uanMnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRuYW1lOiAnQHZ1ZXVzZS9jb3JlJyxcblx0XHRcdFx0XHR2YXI6ICdWdWVVc2UnLFxuXHRcdFx0XHRcdHBhdGg6ICdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL0B2dWV1c2UvY29yZUA5LjMuMS9pbmRleC5paWZlLm1pbi5qcydcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG5hbWU6ICdwaW5pYScsXG5cdFx0XHRcdFx0dmFyOiAnUGluaWEnLFxuXHRcdFx0XHRcdHBhdGg6ICdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL3BpbmlhQDIuMC4yMy9kaXN0L3BpbmlhLmlpZmUubWluLmpzJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bmFtZTogJ3Z1ZS1pMThuJyxcblx0XHRcdFx0XHR2YXI6ICdWdWVJMThuJyxcblx0XHRcdFx0XHRwYXRoOiAnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS92dWUtaTE4bkA5LjIuMi9kaXN0L3Z1ZS1pMThuLmdsb2JhbC5wcm9kLm1pbi5qcydcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG5hbWU6ICdkYXlqcycsXG5cdFx0XHRcdFx0dmFyOiAnZGF5anMnLFxuXHRcdFx0XHRcdHBhdGg6ICdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2RheWpzQDEuMTEuNS9kYXlqcy5taW4uanMnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRuYW1lOiAnZGF5anNfcGx1Z2luX2FkdmFuY2VkRm9ybWF0Jyxcblx0XHRcdFx0XHR2YXI6ICdkYXlqc19wbHVnaW5fYWR2YW5jZWRGb3JtYXQnLFxuXHRcdFx0XHRcdHBhdGg6ICdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2RheWpzQDEuMTEuNS9wbHVnaW4vYWR2YW5jZWRGb3JtYXQuanMnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRuYW1lOiAnZGF5anNfcGx1Z2luX2N1c3RvbVBhcnNlRm9ybWF0Jyxcblx0XHRcdFx0XHR2YXI6ICdkYXlqc19wbHVnaW5fY3VzdG9tUGFyc2VGb3JtYXQnLFxuXHRcdFx0XHRcdHBhdGg6ICdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2RheWpzQDEuMTEuNS9wbHVnaW4vY3VzdG9tUGFyc2VGb3JtYXQuanMnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRuYW1lOiAnZGF5anNfcGx1Z2luX2xvY2FsZURhdGEnLFxuXHRcdFx0XHRcdHZhcjogJ2RheWpzX3BsdWdpbl9sb2NhbGVEYXRhJyxcblx0XHRcdFx0XHRwYXRoOiAnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9kYXlqc0AxLjExLjUvcGx1Z2luL2xvY2FsZURhdGEuanMnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRuYW1lOiAnZGF5anNfcGx1Z2luX3dlZWtPZlllYXInLFxuXHRcdFx0XHRcdHZhcjogJ2RheWpzX3BsdWdpbl93ZWVrT2ZZZWFyJyxcblx0XHRcdFx0XHRwYXRoOiAnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9kYXlqc0AxLjExLjUvcGx1Z2luL3dlZWtPZlllYXIuanMnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRuYW1lOiAnZGF5anNfcGx1Z2luX3dlZWtZZWFyJyxcblx0XHRcdFx0XHR2YXI6ICdkYXlqc19wbHVnaW5fd2Vla1llYXInLFxuXHRcdFx0XHRcdHBhdGg6ICdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2RheWpzQDEuMTEuNS9wbHVnaW4vd2Vla1llYXIuanMnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRuYW1lOiAnZGF5anNfcGx1Z2luX3dlZWtkYXknLFxuXHRcdFx0XHRcdHZhcjogJ2RheWpzX3BsdWdpbl93ZWVrZGF5Jyxcblx0XHRcdFx0XHRwYXRoOiAnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9kYXlqc0AxLjExLjUvcGx1Z2luL3dlZWtkYXkuanMnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRuYW1lOiAnYW50LWRlc2lnbi12dWUnLFxuXHRcdFx0XHRcdHZhcjogJ2FudGQnLFxuXHRcdFx0XHRcdHBhdGg6ICdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2FudC1kZXNpZ24tdnVlQDMuMi4xMy9kaXN0L2FudGQubWluLmpzJyxcblx0XHRcdFx0XHRjc3M6ICdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2FudC1kZXNpZ24tdnVlQDMuMi4xMy9kaXN0L2FudGQubWluLmNzcydcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG5hbWU6ICdheGlvcycsXG5cdFx0XHRcdFx0dmFyOiAnYXhpb3MnLFxuXHRcdFx0XHRcdHBhdGg6ICdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2F4aW9zQDEuMS4zL2Rpc3QvYXhpb3MubWluLmpzJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bmFtZTogJ25wcm9ncmVzcycsXG5cdFx0XHRcdFx0dmFyOiAnTlByb2dyZXNzJyxcblx0XHRcdFx0XHRwYXRoOiAnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9ucHJvZ3Jlc3NAMC4yLjAvbnByb2dyZXNzLm1pbi5qcycsXG5cdFx0XHRcdFx0Y3NzOiAnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9ucHJvZ3Jlc3NAMC4yLjAvbnByb2dyZXNzLm1pbi5jc3MnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRuYW1lOiAnbG90dGllLXdlYicsXG5cdFx0XHRcdFx0dmFyOiAnbG90dGllJyxcblx0XHRcdFx0XHRwYXRoOiAnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9sb3R0aWUtd2ViQDUuOS42L2J1aWxkL3BsYXllci9sb3R0aWUubWluLmpzJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bmFtZTogJ0Bsb3R0aWVmaWxlcy9sb3R0aWUtcGxheWVyJyxcblx0XHRcdFx0XHR2YXI6ICdMb3R0aWVQbGF5ZXInLFxuXHRcdFx0XHRcdHBhdGg6ICdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL0Bsb3R0aWVmaWxlcy9sb3R0aWUtcGxheWVyQDEuNS43L2Rpc3QvbG90dGllLXBsYXllci5taW4uanMnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRuYW1lOiAnUHJpc20nLFxuXHRcdFx0XHRcdHZhcjogJ1ByaXNtJyxcblx0XHRcdFx0XHRwYXRoOiAnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9wcmlzbWpzQDEuMjkuMC9wcmlzbS5taW4uanMnLFxuXHRcdFx0XHRcdGNzczogJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vcHJpc21qc0AxLjI5LjAvdGhlbWVzL3ByaXNtLm1pbi5jc3MnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRuYW1lOiAnbG9kYXNoLWVzJyxcblx0XHRcdFx0XHR2YXI6ICdfJyxcblx0XHRcdFx0XHRwYXRoOiAnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9sb2Rhc2hANC4xNy4yMS9sb2Rhc2gubWluLmpzJ1xuXHRcdFx0XHR9XG5cdFx0XHRdXG5cdFx0fSlcblx0XVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFTQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLFNBQVMscUJBQXFCO0FBQzlCLE9BQU8sY0FBYztBQUNyQixTQUFTLGtCQUFrQjtBQUMzQixTQUFTLFVBQVUsbUJBQW1CO0FBSXRDLE9BQU8sVUFBVTtBQW5CakIsSUFBTSxtQ0FBbUM7QUFzQnpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzNCLFFBQVE7QUFBQSxJQUVQLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNQO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFFUixPQUFPO0FBQUEsTUFDTixLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDckM7QUFBQSxFQUNEO0FBQUEsRUFFQSxLQUFLO0FBQUEsSUFDSixxQkFBcUI7QUFBQSxNQUNwQixNQUFNO0FBQUEsUUFDTCxtQkFBbUI7QUFBQSxRQUNuQixnQkFBZ0I7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQU9qQjtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUixJQUFJO0FBQUEsTUFDSCxVQUFVO0FBQUEsUUFDVCxpQkFBaUI7QUFBQSxVQUNo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
