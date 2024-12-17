const { Firestore } = require('@google-cloud/firestore');

async function getHistoriesHandler(request, h) {
    const db = new Firestore();

    try {
        const predictionsSnapshot = await db.collection('predictions').get();
        const histories = [];

        predictionsSnapshot.forEach(doc => {
            const data = doc.data();
            histories.push({
                id: doc.id,
                history: {
                    result: data.result,
                    createdAt: data.createdAt,
                    suggestion: data.suggestion,
                    id: doc.id,
                }
            });
        });

        return h.response({
            status: 'success',
            data: histories,
        }).code(200);
        
    } catch (error) {
        console.error('Error fetching histories:', error);

        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam mengambil riwayat prediksi',
        }).code(500);
    }
}

module.exports = getHistoriesHandler;
