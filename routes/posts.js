import {Router} from 'express';
const router = Router();
import {} from '../data/posts.js';

router.route('/posts').get(async (req, res => {
    //implement GET route
}))

router.route('/searpost').post(async (req, res => {
    //implement POST route
}))

router
.route('/:postId')
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