const app = require('./web-services')
const DEFAULT_PORT = 8181;
const PORT = process.env.PORT || DEFAULT_PORT;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});

