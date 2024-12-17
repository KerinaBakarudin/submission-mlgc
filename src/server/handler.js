const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');

async function postPredictHandler(request, h) {
    try {
        const { image } = request.payload;

        const imageSize = Buffer.byteLength(image);
        const maxSize = 1000000;

        if (imageSize > maxSize) {
            console.log('Debug: Image size (bytes):', imageSize);

            const message = `Payload content length greater than maximum allowed: ${maxSize}`;
            const response = h.response({
                status: 'fail',
                message: message,
            });
            response.code(413);
            return response;
        }

        

        // Lakukan prediksi jika ukuran valid
        const { model } = request.server.app;
        const { label, suggestion } = await predictClassification(model, image);
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            id,
            result: label,
            suggestion,
            createdAt,
        };

        await storeData(id, data);

        const response = h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data,
        });
        response.code(201);
        return response;

    } catch (error) {
        console.error('Prediction Error:', error);

        const response = h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi',
        });
        response.code(400);
        return response;
    }
}

module.exports = postPredictHandler;
