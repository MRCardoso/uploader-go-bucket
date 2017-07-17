let express = require('express'),
	app = express(),
	uploader = require('../index'),
	flash = require('connect-flash'),
	session = require('express-session'),
	open = require("open"),
	port = 3000;

/*
| ------------------------------------------------------------------
| Configuration, define engine of home page
| ------------------------------------------------------------------
*/
app.set('view engine', 'ejs');
app.set('views', '../public');
app.use(session({saveUninitialized: true,resave: true,secret: 'uploaderGoBucket'}));
app.use(flash());
app.use(express.static('./public'));

/*
| ------------------------------------------------------------------
| Render home page
| ------------------------------------------------------------------
*/
app.get('/', (req, res) => {
	res.render('index', {
		message: {
			success: req.flash('success') || null, 
			error: req.flash('error') || null
		}
	}) 
});

/*
| ------------------------------------------------------------------
| Upload request
| ------------------------------------------------------------------
*/
app.post('/upload', (req, res) => {
	uploader
		.uploader({uploadDir: '../public/upload/'}, req)
		.then(file=>{
			req.flash('success', 'Arquivo upado com sucesso');
			res.redirect('/');
		}, err => {
			req.flash('error', 'Não foi possivel upar arquivo');
			res.redirect('/');
			console.log(err);
		});
});

open(`http://localhost:${port}`);

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
