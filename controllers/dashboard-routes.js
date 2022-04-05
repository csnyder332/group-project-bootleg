const router = require('express').Router();
const sequelize = require('../config/connection');
const {
    posts,
    user,
    comment
} = require('../models');
const withAuth = require('../utils/auth');

//Get all images
router.get('/', withAuth, (req, res) => {
    posts.findAll({
            where: {
                user_id: req.session.user_id
            },
            include: [{
                    model: Comment,
                    include: {
                        model: user,
                        attributes: ['username']
                    }
                },
                {
                    model: user,
                    attributes: ['username']
                }
            ]
        })
        .then(dbPostData => {
            const postData = dbPostData.map(post => post.get({
                plain: true
            }));
            console.log("postData: "+postData);
            res.render('dashboard', {
                postData,
                loggedIn: true
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
/*  we might not need this if we are going to change the caption to a textarea instead
router.get('/edit/:id', withAuth, (req, res) => {
    posts.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'title',
                'content',
                'created_at'
            ],
            include: [{
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({
                    message: 'No post found with this id'
                });
                return;
            }

            const post = dbPostData.get({
                plain: true
            });

            res.render('edit-post', {
                post,
                loggedIn: true
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})
*/
/* might not need this if we are going to add a form to the top of the dashboard to make a post
router.get('/new', (req, res) => {
    res.render('add-post', {
        loggedIn: true
    })
})
*/
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('signup');
});


router.get('*', (req, res) => {
    res.status(404).send("Can't go there!");
    // res.redirect('/');
})
module.exports = router;