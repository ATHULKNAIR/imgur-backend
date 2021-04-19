const router = require('express').Router();
const authCtrl = require('../controllers/authCtrl');
const auth = require('../middlewares/auth');

router.post('/register',authCtrl.register);
router.post('/login',authCtrl.login);
router.get('/logout',authCtrl.logout);
router.get('/infor/',auth,authCtrl.getUser);

module.exports = router;