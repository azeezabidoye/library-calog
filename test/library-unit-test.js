const {assert, equal, expect} = require("chai");
const {ethers} = require("hardhat");

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

describe("Library Contract", function() {
    let Library;
    let library;
    let owner;

    const NUM_UNFINISHED_BOOK = 5;
    const NUM_FINISHED_BOOK = 3;

    let unfinishedBookList;
    let finishedBookList;

    function verifyBook(bookChain, book) {
        expect(book.name).to.equal(bookChain.name);
        expect(book.year.toString()).to.equal(bookChain.toString());
        expect(book.author).to.equal(bookChain.author);
    }

    function verifyBookList(bookFromChain, bookList) {
        expect(bookFromChain.length).to.not.equal(0);
        expect(bookFromChain.length).to.equal(bookList.length);

        for(let i = 0; i < bookList.length; i++) {
            const bookChain = bookFromChain[i];
            const book = bookList[i];

            verifyBook(bookChain, book);
        }
    }

    beforeEach(async function() {
        Library = await ethers.getContractFactory("Library");
        [owner] = await ethers.getSigners();
        library = await Library.deploy();

        unfinishedBookList = [];
        finishedBookList = [];

        for(let i = 0; i < NUM_UNFINISHED_BOOK; i++) {
            let book = {
                "name": getRandomInt(1, 1000).toString(),
                "year": getRandomInt(1800, 2021),
                "author": getRandomInt(1, 1000).toString(),
                "isFinished": false
            }
            await library.addBook(book.name, book.year, book.author, book.isFinished);
            unfinishedBookList.push(book);
        }
        for(let i = 0; i < NUM_FINISHED_BOOK; i++) {
            let book = {
                "name": getRandomInt(1, 1000).toString(),
                "year": getRandomInt(1800, 2021),
                "author": getRandomInt(1, 1000).toString(),
                "isFinished": true
            }
            await library.addBook(book.name, book.year, book.author, book.isFinished);
            finishedBookList.push(book);
        }
    });

    describe("Add Book", function() {
        it("Should emit Add Book event", async function() {
            let book = {
                "name": getRandomInt(1, 1000).toString(),
                "year": getRandomInt(1800, 2021),
                "author": getRandomInt(1, 1000).toString(),
                "isFinished": true
            }
            await expect(await library.addBook(book.name, book.year, book.author, book.isFinished))
            .to.emit(library, 'AddBook').withArgs(owner.address, NUM_FINISHED_BOOK + NUM_UNFINISHED_BOOK);
        })
    });

    describe("Get Books", function() {
        it("Should return number of Unfinished books", async function(){
            const bookFromChain = await library.getUnfinishedBooks();
            expect(bookFromChain.length).to.equal(NUM_UNFINISHED_BOOK);
            verifyBookList(bookFromChain, unfinishedBookList);
        })


        it("Should return number of Finished books", async function(){
            const bookFromChain = await library.getFinishedBooks();
            expect(bookFromChain.length).to.equal(NUM_FINISHED_BOOK);
            verifyBookList(bookFromChain, finishedBookList);
        })
    })

    describe("Set Finished", function() {
        it("Should emit SetFinished event", async function () {
            const BOOK_ID = 0;
            const BOOK_FINISHED = true;
  
            await expect(
                library.setFinished(BOOK_ID, BOOK_FINISHED)
            ).to.emit(
                library, 'SetFinished'
            ).withArgs(
                BOOK_ID, BOOK_FINISHED
            )
        })
    })
})

