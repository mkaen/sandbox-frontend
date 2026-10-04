import { definePreset } from '@primevue/themes';
import Lara from '@primevue/themes/lara'

export const preset = definePreset(Lara, {
    components: {
        paginator: {
            root: {
                padding: "0.5rem 0",
                background: "transparent"
            },
            navButton: {
              borderRadius: "9px"
            }
        },
        tabs: {
          tab: {
            background: "var(--p-color-blue-0)"
          }
        },
        card: {
          root: {
            background: "var(--p-color-blue-0)",
            shadow: "0 0 1px var (--p-color-blue-300)"
          }
        },
        button: {
          root: {
            paddingX: "0.8rem",
            paddingY: "0.4rem",
            borderRadius: "21px",
            sm: {
              paddingX: "0.4rem",
              paddingY: "0.2rem"
            }
          }
        },
        dialog: {
          title: {
            fontSize: "28px",
          },
          content: {
            padding: "1.5rem"
          }
        },
        menu: {
          item: {
            color: "var(--p-color-blue-600)",
          }
        }
    },
    semantic: {
      primary: {
        50: '{color.blue.50}',
        100: '{color.blue.100}',
        200: '{color.blue.200}',
        300: '{color.blue.300}',
        400: '{color.blue.400}',
        500: '{color.blue.500}',
        600: '{color.blue.600}',
        700: '{color.blue.700}',
        800: '{color.blue.800}',
        900: '{color.blue.900}',
        950: '{color.blue.950}',
      }
    }
})