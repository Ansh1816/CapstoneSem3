const express = require('express');
const router = express.Router();
const gemController = require('../controllers/gemController');
const authMiddleware = require('../middleware/authMiddleware');

const optionalAuthMiddleware = require('../middleware/optionalAuthMiddleware');

router.post('/', authMiddleware, gemController.createGem);
router.get('/', gemController.getGems);
router.get('/:id', optionalAuthMiddleware, gemController.getGemById);
router.put('/:id', authMiddleware, gemController.updateGem);
router.delete('/:id', authMiddleware, gemController.deleteGem);

router.post('/:id/vote', authMiddleware, gemController.voteGem);
router.post('/:id/save', authMiddleware, gemController.saveGem);
router.delete('/:id/save', authMiddleware, gemController.unsaveGem);

module.exports = router;
