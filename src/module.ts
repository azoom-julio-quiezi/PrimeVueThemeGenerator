import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

// @ts-expect-error: Nuxt not installed
import { addComponent, createResolver, defineNuxtModule } from '@nuxt/kit'
// @ts-expect-error: Nuxt not installed
import type { Nuxt } from '@nuxt/schema'

// Re-export all component types to make them available
export * from './runtime/types.js'

// Create augmentation for Nuxt's components
declare global {
  interface NuxtApp {
    $azoomUI: Record<string, never>
  }
}

export interface AzoomUIModuleOptions {
  prefix?: string
}

export default defineNuxtModule<AzoomUIModuleOptions>({
  meta: {
    name: '@azoom/az-ui',
    configKey: 'azoomUI',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {
    prefix: 'v',
  },
  setup(options: AzoomUIModuleOptions, nuxt: Nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Auto-import custom components
    addComponent({
      name: `${options.prefix}Label`,
      filePath: resolve('./runtime/components/v-label.vue'),
    })

    addComponent({
      name: `${options.prefix}Link`,
      filePath: resolve('./runtime/components/v-link.vue'),
    })

    addComponent({
      name: `${options.prefix}Dialog`,
      filePath: resolve('./runtime/components/v-dialog.vue'),
      priority: 10, // Higher priority to override PrimeVue Dialog
    })

    addComponent({
      name: `${options.prefix}ConfirmDialog`,
      filePath: resolve('./runtime/components/v-confirm-dialog.vue'),
    })

    addComponent({
      name: `${options.prefix}Breadcrumb`,
      filePath: resolve('./runtime/components/v-breadcrumb.vue'),
      priority: 10, // Higher priority to override PrimeVue Breadcrumb
    })

    // Add CSS files from package
    nuxt.options.css.push(resolve('./runtime/assets/styles/reset.css'))
    nuxt.options.css.push(resolve('./runtime/assets/styles/main.css'))

    // Auto-create theme file if it doesn't exist
    nuxt.hook('ready', () => {
      const themeDir = join(nuxt.options.rootDir, 'assets', 'themes')
      const themeFile = join(themeDir, 'azoom-theme.ts')

      if (!existsSync(themeFile)) {
        if (!existsSync(themeDir)) {
          mkdirSync(themeDir, { recursive: true })
        }

        const packageThemeFile = resolve('./runtime/assets/themes/azoom-theme.ts')
        copyFileSync(packageThemeFile, themeFile)
        console.warn('✅ Created assets/themes/azoom-theme.ts')
      }
    })
  },
})
