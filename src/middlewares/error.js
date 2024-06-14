export const ErrorMiddleware = ((err, req, res, next) => {
    err.message = err.message || "Internal seerver error";
    return res.status(400).json({
        success: "false",
        message: err.message
    })
})


export const TryCatch = (functionToWrap) =>
    (req, res, next) => {
        return Promise.resolve(functionToWrap(req, res, next)).catch(next);
    };

