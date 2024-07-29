const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authController = require('../controllers/authController');

router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    ],
    (req, res) => {
        console.log(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        authController.register(req, res);
    }
);


router.post(
    '/login',
    [
        check('username', 'Please enter username').notEmpty(),
        check('password', 'Password is required').notEmpty(),
    ],
    (req, res) => {
        console.log(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        authController.login(req, res);
    }
);

router.get('/getPriorityDDL', (req, res) => {
    authController.prioritiesDDL(req, res)
})
router.get('/getUserDDL', (req, res) => {
    authController.userDDL(req, res)

})

router.get('/getTask', (req, res) => { authController.getAllTasks(req, res) });

router.post(
    '/addTask',
    [
        check('title').notEmpty().withMessage('Title is required'),
        check('description').notEmpty().withMessage('Description is required'),
        check('priorityId').isInt().withMessage('Priority ID must be an integer'),
        check('categoryId').notEmpty().withMessage('Category ID must be an integer'),
    ],
    (req, res) => { authController.createTask(req, res) }
);

router.put(
    '/updateTask:id',
    [
        check('title').notEmpty().withMessage('Title must not be empty'),
        check('description').notEmpty().withMessage('Description must not be empty'),
        check('priorityId').isInt().withMessage('Priority ID must be an integer'),
        check('categoryId').isInt().withMessage('Category ID must be an integer'),
    ],
    (req, res) => { authController.updateTask(req, res) }
);

router.get('/deleteTask/:id', (req, res) => {
    authController.deleteTask(req, res);
});


router.get('/getCategory', authController.getAllCategories);
router.post('/addCategory', authController.createCategory);
router.put('/updateCategory', authController.updateCategory);
router.get('/deleteCategory:id', authController.deleteCategory);


router.use('/shared-tasks', authController.getSharedTasks);

module.exports = router;
