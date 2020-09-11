const { Router } = require('express');
const router = Router();

const { getTrack, uploadTrack} = require('../controllers/tracks.controller');

router.get('/:trackId',getTrack);

router.post('/tracks',uploadTrack);

module.exports = router;