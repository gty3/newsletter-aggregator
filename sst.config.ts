import { SSTConfig } from "sst"
import { Default } from "./stacks/Default"

export default {
  config(_input) {
    return {
      name: process.env.PROJECT_NAME,
      region: process.env.REGION,
    }
  },

  stacks(app) {
    app.stack(Default)
  },
} satisfies SSTConfig
