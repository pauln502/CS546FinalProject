
import express from 'express';
const app = express();
import exphbs from 'express-handlebars';
import session from 'express-session';
import configRoutes from './routes/index.js';

const rewriteUnsupportedBrowserMethods = (req, res, next) => {

  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  next();
};

app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.get('/favicon.ico', (req, res) => res.status(204));

app.use(
    session({
        name: 'AuthState',
        secret: 'something secret',
        saveUninitialized: false,
        resave: false,
        cookie: {maxAge: 60000}
    })
);

app.use('/', (req, res, next) => {
    const timestamp = new Date().toUTCString();
    const method = req.method;
    const url = req.originalUrl;
    const isAuthenticated = req.session && req.session.user;
    const authStatus = isAuthenticated ? 'Authenticated User' : 'Non-Authenticated User';

    console.log(`[${timestamp}]: ${method} ${url} (${authStatus})`);

    if (!isAuthenticated && (url === '/protected' || url === '/admin')) {
        return res.status(403).send('error', {statusCode: 403, messge: 'Unauthorized: Please log in to access this page.'});
    }

    next();
});

app.get('/login', (req, res, next) => {
    const authenticatedUser = req.session.user;

    if(authenticatedUser) {

        const userRole = authenticatedUser.role;

        if(userRole === 'admin') {
            return res.redirect('/admin');
        } else if (userRole === 'user') {
            return res.redirect('/protected');
        }
    }

    next();
});

app.get('/register', (req, res, next) => {
    const authenticatedUser = req.session.user;

    if(authenticatedUser) {

        const userRole = authenticatedUser.role;

        if(userRole === 'admin') {
            return res.redirect('/admin');
        } else if (userRole === 'user') {
            return res.redirect('/protected');
        }
    }
    
    next();
});

app.get('/protected', (req, res, next) => {
    if(!req.session.user) {
        return res.redirect('/login');
    }

    next();
});

app.get('/admin', (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    if (req.session.user.role !== 'admin') {
        return res.status(403).render('error', {
            error: '/admin GET middleware',
            statusCode: 403,
            message:'Forbidden - You do not have permission to view this page.'
        });
    }

    next();
});

app.get('/logout', (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    next();
});

configRoutes(app);

app.listen(3000, () => {
    console.log('We have now got a server!');
    console.log('Your routes will be running on http://localhost:3000');
});

