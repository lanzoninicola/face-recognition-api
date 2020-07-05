const Clarifai = require('clarifai')


const FACE_DETECT_MODEL = 'e15d0f873e66047e579f90cf82c9882z'

const app = new Clarifai.App({
    apiKey: '4c89d78be6c74b88aaad378b09466151'
});

module.exports.callAPI = async (req, res) => {
    const response = await app.models.predict(FACE_DETECT_MODEL, req.body.imageUrl);

    if (response) {
        res.status(200).json(response)
    } else {
        res.status(400).json('Some error occured with Clarifai API')
    }
}