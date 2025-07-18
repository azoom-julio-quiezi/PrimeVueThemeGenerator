import { defineNuxtModule, addComponent, addImports, createResolver } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'

export default defineNuxtModule({
  meta: {
    name: '@azoom/primevue-theme-generator',
    configKey: 'azoomTheme',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    prefix: 'v'
  },
  setup(options, nuxt: Nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Auto-import custom components
    addComponent({
      name: `${options.prefix}Label`,
      filePath: resolve('../custom-components/az/v-label.vue')
    })

    addComponent({
      name: `${options.prefix}Link`, 
      filePath: resolve('../custom-components/az/v-link.vue')
    })

    addComponent({
      name: `${options.prefix}Dialog`,
      filePath: resolve('../custom-components/az/v-dialog.vue'),
      priority: 10 // Higher priority to override PrimeVue Dialog
    })

    addComponent({
      name: `${options.prefix}ConfirmDialog`,
      filePath: resolve('../custom-components/az/v-confirm-dialog.vue')
    })

    addComponent({
      name: `${options.prefix}Breadcrumb`,
      filePath: resolve('../custom-components/az/v-breadcrumb.vue'),
      priority: 10 // Higher priority to override PrimeVue Breadcrumb
    })

    // Auto-import custom composables
    addImports([
      {
        name: 'useConfirmDialog',
        from: resolve('../custom-composables/az/use-confirm-dialog')
      }
    ])

    // Add CSS files from package
    nuxt.options.css.push(resolve('../assets/styles/reset.css'))
    nuxt.options.css.push(resolve('../assets/styles/main.css'))

    // Auto-create theme file if it doesn't exist
    nuxt.hook('ready', () => {
      const fs = require('fs')
      const path = require('path')
      
      const themeDir = path.join(nuxt.options.rootDir, 'assets', 'themes')
      const themeFile = path.join(themeDir, 'azoom-theme.ts')
      
      if (!fs.existsSync(themeFile)) {
        if (!fs.existsSync(themeDir)) {
          fs.mkdirSync(themeDir, { recursive: true })
        }
        
        const packageThemeFile = resolve('../assets/themes/azoom-theme.ts')
        fs.copyFileSync(packageThemeFile, themeFile)
        console.log('✅ Created assets/themes/azoom-theme.ts')
      }
    })
  }
}) 