import {Router} from 'express';
const router = Router();
import {} from '../data/users.js';

//TODO: Implement log-in and create user routes here.

wasdwasd4wa
router.route('/user').get(async (req, res => {
    //implement GET route
}))

router.route('/searchuser').post(async (req, res => {
    //implement POST route
}))

router
.route('/:userId')
.get(async (req, res => {
    //implement GET/userId route
}))
.delete(async (req, res => {
    //implement DELETE/userId
}))
.put(aync (req, res => {
    //implement PUT/userId
}))

export default router;
