import {Router} from 'express';
const router = Router();
import postFunctions from '../data/posts.js';

router.route('/').get(async (req, res) => {
    try {
      return res.render('/');
    } catch (e) {
      return res.status(500).render('error', {
        error: 'GET/',
        statusCode: 500,
        message: e instanceof TypeError ? 'Internal Server Error' : e});
    }
  });

router.route('/posts').get(async (req, res) => {
    //implement GET route
})

router.route('/searchpost').post(async (req, res) => {
    //implement POST route
})

router
.route('/:postId')
.get(async (req, res)=> {
    //implement GET/userId route
})
.delete(async (req, res) => {
    //implement DELETE/userId
})
.put(async (req, res) => {
    //implement PUT/userId
})

export default router;