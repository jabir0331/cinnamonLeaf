// server/routes/menu
const express = require('express');
const router = express.Router();
const { createMenuItem, getAllMenuItems, updateMenuItem, toggleMenuItemStatus  } = require('../controllers/menuController');

router.get('/viewAll', getAllMenuItems);
router.post('/create', createMenuItem); 
router.put('/update/:id', updateMenuItem);
router.patch('/toggle-status/:id', toggleMenuItemStatus);


module.exports = router;
