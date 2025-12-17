"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressionMiddleware = void 0;
exports.createCompression = createCompression;
const compression_1 = __importDefault(require("compression"));
exports.compressionMiddleware = (0, compression_1.default)({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression_1.default.filter(req, res);
    },
});
function createCompression(options = {}) {
    return (0, compression_1.default)({
        level: 6,
        threshold: 1024,
        ...options,
    });
}
//# sourceMappingURL=compression.js.map