// Memuat kode konfigurasi routing server seperti menentukan path, 
// method, dan handler yang digunakan.
const {addBookHandler} = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBookHandler,
    },
    // {
    //     method: 'GET',
    //     path: '/notes',
    //     handler: getAllNotesHandler,
    // },
    // {
    //     method: 'GET',
    //     path: '/notes/{id}',
    //     handler: getNoteByIdHandler,
    // },
    // {
    //     method: 'PUT',
    //     path: '/notes/{id}',
    //     handler: editNoteByIdHandler,
    // },
    // {
    //     method: 'DELETE',
    //     path: '/notes/{id}',
    //     handler: deleteNoteByIdHandler,
    // },
];

module.exports = routes;