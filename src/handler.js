// Memuat seluruh fungsi-fungsi handler yang digunakan pada berkas routes.
const {nanoid} = require('nanoid');
const books = require('./bookshelf');

const addBookHandler = (request, h) => {
    const {name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16);
    const finished = (pageCount == readPage) ? true : false ;
    const insertedAt = new Date().toISOString();
    const updateAt = insertedAt;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updateAt,
    };

    books.push(newBook);

    for( let prop in newBook )
    {
        if (newBook[prop] == undefined)
        {
            const response = h.response({
                status: 'fail',
                message: `Gagal menambahkan buku. Mohon isi ${prop} buku`,
            });
            response.code(400);
            return response;
        }
    }

    if ( readPage > pageCount )
    {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    // check whether the data is succesfully added to db
    const isSuccess = books.filter( (book) => book.id === id ).length > 0;

    if (isSuccess)
    {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan pada database',
    });
    response.code(400);
    return response;
};

// const getAllbooksHandler = () => ({
//     status: 'success',
//     data: {
//         books,
//     },
// });

// const getNoteByIdHandler = (request, h) => {
//     const {id} = request.params;
//     const note = books.filter( (n) => n.id ===id )[0];

//     if (note !== undefined){
//         return {
//             status: 'success',
//             data: {
//                 note,
//             },
//         };
//     }

//     const response = h.response({
//         status: 'fail',
//         message: 'Catatan tidak ditemukan',
//     });
//     response.code(404);
//     return response;
// };

// const editNoteByIdHandler = (request, h) => {
//     const {id} = request.params;
//     const {title, tags, body} = request.payload;
//     const updateAt = new Date().toISOString();
//     const index = books.findIndex( (note) => note.id === id );

//     if (index !== -1){
//         books[index] = {
//             ...books[index],
//             title,
//             tags,
//             body,
//             updateAt,
//         };
//         const response = h.response({
//             status: 'success',
//             message: 'Catatan berhasil diperbarui',
//         });
//         response.code(200);
//         return response;
//     }

//     const response = h.response({
//         status: 'fail',
//         message: 'Gagal memperbarui catatan. Id tdk ditemukan',
//     });

//     response.code(404);
//     return response;
// };

// const deleteNoteByIdHandler = (request, h) => {
//     const {id} = request.params;
//     const index = books.findIndex( (note) => note.id === id );
//     if (index !== -1)
//     {
//         books.splice(index, 1);
//         const response = h.response({
//             status: 'success',
//             message: 'Catatan berhasil dihapus',
//         });
//         response.code(200);
//         return response;
//     }

//     const response = h.response({
//         status: 'fail',
//         message: 'Catatan gagal dihapus. Id tdk ditemukan',
//     });
//     response.code(404);
//     return response;
// };

module.exports = {
    addBookHandler,
};