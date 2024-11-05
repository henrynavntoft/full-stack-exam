// // src/routes/admin.ts
// import { Router } from 'express';
// import { authorizeAdmin } from '../middleware/authorizeAdmin';

// const adminRouter = Router();

// // Admin-only route to manage users
// adminRouter.get('/manage-users', authorizeAdmin, async (req, res) => {
//   // Logic for managing users
//   res.json({ message: 'Access granted to admin' });
// });

// export default adminRouter;