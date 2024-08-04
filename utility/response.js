
// Utility function to standardize API responses
function formatApiResponse(success, statusCode, message, data = null) {
    return { success, statusCode, message, data };
}

module.exports = {
    formatApiResponse,
};