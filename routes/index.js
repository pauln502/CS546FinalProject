import userRoutes from './users.js';
import postRoutes from './posts.js';

const constructorMethod = (app) => {
    app.use('/users', userRoutes);
    app.use('/posts', postRoutes);
    app.use(/(.*)/, (req, res) => {
        return res.status(404).render('error', {statusCode: 404, message: 'Page not found'});
    });
};

export default constructorMethod;