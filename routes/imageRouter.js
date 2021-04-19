const router = require('express').Router();
const imageCtrl = require('../controllers/imageCtrl');
const auth = require('../middlewares/auth');

router.route('/images')
.post(imageCtrl.createImage)
.get(imageCtrl.getImage);


module.exports = router;