"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_js_1 = require("./server.js");
const env_js_1 = require("./config/env.js");
const database_js_1 = require("./config/database.js");
const PORT = env_js_1.env.PORT;
async function startServer() {
    try {
        await database_js_1.prisma.$connect();
        console.log("✅ Database connected successfully");
        server_js_1.app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📝 Environment: ${env_js_1.env.NODE_ENV}`);
            console.log(`🔗 Frontend URL: ${env_js_1.env.FRONTEND_URL}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=index.js.map