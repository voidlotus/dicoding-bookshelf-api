// Memuat seluruh fungsi-fungsi handler yang digunakan pada berkas routes.
const {nanoid} = require('nanoid');
const books = require('./bookshelf');

// function to check null/undefine data during submission
const isValidRequest = (input) => {
    let result = {
        status: true,
        data: undefined,
    };
    for( let prop in input )
    {
        if (input[prop] == undefined)
        {
            result['status'] = false;
            result['data'] = prop;
            return result;
        }
    }
    return result;
};

const isBookPropMakeSense = (readPage, pageCount) => {
    if ( readPage > pageCount ) return false;
    return true;
};

const addBookHandler = (request, h) => {
    const {name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16);
    const finished = (pageCount == readPage) ? true : false ;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };

    const {status, data} = isValidRequest(newBook);
    if (!status)
    {
        const alias = (data === 'name') ? 'nama' : data;
        const response = h.response({
            status: 'fail',
            message: `Gagal menambahkan buku. Mohon isi ${alias} buku`,
        });
        response.code(400);
        return response;
    }

    // obsolete: changed into function
    // for( let prop in newBook )
    // {
    //     if (newBook[prop] == undefined)
    //     {
    //         const response = h.response({
    //             status: 'fail',
    //             message: `Gagal menambahkan buku. Mohon isi ${prop} buku`,
    //         });
    //         response.code(400);
    //         return response;
    //     }
    // }

    // if ( readPage > pageCount )
    // {
    //     const response = h.response({
    //         status: 'fail',
    //         message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    //     });
    //     response.code(400);
    //     return response;
    // }

    if (!isBookPropMakeSense(readPage, pageCount))
    {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    books.push(newBook);
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

const constrainedKeys = ['id', 'name', 'publisher'];
// const filter = (obj, arr) => Object.fromEntries(Object.entries(obj).filter( ([k]) => arr.includes(k) ));
// filter(books, constrainedKeys);

const getAllBooksHandler = (request, h) => {
    const {name, reading, finished} = request.query;
    if (name)
    {
        console.log("query param: name is valid");
        const response = h.response({
            status: 'success',
            data: {
                books: books.reduce( (res, obj) => {
                    if ( name && obj.name && obj.name.toLowerCase().includes(name.toLowerCase()) )
                    {
                        let newObj = {};
                        constrainedKeys.forEach(key =>{
                            newObj[key] = obj[key];
                        });
                        res.push(newObj);
                    }
                    return res;
                }, [] ),
            },
        });
        response.code(200);
        return response;
    }
    if (reading)
    {
        console.log("query param: reading is valid");
        const response = h.response({
            status: 'success',
            data: {
                books: books.reduce( (res, obj) => {
                    if (obj.reading == reading)
                    {
                        let newObj = {};
                        constrainedKeys.forEach(key =>{
                            newObj[key] = obj[key];
                        });
                        res.push(newObj);
                    }
                    return res;
                }, [] ),
            },
        });
        response.code(200);
        return response;
    }
    if (finished)
    {
        console.log("query param: finished is valid");
        const response = h.response({
            status: 'success',
            data: {
                books: books.reduce( (res, obj) => {
                    if (obj.finished == finished)
                    {
                        let newObj = {};
                        constrainedKeys.forEach(key =>{
                            newObj[key] = obj[key];
                        });
                        res.push(newObj);
                    }
                    return res;
                }, [] ),
            },
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'success',
        data: {
            books: books.map( obj =>{
                let newObj = {};
                constrainedKeys.forEach(key => {
                    newObj[key] = obj[key];
                });
                return newObj;
            }),
        },
    });
    response.code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const book = books.filter( (n) => n.id ===bookId )[0];

    if (book !== undefined){
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const updatedAt = new Date().toISOString();
    const idx = books.findIndex( (book) => book.id === bookId );

    if (idx !== -1){
        books[idx] = {
            ...books[idx],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };

        const {status, data} = isValidRequest(books[idx]);
        if (!status)
        {
            const alias = (data === 'name') ? 'nama' : data;
            const response = h.response({
                status: 'fail',
                message: `Gagal memperbarui buku. Mohon isi ${alias} buku`,
            });
            response.code(400);
            return response;
        }

        if (!isBookPropMakeSense(readPage, pageCount))
        {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
        }

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });

    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const idx = books.findIndex( (book) => book.id === bookId );
    if (idx !== -1)
    {
        books.splice(idx, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler
};