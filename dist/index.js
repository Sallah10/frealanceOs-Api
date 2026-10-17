"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const PORT = env_1.env.PORT;
async function startServer() {
    try {
        await database_1.prisma.$connect();
        console.log("✅ Database connected successfully");
        server_1.app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📝 Environment: ${env_1.env.NODE_ENV}`);
            console.log(`🔗 Frontend URL: ${env_1.env.FRONTEND_URL}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=index.js.map