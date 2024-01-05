declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EMAIL_ADDRESS: string
      EMAIL_DOMAIN: string
      REGION: string
      PROJECT_NAME: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
