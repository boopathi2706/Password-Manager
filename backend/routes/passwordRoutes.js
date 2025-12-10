// backend/routes/passwordRoutes.js

const express = require('express');
const passwordController = require('../controllers/passwordController');
const { protect } = require('../middleware/authMiddleware'); 
const router = express.Router();

// All routes below this point require a valid JWT cookie
router.use(protect); 

// 1. Routes for the collection: GET /passwords and POST /passwords
router.route('/')
    .get(passwordController.getAllPasswords)    // List View
    .post(passwordController.createPassword);   // Create New Password

// 2. Routes for a specific item (/:id) actions
// NOTE: We keep the retrieval POST route specific to avoid URL conflicts
router.route('/:id')
    // DELETE /passwords/:id
    .delete(passwordController.deletePassword); 

// 3. Specific Route for Secure Retrieval (as used by the frontend modal)
// POST /passwords/:id/retrieve (Requires security answers in body)
router.post('/:id/retrieve', passwordController.retrievePassword);


module.exports = router;