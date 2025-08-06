import { createApp } from "./app";
import { config } from "./config";

const app = createApp();

app.listen(config.port, () => {
  console.log(`Server is running in ${config.env} mode on port ${config.port}`);
});
