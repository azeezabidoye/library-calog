// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Library {

    // Events
    event AddBook(address recipient, uint bookId);
    event SetFinished(uint bookId, bool isFinished);


    // Struct to align all needed fields for each book
    struct Book {
        uint id;
        string name;
        uint year;
        string author;
        bool isFinished;
    }

    // Array of books which serves as database
    Book[] private bookList;

    // Mapping of each book created to the address of the user
    mapping (uint256 => address) bookToOwner;

    // Function for CREATING new book
    function addBook(string memory _name, uint16 _year, string memory _author, bool _isFinished) external {
        uint256 bookId = bookList.length;
        bookList.push(Book(bookId, _name, _year, _author, _isFinished));
        bookToOwner[bookId] = msg.sender;

        emit SetFinished(msg.sender, bookId);
    }


    // Function for getting Booklist
    function _getBookList(bool isFinished) private view returns (Book[] memory) {
        Book[] memory temporary = new Book[](bookList.length);
        uint counter = 0;

        for (uint i = 0; i < bookList.length, i++) {
            if(bookToOwner[i] == msg.sender && bookList[i].isFinished == isFinished) {
                temporary[counter] = bookList[i];
                counter++;
            }
        }

        Book[] memory result = new Book[](counter) 
        for(uint i = 0; i < counter; i++) {
                result[i] = temporary[i];
        }

        return result;
    }

    // Function for getting read/finished books
    function getFinishedBooks(bool isFinished) external view returns (Book[] memory) {
        return _getBookList(true);
    }

    // Function for getting Unfinished books
    function getUnfinishedBooks(bool isFinished) external view returns (Book[] memory) {
        return _getBookList(false);
    }


    // Function to set a read book to finished
    function setFinishedBook(uint bookId, bool isFinished) external {
        if(bookToOwner[bookId] == msg.sender) {
            bookList[bookId].isFinished = isFinished;
            emit setFinished(bookId, isFinished);
        }
    }
}